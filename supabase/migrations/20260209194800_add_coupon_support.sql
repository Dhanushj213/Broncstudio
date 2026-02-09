-- Migration to add coupon support to orders and counting
-- Add columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Create RPC to safely increment usage count
CREATE OR REPLACE FUNCTION increment_coupon_usage(code_input TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE coupons
  SET usage_count = usage_count + 1
  WHERE code = code_input;
END;
$$;
