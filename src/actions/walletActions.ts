'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Service Role Client for secure wallet operations (bypassing RLS for credits/debits)
const getServiceRoleClient = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file to enable wallet transactions.");
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

export async function getWalletBalance() {
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
    if (!user) return { balance: 0 };

    const { data, error } = await supabase
        .from('wallet_balances')
        .select('balance')
        .eq('user_id', user.id)
        .single();

    if (error || !data) return { balance: 0 };
    return { balance: Number(data.balance) };
}

export async function getWalletHistory() {
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
    if (!user) return [];

    const { data } = await supabase
        .from('wallet_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return data || [];
}

// Internal function to process transactions securely
export async function processWalletTransaction({
    userId,
    amount, // Postive for credit, negative for debit
    type,
    reason,
    referenceId,
    expiryDays
}: {
    userId: string,
    amount: number,
    type: 'credit' | 'debit',
    reason: string,
    referenceId?: string,
    expiryDays?: number
}) {
    const supabase = getServiceRoleClient();

    // 1. Get current balance (or create if not exists)
    const { data: balanceData, error: balanceError } = await supabase
        .from('wallet_balances')
        .select('balance')
        .eq('user_id', userId)
        .single();

    let currentBalance = 0;

    if (balanceError && balanceError.code === 'PGRST116') {
        // Create wallet
        await supabase.from('wallet_balances').insert({ user_id: userId, balance: 0 });
    } else if (balanceData) {
        currentBalance = Number(balanceData.balance);
    }

    // 2. Validate Debit
    if (type === 'debit') {
        if (Math.abs(amount) > currentBalance) {
            return { success: false, error: 'Insufficient wallet balance' };
        }
    }

    // 3. Update Balance
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
        .from('wallet_balances')
        .update({ balance: newBalance })
        .eq('user_id', userId);

    if (updateError) {
        console.error('Wallet Update Error:', updateError);
        return { success: false, error: 'Failed to update balance' };
    }

    // 4. Log Transaction
    let expiresAt = null;
    if (type === 'credit' && expiryDays) {
        const date = new Date();
        date.setDate(date.getDate() + expiryDays);
        expiresAt = date.toISOString();
    }

    await supabase.from('wallet_ledger').insert({
        user_id: userId,
        amount,
        type,
        reason,
        reference_id: referenceId,
        expires_at: expiresAt
    });

    return { success: true, newBalance };
}

// Helper to check validity (must be async if exported from 'use server' file)
export async function calculateEligibleWalletUsage(cartTotal: number, currentBalance: number) {
    // Rules:
    // 1. Min order ₹999
    // 2. Max 10% of cart total
    // 3. Max available balance

    if (cartTotal < 999) return 0;

    const maxByPolicy = cartTotal * 0.10; // 10%
    const usable = Math.min(maxByPolicy, currentBalance);

    // Round down to 2 decimals
    return parseFloat(usable.toFixed(2));
}
