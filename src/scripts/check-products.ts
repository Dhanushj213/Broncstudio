
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log('Checking for personalization products...');

    // Check 1: All products with metadata->>type = 'personalization_base'
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('metadata->>type', 'personalization_base');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} personalization base products.`);

    products.forEach(p => {
        console.log(`- ID: ${p.id}`);
        console.log(`  Name: ${p.name}`);
        console.log(`  Type: ${p.metadata?.type}`);
        console.log(`  Product Type: ${p.metadata?.product_type}`);
        console.log(`  Gender Supported: ${p.metadata?.gender_supported}`);
        console.log('---');
    });
}

checkProducts();
