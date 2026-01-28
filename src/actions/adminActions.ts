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

    // 5. Auto-Cleanup: Delete personalization images
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
