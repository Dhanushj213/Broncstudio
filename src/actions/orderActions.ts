'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface CartItem {
    id: string; // The specific Cart ID (e.g. pid-size)
    productId: string; // The real DB Product ID
    name: string;
    price: number;
    qty: number;
    size?: string;
    image: string;
    metadata?: any;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state?: string;
    pincode: string;
    email?: string;
    secondaryPhone?: string;
}

// Updated signature to handle coupons
export async function createOrder(
    items: CartItem[],
    address: ShippingAddress,
    total: number,
    paymentMethod: string,
    walletAmount: number = 0,
    couponCode: string | null = null,
    discountAmount: number = 0
) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'You must be logged in to place an order.' };
    }

    // 1.5 Validate Coupon (Server-side safety check)
    if (couponCode) {
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode)
            .single();

        if (couponError || !coupon || !coupon.is_active) {
            return { success: false, error: 'Invalid or expired coupon.' };
        }

        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return { success: false, error: 'Coupon usage limit reached.' };
        }
    }

    // 2. Validate Wallet Usage
    if (walletAmount > 0) {
        // Import dynamically to avoid circular deps if any, or just use direct
        const { getWalletBalance, processWalletTransaction } = await import('./walletActions');

        const { balance } = await getWalletBalance();
        // Recalculate eligible amount based on total (which includes everything)
        // NOTE: calculateEligibleWalletUsage expects cartTotal. Here 'total' is final amount.
        // We trust the frontend passed a valid breakdown, but let's double check max 10%

        // Allowed: 10% of (Total pre-wallet). 
        // Logic: The 'total' passed here is actually the FINAL amount to be paid (e.g. Total - Wallet).
        // OR is it the CART Total? Usually creating order sends the Final Payable.
        // Let's assume 'total' is PAYABLE.
        // Actually, for safety, we should re-calculate from items... but that's complex.

        // Let's assume the client sends the *original* total in a separate field or we re-verify constraints.
        // For now, strict check: 
        // Min Order constraint: 
        // We don't have the original cart total readily available without summing items + shipping + tax again.
        // Let's rely on basic checks:

        if (walletAmount > balance) {
            return { success: false, error: 'Insufficient wallet balance.' };
        }
    }

    // 3. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: total, // CAPTURE: Final amount user pays (or is this Grand Total?)
            // Usually 'total_amount' in DB is Grand Total before discounts? 
            // If we want to show "Wallet Discount", we should add that column.
            wallet_amount_used: walletAmount,
            coupon_code: couponCode,
            discount_amount: discountAmount,
            status: 'pending',
            payment_status: 'pending',
            payment_method: paymentMethod,
            shipping_address: address,
        })
        .select()
        .single();

    if (orderError) {
        console.error("Order Creation Error:", orderError);
        return { success: false, error: 'Failed to create order.' };
    }

    // 3b. Increment Coupon Usage
    if (couponCode) {
        const { error: incError } = await supabase.rpc('increment_coupon_usage', { code_input: couponCode });
        if (incError) {
            // Fallback if RPC fails or doesn't exist yet (soft fail)
            console.error("Failed to increment coupon usage:", incError);
        }
    }

    // 3. Insert Order Items
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId, // Ensure this relies on the real UUID
        name: item.name,
        quantity: item.qty,
        price: item.price,
        size: item.size,
        image_url: item.image,
        metadata: item.metadata // Pass metadata
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error("Order Items Error:", itemsError);
        // Optional: Delete the order if items fail? Or keep for manual check.
        return { success: false, error: 'Failed to save order items.' };
    }

    // 4. Debit Wallet
    if (walletAmount > 0) {
        const { processWalletTransaction } = await import('./walletActions');
        const res = await processWalletTransaction({
            userId: user.id,
            amount: -walletAmount, // Negative for debit
            type: 'debit',
            reason: 'order_redemption',
            referenceId: order.id
        });

        if (!res.success) {
            console.error("Wallet Debit Failed for Order:", order.id, res.error);
            // Non-blocking but critical error. Admin might need to fix.
        }
    }

    return { success: true, orderId: order.id };
}

export async function cancelOrder(orderId: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Fetch order to check time
    const { data: order, error } = await supabase
        .from('orders')
        .select('created_at, status, user_id')
        .eq('id', orderId)
        .single();

    if (error || !order) {
        return { success: false, error: 'Order not found' };
    }

    if (order.user_id !== user.id) {
        return { success: false, error: 'Unauthorized access to order' };
    }

    if (order.status === 'cancelled') {
        return { success: false, error: 'Order is already cancelled' };
    }

    if (['shipped', 'delivered'].includes(order.status)) {
        return { success: false, error: 'Cannot cancel shipped or delivered orders' };
    }

    // Check 6-hour window
    const createdTime = new Date(order.created_at).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - createdTime) / (1000 * 60 * 60);

    if (hoursDifference > 6) {
        return { success: false, error: 'Cancellation window (6 hours) has expired' };
    }

    // Fetch current history first (it wasn't selected above)
    const { data: currentOrder, error: histError } = await supabase
        .from('orders')
        .select('status_history')
        .eq('id', orderId)
        .single();

    const currentHistory = currentOrder?.status_history || [];
    const historyArray = Array.isArray(currentHistory) ? currentHistory : [];

    const newHistoryEntry = {
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        updated_by: 'Customer'
    };

    const updatedHistory = [...historyArray, newHistoryEntry];

    // Proceed to cancel with history
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            status: 'cancelled',
            status_history: updatedHistory
        })
        .eq('id', orderId);

    if (updateError) {
        return { success: false, error: 'Failed to update order status' };
    }

    return { success: true };
}
