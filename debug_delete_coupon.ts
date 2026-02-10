
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeleteCoupon() {
    console.log("Attempting to delete a coupon...");

    // First, let's create a dummy coupon to delete
    const { data: insertData, error: insertError } = await supabase
        .from('coupons')
        .insert({
            code: 'DELETE_TEST_' + Date.now(),
            discount_type: 'free_shipping', // We know this works now
            discount_value: 0,
            usage_limit: 1,
            is_active: false
        })
        .select()
        .single();

    if (insertError) {
        console.error("Setup failed - could not insert dummy coupon:", insertError);
        return;
    }

    const couponId = insertData.id;
    console.log(`Created dummy coupon: ${couponId} (${insertData.code})`);

    // Now try to delete it
    const { error: deleteError } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

    if (deleteError) {
        console.error("Delete failed:", deleteError);
    } else {
        console.log("Delete successful!");
    }
}

testDeleteCoupon();
