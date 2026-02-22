import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260222_maintenance_mode.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');

    // Split SQL into individual statements for execution
    // Note: This is a simple split and might not handle complex DO blocks or triggers perfectly,
    // but for this migration it should be fine if we use the Dashboard or a better tool.
    // However, since I have service role, I can try to run it.

    // Actually, running complex multi-statement SQL via supabase-js is tricky without an RPC.
    // I will try to run the main parts separately or use a single request if possible.

    // Let's try to run it via an RPC if available, or just run the key parts.
    // Most Supabase projects don't have a generic 'exec_sql' RPC for security reasons.

    console.log('Please run the following SQL in the Supabase Dashboard SQL Editor for best results:');
    console.log(sql);

    // I'll attempt to run it using a temporary script that uses raw PG if possible, 
    // but typically I only have access to the Supabase client.
}

applyMigration();
