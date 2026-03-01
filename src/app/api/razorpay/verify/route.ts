import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // Our internal Supabase Order ID
        } = await req.json();

        // 1. Verify Signature
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
        }

        // 2. Update Supabase Order Status using Service Role to bypass RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role to update orders securely
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (orderId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    // Store the razorpay transaction IDs if needed into a meta column or dedicated column
                })
                .eq('id', orderId);

            if (updateError) {
                console.error("Failed to update order status post-payment:", updateError);
                return NextResponse.json({ error: 'Payment verified, but failed to update order status.' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, message: 'Payment verified successfully' }, { status: 200 });

    } catch (error: any) {
        console.error("Razorpay Verify Error:", error);
        return NextResponse.json({ error: error.message || 'Error verifying Razorpay payment' }, { status: 500 });
    }
}
