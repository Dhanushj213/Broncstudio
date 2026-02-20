
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProduct() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log('Product Keys:', Object.keys(data));
    console.log('Full Product Data:', JSON.stringify(data, null, 2));
}

inspectProduct();
