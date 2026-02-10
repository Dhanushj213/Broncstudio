
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback if not found, but we need service role
);

async function inspectOrder() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1)
        .single(); // Get one order

    if (error) {
        console.error("Error fetching order:", error);
    } else {
        console.log("Full Order Sample:", JSON.stringify(data, null, 2));
    }
}

inspectOrder();
