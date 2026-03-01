import { NextResponse } from 'next/server';
import { getPaymentSettings } from '@/utils/paymentSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await getPaymentSettings();

        // ONLY expose safe public keys and active statuses to the client side.
        // ABSOLUTELY DO NOT expose razorpay_key_secret or phonepe_salt_key.
        return NextResponse.json({
            razorpay_active: settings.razorpay_active,
            razorpay_key_id: settings.razorpay_key_id,
            phonepe_active: settings.phonepe_active,
            // phonepe_merchant_id is generally needed if doing client-side things, but our initiate route handles it server-side.
            // So we just need to know if it's active.
        }, { status: 200 });
    } catch (error) {
        console.error("Payment Config Error:", error);
        return NextResponse.json({ error: 'Failed to fetch payment config' }, { status: 500 });
    }
}
