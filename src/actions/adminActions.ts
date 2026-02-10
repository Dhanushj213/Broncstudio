'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isAdmin } from '@/utils/admin';

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const cookieStore = await cookies();

    // 1. Authenticate User (Standard Client)
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    // 2. Verify Admin Role
    const adminCheck = isAdmin(user.email);

    if (!adminCheck) {
        return { success: false, error: 'Access Denied: Not an Admin' };
    }


    // 3. Determine Client (Service Role or User Context)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let supabaseClient = supabaseAuth;
    let usingServiceRole = false;

    if (serviceRoleKey) {
        supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
        usingServiceRole = true;
    } else {
        // console.warn("[ServerAction] Missing SUPABASE_SERVICE_ROLE_KEY. Fallback to User Context.");
    }

    // 4. Update Status with History
    // First, fetch current history
    const { data: currentOrder, error: fetchError } = await supabaseClient
        .from('orders')
        .select('status_history')
        .eq('id', orderId)
        .single();

    if (fetchError) {
        console.error("Error fetching order history:", fetchError);
        return { success: false, error: 'Failed to fetch order history' };
    }

    const currentHistory = currentOrder?.status_history || [];
    // If mixed types exist or it's null, ensure it's an array
    const historyArray = Array.isArray(currentHistory) ? currentHistory : [];

    const newHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        updated_by: user.email // Optional: track who updated it
    };

    const updatedHistory = [...historyArray, newHistoryEntry];

    const { error: updateError } = await supabaseClient
        .from('orders')
        .update({
            status: newStatus,
            status_history: updatedHistory
        })
        .eq('id', orderId);

    if (updateError) {
        console.error("Order Update Error:", updateError);
        return { success: false, error: 'Database Update Failed: ' + updateError.message };
    }

    // 5. Wallet Cashback Logic (5% on Delivery)
    if (newStatus === 'delivered') {
        const { processWalletTransaction } = await import('./walletActions');

        // Fetch order total to calculate 5%
        // NOTE: We should exclude shipping/tax if possible, but 'total_amount' is usually inclusive.
        // User requested "exclude GST, shipping". 
        // We might need to fetch items to calculate base value or store it separately.
        // For now, let's use total_amount as a proxy or fetch items if we want strictness.
        // Strict Rule: "Exclude GST, shipping".
        // We'd need to re-sum `item.price * item.quantity` (assuming item.price is base).
        // Let's do that for accuracy.

        const { data: orderItems } = await supabaseClient
            .from('order_items')
            .select('price, quantity')
            .eq('order_id', orderId);

        let productValue = 0;
        if (orderItems) {
            productValue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // 5% Cashback
        const cashbackAmount = parseFloat((productValue * 0.05).toFixed(2));

        if (cashbackAmount > 0) {
            // Get User ID from order (we need to fetch it if not in currentOrder)
            const { data: orderUser } = await supabaseClient
                .from('orders')
                .select('user_id')
                .eq('id', orderId)
                .single();

            if (orderUser && orderUser.user_id) {
                await processWalletTransaction({
                    userId: orderUser.user_id,
                    amount: cashbackAmount,
                    type: 'credit',
                    reason: 'purchase_cashback',
                    referenceId: orderId,
                    expiryDays: 30 // 30 days expiry
                });
            }
        }
    } else if (newStatus === 'cancelled' || newStatus === 'returned') {
        // Reverse Wallet if previously credited?
        // Logic: if we credited for this order, we should debit it back.
        // But usually cancellation happens before delivery, so no credit yet.
        // Returns happen after delivery.

        if (newStatus === 'returned') {
            // TODO: Implement reversal logic if needed. 
            // Search ledger for 'purchase_cashback' with this orderId and reverse it.
        }
    }

    // 6. Auto-Cleanup: Delete personalization images
    if (newStatus === 'delivered' || newStatus === 'cancelled') {
        const { data: items } = await supabaseClient
            .from('order_items')
            .select('metadata')
            .eq('order_id', orderId);

        console.log(`[Admin] Cleanup: Found ${items?.length || 0} items for order ${orderId}`);

        if (items && items.length > 0) {
            const BUCKET_NAME = 'personalization-uploads';
            const pathsToDelete: string[] = [];

            items.forEach(item => {
                const url = item.metadata?.image_url;
                if (url && typeof url === 'string' && url.includes(`/${BUCKET_NAME}/`)) {
                    const parts = url.split(`/${BUCKET_NAME}/`);
                    if (parts.length === 2) {
                        const filePath = decodeURIComponent(parts[1]);
                        pathsToDelete.push(filePath);
                        console.log(`[Admin] Cleanup: Scheduled for deletion: ${filePath}`);
                    }
                }
            });

            if (pathsToDelete.length > 0) {
                console.log(`[Admin] Cleanup: Deleting ${pathsToDelete.length} images...`);
                // Use the same client (User or Admin) for storage deletion
                const { data: deleteData, error: storageError } = await supabaseClient
                    .storage
                    .from(BUCKET_NAME)
                    .remove(pathsToDelete);

                if (storageError) {
                    console.error("[Admin] Image Cleanup Failed:", storageError);
                    // Do not fail the whole action, just log
                } else {
                    console.log("[Admin] Image Cleanup Success:", deleteData);
                }
            } else {
                console.log("[Admin] Cleanup: No matching images found to delete.");
            }
        }
    }

    return { success: true };
}

