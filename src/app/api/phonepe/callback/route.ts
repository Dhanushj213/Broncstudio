import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getPaymentSettings } from '@/utils/paymentSettings';

export async function POST(req: Request) {
    try {
        const urlRequest = new URL(req.url);
        // Sometimes PhonePe sends data as form-urlencoded base64, sometimes JSON.
        // Handling both requires parsing body. For now, assuming standard s2s callback
        const bodyText = await req.text();
        const bodyObj = JSON.parse(bodyText);

        // In some flows, response comes as body, in redirect it comes as form data
        // For now, assuming merchantId and transactionId are part of the body for S2S callback
        const merchantId = bodyObj.merchantId as string;
        const transactionId = bodyObj.transactionId as string;
        const code = bodyObj.code as string; // Assuming code is also in the body if needed

        // We need to verify status with S2S call
        const settings = await getPaymentSettings();

        const saltKey = settings.phonepe_salt_key;
        const saltIndex = settings.phonepe_salt_index || '1';
        const env = settings.phonepe_env || 'UAT';

        if (!saltKey) {
            return NextResponse.json({ error: 'PhonePe keys not configured.' }, { status: 500 });
        }

        const baseUrl = env === 'PROD'
            ? 'https://api.phonepe.com/apis/hermes'
            : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

        const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
        const sha256Val = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256Val + '###' + saltIndex;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchantId
            }
        };

        const statusResponse = await fetch(`${baseUrl}/pg/v1/status/${merchantId}/${transactionId}`, options);
        const data = await statusResponse.json();

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        if (data.success && data.code === 'PAYMENT_SUCCESS') {
            // Update Supabase
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            // Note: transactionId here is expected to be our 'orderId' if we generated it that way
            const { error: updateError } = await supabase
                .from('orders')
                .update({ payment_status: 'paid' })
                .eq('id', transactionId);

            if (updateError) {
                console.error("Failed to update PhonePe order status:", updateError);
            }

            return NextResponse.redirect(`${siteUrl}/checkout?status=success&orderId=${transactionId}`, 302);
        } else {
            return NextResponse.redirect(`${siteUrl}/checkout?status=failed&orderId=${transactionId}`, 302);
        }
    } catch (error: any) {
        console.error('PhonePe Callback Exception:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?status=failed`, 302);
    }
}
