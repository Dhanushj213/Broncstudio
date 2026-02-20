import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSchema() {
    // get a valid order id
    const { data: order } = await supabase.from('orders').select('id').limit(1).single();

    if (!order) return console.log("No orders found");

    const { error: insertError } = await supabase
        .from('order_items')
        .insert({
            order_id: order.id,
            product_id: null,
            name: 'Test',
            quantity: 1,
            price: 100
        });

    console.log("Insert Error with product_id=null:", JSON.stringify(insertError, null, 2));
}

checkSchema();