export async function updatePaymentStatus(orderId: string, newStatus: string) {
    const cookieStore = await cookies();

    // 1. Authenticate User (Standard Client)
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    // 2. Verify Admin Role
    if (!isAdmin(user.email)) {
        return { success: false, error: 'Access Denied: Not an Admin' };
    }

    // 3. Determine Client (Service Role for Bypass)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let supabaseClient = supabaseAuth;

    if (serviceRoleKey) {
        supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );
    } else {
        console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Performing actions with User Context (RLS applies).");
    }

    // 4. Update Payment Status
    const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

    if (updateError) {
        console.error("Payment Update Error:", updateError);
        return { success: false, error: 'Database Update Failed: ' + updateError.message };
    }

    return { success: true };
}

export async function undoLastStatusUpdate(orderId: string) {
    const cookieStore = await cookies();

    // 1. Authenticate & Verify Admin
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    );
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) return { success: false, error: 'Unauthorized' };
    if (!isAdmin(user.email)) return { success: false, error: 'Access Denied' };

    // 2. Setup Client (Service Role)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let supabaseClient = supabaseAuth;
    if (serviceRoleKey) {
        supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );
    }

    // 3. Fetch Current History
    const { data: order, error: fetchError } = await supabaseClient
        .from('orders')
        .select('status, status_history')
        .eq('id', orderId)
        .single();

    if (fetchError || !order) return { success: false, error: 'Fetch failed' };

    const history = Array.isArray(order.status_history) ? order.status_history : [];

    // 4. Validate Undo Capability
    // We need at least 1 entry in history to "undo" (by removing it). 
    // Ideally we should have > 0 history.
    // If history has 1 item, removing it -> empty -> status 'pending' (default)
    // If history has > 1 items, remove last -> status becomes the new last item's status.

    if (history.length === 0) {
        return { success: false, error: 'No history to undo' };
    }

    const poppedItem = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    let newStatus = 'pending'; // Default fallback
    if (newHistory.length > 0) {
        newStatus = newHistory[newHistory.length - 1].status;
    }

    // 5. Update DB
    const { error: updateError } = await supabaseClient
        .from('orders')
        .update({
            status: newStatus,
            status_history: newHistory
        })
        .eq('id', orderId);

    if (updateError) {
        return { success: false, error: updateError.message };
    }

    return { success: true, newStatus };
}

export async function manualWalletAdjustment(userId: string, amount: number, type: 'credit' | 'debit', reason: string) {
    const cookieStore = await cookies();

    // 1. Authenticate & Verify Admin
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    );
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) return { success: false, error: 'Unauthorized' };
    if (!isAdmin(user.email)) return { success: false, error: 'Access Denied' };

    // 2. Perform Transaction
    try {
        const { processWalletTransaction } = await import('./walletActions');
        const result = await processWalletTransaction({
            userId,
            amount,
            type,
            reason: reason || 'admin_adjustment',
            // referenceId: `admin_${user.id}_${Date.now()}` // Optional reference
        });

        if (!result.success) {
            return { success: false, error: result.error };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Manual Wallet Adjustment Failed:", err);
        return { success: false, error: err.message || 'Internal Server Error' };
    }
}

export async function toggleBlockUser(userId: string, shouldBlock: boolean, reason: string = '') {
    const cookieStore = await cookies();

    // 1. Authenticate & Verify Admin
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    );
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) return { success: false, error: 'Unauthorized' };
    if (!isAdmin(user.email)) return { success: false, error: 'Access Denied' };

    // 2. Setup Client (Service Role)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) return { success: false, error: 'Server Configuration Error: Missing Service Role' };

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        return { success: false, error: 'Invalid User ID format. Cannot block non-registered users.' };
    }

    if (shouldBlock) {
        // Block - Explicitly specify onConflict to ensure it updates if exists (though usually we just want to ensure it's there)
        const { error } = await supabaseAdmin
            .from('blocked_users')
            .upsert(
                { user_id: userId, reason: reason, blocked_by: user.id },
                { onConflict: 'user_id' }
            )
            .select();

        if (error) {
            console.error("Block User Failed:", error);
            return { success: false, error: error.message };
        }
    } else {
        // Unblock
        const { error } = await supabaseAdmin
            .from('blocked_users')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error("Unblock User Failed:", error);
            return { success: false, error: error.message };
        }
    }

    return { success: true };
}

export async function getBlockedUsers() {
    // 1. Authenticate & Verify Admin (Standard check)
    // Actually, we can just allow public read if we set RLS properly, but fetch here is safer.
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { get(name: string) { return cookieStore.get(name)?.value } },
        }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || !isAdmin(user.email)) return { success: false, error: 'Unauthorized' };

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabaseAdmin
        .from('blocked_users')
        .select('user_id, reason, created_at');

    if (error) {
        console.error("Fetch Blocked Users Failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getAllProfiles() {
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { get(name: string) { return cookieStore.get(name)?.value } },
        }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || !isAdmin(user.email)) return { success: false, error: 'Unauthorized' };

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, phone, full_name');

    if (error) {
        console.error("Fetch Profiles Failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}
