-- Add total_stock to products if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='total_stock') THEN
        ALTER TABLE public.products ADD COLUMN total_stock INTEGER DEFAULT 0;
    END IF;
END $$;

-- Drop function if it exists to recreate
DROP FUNCTION IF EXISTS public.get_limited_drop_stats(UUID);

-- Create function to calculate dynamic stats
CREATE OR REPLACE FUNCTION public.get_limited_drop_stats(target_product_id UUID)
RETURNS TABLE (
    remaining_stock INTEGER,
    sales_24h INTEGER,
    total_stock INTEGER
) AS $$
DECLARE
    p_total_stock INTEGER;
    sold_quantity INTEGER;
    recent_sales INTEGER;
BEGIN
    -- Get base total stock
    SELECT products.total_stock INTO p_total_stock
    FROM public.products
    WHERE id = target_product_id;

    -- Calculate total sold (paid & approved/processing/shipped/delivered)
    SELECT COALESCE(SUM(oi.quantity), 0) INTO sold_quantity
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.product_id = target_product_id
    AND o.payment_status = 'paid'
    AND o.status IN ('processing', 'shipped', 'delivered');

    -- Calculate sales in last 24 hours
    SELECT COALESCE(SUM(oi.quantity), 0) INTO recent_sales
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.product_id = target_product_id
    AND o.payment_status = 'paid'
    AND o.status IN ('processing', 'shipped', 'delivered')
    AND o.created_at >= NOW() - INTERVAL '24 hours';

    RETURN QUERY SELECT 
        GREATEST(0, p_total_stock - sold_quantity)::INTEGER,
        recent_sales::INTEGER,
        p_total_stock::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
