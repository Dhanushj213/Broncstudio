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

    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

    if (error) {
        console.error("Admin Action Error:", error);
        return { success: false, error: 'Database Update Failed: ' + error.message };
    }

    return { success: true };
}
