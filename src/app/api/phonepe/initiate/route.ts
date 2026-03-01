import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { amount, transactionId, mobileNumber } = await req.json();

        const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
        const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
        const env = process.env.PHONEPE_ENV || 'UAT';

        const baseUrl = env === 'PROD'
            ? 'https://api.phonepe.com/apis/hermes'
            : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

        // Assuming your app runs locally or on Vercel
        const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/phonepe/callback`
            : `http://localhost:3000/api/phonepe/callback`;

        const payload = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: 'MUID' + mobileNumber,
            amount: Math.round(amount * 100), // in paise
            redirectUrl: redirectUrl,
            redirectMode: 'POST',
            callbackUrl: redirectUrl,
            mobileNumber: mobileNumber,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payloadString = JSON.stringify(payload);
        const base64Payload = Buffer.from(payloadString).toString('base64');

        const stringToHash = base64Payload + '/pg/v1/pay' + saltKey;
        const sha256Val = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256Val + '###' + saltIndex;

        const response = await fetch(`${baseUrl}/pg/v1/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            },
            body: JSON.stringify({ request: base64Payload })
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ url: data.data.instrumentResponse.redirectInfo.url }, { status: 200 });
        } else {
            console.error('PhonePe Initiation Error:', data);
            return NextResponse.json({ error: data.message || 'Payment initiation failed' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('PhonePe Initiation Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
