import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function findProductUUID() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name');

    if (error) {
        console.error("Error fetching products:", error);
    } else {
        console.log("Found Products:");
        console.table(data);
    }
}

findProductUUID();
