
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Categories ---');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .limit(10);

    if (catError) console.error(catError);
    console.table(categories);

    console.log('\n--- Products ---');
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, category_id, category_slug, subcategory_slug')
        .limit(10);

    if (prodError) console.error(prodError);
    console.table(products);
}

inspect();
