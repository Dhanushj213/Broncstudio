import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const code = formData.get('code') as string;
        const merchantId = formData.get('merchantId') as string;
        const transactionId = formData.get('transactionId') as string;
        // In some flows, response comes as body, in redirect it comes as form data

        // We need to verify status with S2S call
        const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
        const env = process.env.PHONEPE_ENV || 'UAT';

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
