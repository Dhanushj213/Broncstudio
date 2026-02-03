
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSchema() {
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns:', data && data.length > 0 ? Object.keys(data[0]) : 'Table empty or accessible');
        // If empty, try inserting a test row to see basic cols if strictly typed, but JS won't show unseen cols. 
        // Better: inspect error if I try to select a non-existent column? 
        // Or just blindly add the column via migration.
    }
}

checkSchema();
