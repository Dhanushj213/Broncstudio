'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface CouponValidationResult {
    valid: boolean;
    discountAmount: number;
    couponCode?: string;
    couponType?: 'percentage' | 'fixed_amount' | 'free_shipping';
    message?: string;
}

export async function validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    // 1. Fetch Coupon
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase()) // Case insensitive search usually better, but let's stick to upper
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    // 2. Check Usage Limit
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
        return { valid: false, discountAmount: 0, message: 'Coupon usage limit reached.' };
    }

    // 3. Check Expiry (if you have expiry_date column, currently schema didn't show it but good practice)
    // Assuming schema from view_file: id, code, discount_type, discount_value, usage_count, usage_limit, is_active
    // No expiry_date seen in previous view_file of admin/coupons/page.tsx, but I should check if it exists or add it.
    // For now, reliance on is_active.

    // 4. Calculate Discount
    let discount = 0;
    let type = coupon.discount_type;

    if (coupon.discount_type === 'percentage') {
        discount = (cartTotal * coupon.discount_value) / 100;
        if (discount > cartTotal) discount = cartTotal;
    } else if (coupon.discount_type === 'fixed_amount') {
        discount = coupon.discount_value;
        if (discount > cartTotal) discount = cartTotal;
    } else if (coupon.discount_type === 'free_shipping') {
        // Discount is handled in checkout logic (shipping becomes 0)
        // We set discount value to 0 here to avoid double counting, 
        // or we could try to calculate shipping here but we don't have shipping const in this function easily.
        // Better to return type and let checkout handle it.
        discount = 0;
    }

    return {
        valid: true,
        discountAmount: parseFloat(discount.toFixed(2)),
        couponCode: coupon.code,
        couponType: type, // Add this to interface!
        message: type === 'free_shipping' ? 'Free Shipping Applied!' : 'Coupon applied successfully!'
    };
}
