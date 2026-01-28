
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Using Anon key for simplicity as RLS allows write (or use Service Role if needed)

// WARN: RLS might block delete if not admin. If RLS is strict, we need SERVICE_ROLE_KEY.
// Assuming we are in dev/test environment given the context.

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicates() {
    console.log('🔍 Checking for duplicate products...');

    // 1. Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, created_at')
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    if (!products || products.length === 0) {
        console.log('No products found.');
        return;
    }

    const nameMap = new Map<string, any[]>();

    // 2. Group by Name
    products.forEach(p => {
        const name = p.name.trim(); // Normalize
        if (!nameMap.has(name)) {
            nameMap.set(name, []);
        }
        nameMap.get(name)?.push(p);
    });

    let deletedCount = 0;

    // 3. Identify and Delete Duplicates
    for (const [name, items] of nameMap.entries()) {
        if (items.length > 1) {
            console.log(`\n⚠️ Found ${items.length} duplicates for: "${name}"`);

            // Keep the FIRST one (which is the newest due to order('created_at', descending))
            const toKeep = items[0];
            const toDelete = items.slice(1);

            console.log(`   ✅ Keeping: ${toKeep.id} (Created: ${toKeep.created_at})`);

            for (const item of toDelete) {
                console.log(`   ❌ Deleting: ${item.id} (Created: ${item.created_at})`);

                const { error: delError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', item.id);

                if (delError) {
                    console.error(`      Failed to delete ${item.id}:`, delError.message);
                } else {
                    deletedCount++;
                }
            }
        }
    }

    console.log(`\n🎉 Cleanup complete. Removed ${deletedCount} duplicate products.`);
}

removeDuplicates();
