
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WASTE_NAMES = [
    'Pawfect Picks',
    'Everyday Icons',
    'Space Stories',
    'Little Luxuries',
    'Style Extras',
    'Little Legends'
];

async function main() {
    // 1. Get IDs of Waste Departments
    const { data: parents } = await supabase
        .from('categories')
        .select('id, name')
        .in('name', WASTE_NAMES);

    if (!parents || parents.length === 0) {
        console.log('No waste departments found.');
        return;
    }

    const parentIds = parents.map(p => p.id);
    console.log('Found Waste Parents:', parents.map(p => p.name));

    // 2. Get All Descendants (Children, Grandchildren...)
    const { data: allCats } = await supabase.from('categories').select('id, parent_id');

    if (!allCats) return;

    const toDeleteIds = new Set(parentIds);
    let changed = true;
    while (changed) {
        changed = false;
        allCats.forEach(c => {
            if (c.parent_id && toDeleteIds.has(c.parent_id) && !toDeleteIds.has(c.id)) {
                toDeleteIds.add(c.id);
                changed = true;
            }
        });
    }

    console.log(`Identified ${toDeleteIds.size} categories to delete (parents + children).`);

    // 3. Delete Products in these categories
    console.log('Deleting associated products...');
    const { error: prodDelError } = await supabase
        .from('products')
        .delete()
        .in('category_id', Array.from(toDeleteIds));

    if (prodDelError) {
        console.error('Product delete failed:', prodDelError);
        return;
    }
    console.log('Successfully deleted associated products.');

    // 4. Delete Categories
    console.log('Deleting categories...');
    const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .in('id', Array.from(toDeleteIds));

    if (deleteError) {
        console.error('Delete failed:', deleteError);
    } else {
        console.log('Successfully deleted waste departments.');
    }
}

main();
