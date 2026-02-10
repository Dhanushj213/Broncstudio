
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function listCoupons() {
    const { data, error } = await supabase
        .from('coupons')
        .select('*, orders(count)'); // Try to select related orders count to check usage if relation exists

    if (error) {
        console.log("Error selecting with relation:", error.message);
        // Fallback to simple select
        const { data: simpleData, error: simpleError } = await supabase.from('coupons').select('*');
        console.log("Coupons:", simpleData);
    } else {
        console.log("Coupons with usage:", data);
    }
}

listCoupons();
