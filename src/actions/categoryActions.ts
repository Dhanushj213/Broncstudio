'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isAdmin } from '@/utils/admin';

// Helper to get authenticated admin client
async function getAdminClient() {
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value }
            }
        }
    );

    const { data: { user }, error } = await supabaseAuth.auth.getUser();
    if (error || !user || !isAdmin(user.email)) {
        throw new Error('Unauthorized');
    }

    return supabaseAuth;
}

export async function getCategoryTree() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value }
            }
        }
    );

    // Fetch all categories (Public Read is enabled, so no need for strict admin check just to view)
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) throw new Error(error.message);

    // Build Tree
    const roots: any[] = [];
    const map: Record<string, any> = {};

    data.forEach((cat) => {
        map[cat.id] = { ...cat, children: [] };
    });

    data.forEach((cat) => {
        if (cat.parent_id) {
            if (map[cat.parent_id]) {
                map[cat.parent_id].children.push(map[cat.id]);
            }
        } else {
            roots.push(map[cat.id]);
        }
    });

    return roots;
}

export async function createCategory(data: any) {
    try {
        const supabase = await getAdminClient();
        const { error } = await supabase.from('categories').insert(data);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateCategory(id: string, data: any) {
    try {
        const supabase = await getAdminClient();
        const { error } = await supabase
            .from('categories')
            .update(data)
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await getAdminClient();
        // Check for children? Database ON DELETE CASCADE handles it, but maybe warn user in UI.
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
