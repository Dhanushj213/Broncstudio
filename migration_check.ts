
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Using anon key might not be enough for schema mods, but let's try or use service role if available in env
const supabase = createClient(supabaseUrl, supabaseKey);

async function addTagsColumn() {
    // Attempt to add column via raw SQL if possible, or just log that we need to do it manually/via migration
    // Since I can't run DDL with anon key usually, I'll check if I have a service role key in env

    console.log('Checking for SERVICE_ROLE_KEY...');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        console.error('No SUPABASE_SERVICE_ROLE_KEY found. Cannot modify schema automatically.');
        console.log('Please run this SQL in Supabase Dashboard:');
        console.log('ALTER TABLE products ADD COLUMN tags text[] DEFAULT \'{}\';');
        console.log('CREATE INDEX idx_products_tags ON products USING GIN(tags);');
        return;
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if column exists first
    const { error: checkError } = await adminSupabase
        .from('products')
        .select('tags')
        .limit(1);

    if (checkError && checkError.message.includes('does not exist')) {
        console.log('Column "tags" does not exist. Adding it...');
        // Supabase-js doesn't support generic SQL execution easily without RPC.
        // I will assume I need to ask the user or if I can use a predefined RPC.
        // For now, I'll try to use the rpc 'exec_sql' if it exists, otherwise I'll just print the SQL.

        console.log('NOTE: Use the Supabase Dashboard SQL Editor to run:');
        console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS tags text[] DEFAULT \'{}\';');
        console.log('CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);');
    } else {
        console.log('Column "tags" might already exist or another error occurred:', checkError?.message || 'No error');
    }
}

addTagsColumn();
