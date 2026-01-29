const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
    const { count, error } = await supabase
        .from('curated_sections')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking data:', error);
    } else {
        console.log(`Found ${count} rows in curated_sections table.`);
    }
}

checkData();
