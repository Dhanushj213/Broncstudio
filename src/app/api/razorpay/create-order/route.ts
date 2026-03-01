import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getPaymentSettings } from '@/utils/paymentSettings';

export async function POST(req: Request) {
    try {
        const { amount, receipt } = await req.json();

        // 1. Fetch secure gateway settings
        const settings = await getPaymentSettings();

        if (!settings.razorpay_active) {
            return NextResponse.json({ error: 'Razorpay is currently disabled.' }, { status: 403 });
        }

        if (!settings.razorpay_key_id || !settings.razorpay_key_secret) {
            return NextResponse.json({ error: 'Razorpay keys are not configured.' }, { status: 500 });
        }

        // 2. Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: settings.razorpay_key_id,
            key_secret: settings.razorpay_key_secret,
        });

        // 3. Create Order in Razorpay
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
