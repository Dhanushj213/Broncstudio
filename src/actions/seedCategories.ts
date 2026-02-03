'use server';

import { createClient } from '@supabase/supabase-js';
import { CATEGORY_TAXONOMY } from '@/data/categories';

export async function seedCategories() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
        return { success: false, error: 'Missing SUPABASE_SERVICE_ROLE_KEY' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log("Starting Category Seed...");

    try {
        // Option A: Wipe existing Categories? 
        // Ideally checking first. For this task, user wants "perfect control", implying we set the state.
        // BE CAREFUL: Deleting categories might cascade delete products if foreign keys are strict.
        // Let's assume we Upsert based on Slug to be safer, or verify.
        // But hierarchy is tricky with upsert if IDs change.
        // Decision: We will attempt to UPSERT worlds, then subcats, then items.

        for (const worldKey in CATEGORY_TAXONOMY) {
            const world = CATEGORY_TAXONOMY[worldKey as keyof typeof CATEGORY_TAXONOMY];
            console.log(`Processing World: ${world.name}`);

            // 1. Upsert World
            const { data: worldData, error: worldError } = await supabase
                .from('categories')
                .upsert({
                    slug: world.slug,
                    name: world.name,
                    description: world.description,
                    image_url: world.image,
                    parent_id: null
                }, { onConflict: 'slug' })
                .select()
                .single();

            if (worldError) throw new Error(`Failed to upsert world ${world.name}: ${worldError.message}`);
            const worldId = worldData.id;

            // 2. Process Subcategories
            if (world.subcategories) {
                for (const sub of world.subcategories) {
                    console.log(`  - Sub: ${sub.name}`);
                    const { data: subData, error: subError } = await supabase
                        .from('categories')
                        .upsert({
                            slug: sub.slug,
                            name: sub.name,
                            parent_id: worldId
                            // description? image? mostly null in current data
                        }, { onConflict: 'slug' })
                        .select()
                        .single();

                    if (subError) throw new Error(`Failed to upsert sub ${sub.name}: ${subError.message}`);
                    const subId = subData.id;

                    // 3. Process Items
                    if (sub.items) {
                        for (const item of sub.items) {
                            console.log(`    - Item: ${item.name}`);
                            const { error: itemError } = await supabase
                                .from('categories')
                                .upsert({
                                    slug: item.slug,
                                    name: item.name,
                                    parent_id: subId
                                }, { onConflict: 'slug' });

                            if (itemError) throw new Error(`Failed to upsert item ${item.name}: ${itemError.message}`);
                        }
                    }
                }
            }
        }

        return { success: true, message: 'Taxonomy migrated successfully!' };

    } catch (err: any) {
        console.error("Seeding Error:", err);
        return { success: false, error: err.message };
    }
}
