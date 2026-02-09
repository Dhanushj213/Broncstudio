-- 1. Wallet Balances Table
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Wallet Ledger Table (Transaction History)
CREATE TABLE IF NOT EXISTS public.wallet_ledger (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- Positive for credit, negative for debit
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    reason TEXT NOT NULL, -- e.g., 'purchase_cashback', 'referral_bonus', 'order_redemption', 'expiry', 'admin_adjustment'
    reference_id TEXT, -- e.g., order_id
    expires_at TIMESTAMP WITH TIME ZONE, -- Only for credits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add wallet_used to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS wallet_amount_used DECIMAL(10, 2) DEFAULT 0.00;

-- 4. RLS Policies
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;

-- Balances: Users can view their own, Admins can view all (if admin logic exists, otherwise strict owner)
CREATE POLICY "Users can view own wallet balance" ON public.wallet_balances
    FOR SELECT USING (auth.uid() = user_id);

-- Ledger: Users can view their own history
CREATE POLICY "Users can view own wallet ledger" ON public.wallet_ledger
    FOR SELECT USING (auth.uid() = user_id);

-- Service Role / Admin policies usually bypass RLS, but for client-side admin dashboards:
-- (Assuming admin is handled via separate role check or service role)

-- 5. Trigger to update updated_at on balance change
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_balance_timestamp
    BEFORE UPDATE ON public.wallet_balances
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_updated_at();
