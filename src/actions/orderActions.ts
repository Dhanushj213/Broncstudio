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
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
}

export async function createOrder(items: CartItem[], address: ShippingAddress, total: number, paymentMethod: string) {
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

    // 2. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: total,
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

    // 3. Insert Order Items
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId, // Ensure this relies on the real UUID
        name: item.name,
        quantity: item.qty,
        price: item.price,
        size: item.size,
        image_url: item.image
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error("Order Items Error:", itemsError);
        // Optional: Delete the order if items fail? Or keep for manual check.
        return { success: false, error: 'Failed to save order items.' };
    }

    return { success: true, orderId: order.id };
}
