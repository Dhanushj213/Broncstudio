
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Using anon key, hoping RLS allows reading if tables public or existing. Ideally use Service Role if available but user context only gives anon.
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking tables...');

    // Check subscribers
    const { error: subError } = await supabase.from('subscribers').select('count', { count: 'exact', head: true });
    if (subError) {
        console.log('Error accessing subscribers table:', subError.message);
        console.log('Hint: Table "subscribers" might not exist or RLS is blocking access.');
    } else {
        console.log('Table "subscribers" exists and is accessible.');
    }

    // Check contact_messages
    const { error: msgError } = await supabase.from('contact_messages').select('count', { count: 'exact', head: true });
    if (msgError) {
        console.log('Error accessing contact_messages table:', msgError.message);
        console.log('Hint: Table "contact_messages" might not exist or RLS is blocking access.');
    } else {
        console.log('Table "contact_messages" exists and is accessible.');
    }
}

checkTables();
