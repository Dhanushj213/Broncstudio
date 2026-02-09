'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface CouponValidationResult {
    valid: boolean;
    discountAmount: number;
    couponCode?: string;
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
    if (coupon.discount_type === 'percentage') {
        discount = (cartTotal * coupon.discount_value) / 100;
        // Optional: Max discount cap? Not in schema yet.
        // Cap at cart total to avoid negative
        if (discount > cartTotal) discount = cartTotal;
    } else if (coupon.discount_type === 'fixed_amount') {
        discount = coupon.discount_value;
        if (discount > cartTotal) discount = cartTotal;
    }

    return {
        valid: true,
        discountAmount: parseFloat(discount.toFixed(2)), // Round to 2 decimal places
        couponCode: coupon.code,
        message: 'Coupon applied successfully!'
    };
}
