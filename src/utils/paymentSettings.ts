import { createClient } from '@supabase/supabase-js';

// Server-side only Supabase client using Service Role
// This bypasses RLS and should NEVER be exposed to the client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface PaymentSettings {
    razorpay_active: boolean;
    razorpay_key_id: string | null;
    razorpay_key_secret: string | null;

    phonepe_active: boolean;
    phonepe_merchant_id: string | null;
    phonepe_salt_key: string | null;
    phonepe_salt_index: string | null;
    phonepe_env: 'UAT' | 'PROD';
}

/**
 * Fetches the payment gateway settings securely from the database.
 * Uses environment variables as fallbacks if the database table is empty or missing.
 */
export async function getPaymentSettings(): Promise<PaymentSettings> {
    try {
        const { data, error } = await supabaseAdmin
            .from('payment_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.warn("Could not fetch payment_settings from DB (maybe migration hasn't run), falling back to ENV variables.");
        }

        return {
            razorpay_active: data?.razorpay_active ?? process.env.NEXT_PUBLIC_RAZORPAY_ACTIVE === 'true',
            razorpay_key_id: data?.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null,
            razorpay_key_secret: data?.razorpay_key_secret || process.env.RAZORPAY_KEY_SECRET || null,

            phonepe_active: data?.phonepe_active ?? process.env.NEXT_PUBLIC_PHONEPE_ACTIVE === 'true',
            phonepe_merchant_id: data?.phonepe_merchant_id || process.env.PHONEPE_MERCHANT_ID || null,
            phonepe_salt_key: data?.phonepe_salt_key || process.env.PHONEPE_SALT_KEY || null,
            phonepe_salt_index: data?.phonepe_salt_index || process.env.PHONEPE_SALT_INDEX || '1',
            phonepe_env: data?.phonepe_env || process.env.PHONEPE_ENV || 'UAT',
        };
    } catch (err) {
        console.error("getPaymentSettings exception:", err);
        return {
            razorpay_active: false,
            razorpay_key_id: null,
            razorpay_key_secret: null,
            phonepe_active: false,
            phonepe_merchant_id: null,
            phonepe_salt_key: null,
            phonepe_salt_index: '1',
            phonepe_env: 'UAT',
        };
    }
}
