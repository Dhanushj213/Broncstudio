
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
    console.log('Adding is_sold_out column to products table...');

    // Using rpc or direct query if possible, but supabase-js doesn't support raw SQL easily unless there's an RPC
    // Usually, migrations should be run via CLI or Dashboard. 
    // Since I can't run raw SQL via supabase-js without an RPC, I'll try to check if it exists first.

    const { data: checkData, error: checkError } = await supabase
        .from('products')
        .select('is_sold_out')
        .limit(1);

    if (checkError && checkError.code === '42703') { // Undefined column
        console.log('Column is_sold_out does not exist. Please apply the migration in Supabase Dashboard:');
        console.log(`
        ALTER TABLE public.products ADD COLUMN is_sold_out BOOLEAN DEFAULT false;
        `);
    } else if (checkError) {
        console.error('Error checking column:', checkError);
    } else {
        console.log('Column is_sold_out already exists.');
    }
}

applyMigration();
