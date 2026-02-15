
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAddress() {
    console.log('Verifying address in content_blocks...');

    const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('section_id', 'global_social_links')
        .single();

    if (error) {
        console.error('Error fetching global_social_links:', error);
        return;
    }

    console.log('Retrieved Data:', JSON.stringify(data, null, 2));

    if (data && data.content) {
        if (data.content.address) {
            console.log('SUCCESS: Address found in DB:', data.content.address);
        } else {
            console.log('FAILURE: Address NOT found in DB content.');
        }
    } else {
        console.log('FAILURE: No content found.');
    }
}

verifyAddress().catch(console.error);
