import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        const { amount, receipt } = await req.json();

        // 1. Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
        });

        // 2. Create Order in Razorpay
        // Amount should be in paise (e.g., 100 INR = 10000 paise)
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: receipt || 'rcptid_' + Math.floor(Math.random() * 1000000),
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        // 3. Return the created order
        return NextResponse.json({ order }, { status: 200 });

    } catch (error: any) {
        console.error("Razorpay Create Order Error:", error);
        return NextResponse.json({ error: error.message || 'Error creating Razorpay order' }, { status: 500 });
    }
}
