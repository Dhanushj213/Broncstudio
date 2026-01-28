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
    if (!isAdmin(user.email)) {
        return { success: false, error: 'Access Denied: Not an Admin' };
    }

    // 3. Perform Update (Service Role Bypass)
    // We use the Service Role Key to bypass RLS policies entirely
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        // Fallback: Try using the auth client if Service Role is missing, 
        // but this relies on RLS being correct (which is currently failing).
        console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Attempting update with user context...");
        const { error } = await supabaseAuth
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

    if (updateError) {
        console.error("Admin Action Error:", updateError);
        return { success: false, error: 'Database Update Failed: ' + updateError.message };
    }

    // Auto-Cleanup: Delete personalization images if Order is Finished/Cancelled
    if (newStatus === 'delivered' || newStatus === 'cancelled') {
        const { data: items } = await supabaseAdmin
            .from('order_items')
            .select('metadata')
            .eq('order_id', orderId);

        if (items && items.length > 0) {
            const BUCKET_NAME = 'personalization-uploads';
            const pathsToDelete: string[] = [];

            items.forEach(item => {
                // The custom image is stored in metadata.image_url
                const url = item.metadata?.image_url;
                if (url && typeof url === 'string' && url.includes(`/${BUCKET_NAME}/`)) {
                    // Extract relative path from URL
                    // URL Format: .../storage/v1/object/public/personalization-uploads/folder/filename.png
                    // Split by bucket name to be safe
                    const parts = url.split(`/${BUCKET_NAME}/`);
                    if (parts.length === 2) {
                        const filePath = decodeURIComponent(parts[1]); // Ensure spaces/special chars are handled
                        pathsToDelete.push(filePath);
                    }
                }
            });

            if (pathsToDelete.length > 0) {
                console.log(`[Admin] Cleanup: Deleting ${pathsToDelete.length} images for order ${orderId}`);
                const { error: storageError } = await supabaseAdmin
                    .storage
                    .from(BUCKET_NAME)
                    .remove(pathsToDelete);

                if (storageError) {
                    console.error("[Admin] Image Cleanup Failed:", storageError);
                } else {
                    console.log("[Admin] Image Cleanup Success");
                }
            }
        }
    }

    return { success: true };
}
