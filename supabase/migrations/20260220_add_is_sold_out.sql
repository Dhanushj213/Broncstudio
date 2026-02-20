-- Add is_sold_out to products if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_sold_out') THEN
        ALTER TABLE public.products ADD COLUMN is_sold_out BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing products to have is_sold_out based on stock_status if needed
-- However, the user specifically asked for a toggle, so we just add the column for now.
