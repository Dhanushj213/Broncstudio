
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspect() {
    console.log('--- Checking for Leaf Categories ---');
    // Check for a few expected leaf slugs
    const slugsToCheck = ['men-classic-crew', 'women-dresses', 'kids-books'];
    const { data: leafCats, error: leafError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .in('slug', slugsToCheck);

    if (leafError) console.error(leafError);
    console.log('Leaf Categories Found:', leafCats);

    console.log('\n--- Checking 5 Random Products ---');
    // Removed invalid columns
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, category_id')
        .limit(5);

    if (prodError) console.error(prodError);
    console.table(products);

    if (products && products.length > 0) {
        console.log('\n--- Resolving Product Categories ---');
        const catIds = products.map(p => p.category_id).filter(id => id);
        if (catIds.length > 0) {
            const { data: resolvedCats } = await supabase
                .from('categories')
                .select('id, name, slug')
                .in('id', catIds);
            console.table(resolvedCats);
        }
    }
}

inspect();
