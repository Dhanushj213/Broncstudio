
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTables() {
    console.log('Debugging tables with INSERT...');

    // Try inserting into subscribers
    console.log('Attempting INSERT into subscribers...');
    const { data: subData, error: subError } = await supabase
        .from('subscribers')
        .insert([{ email: `test_${Date.now()}@debug.com`, created_at: new Date().toISOString() }])
        .select();

    if (subError) {
        console.error('Subscribers INSERT Error:', subError);
    } else {
        console.log('Subscribers INSERT Success:', subData);
    }

    // Try inserting into contact_messages
    console.log('Attempting INSERT into contact_messages...');
    const { data: msgData, error: msgError } = await supabase
        .from('contact_messages')
        .insert([{
            name: 'Debug Bot',
            email: 'debug@bot.com',
            message: 'Debug message',
            created_at: new Date().toISOString()
        }])
        .select();

    if (msgError) {
        console.error('Contact Messages INSERT Error:', msgError);
    } else {
        console.log('Contact Messages INSERT Success:', msgData);
    }
}

debugTables();
