-- COMPREHENSIVE RLS & SECURITY FIXES (2026-02-25) - REVISED
-- Addressing the "9 Security Issues" with robust existence checks.

DO $$ 
BEGIN
    -- 1. content_blocks
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') THEN
        ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view content blocks" ON public.content_blocks;
        CREATE POLICY "Public can view content blocks" ON public.content_blocks FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admins can manage content blocks" ON public.content_blocks;
        CREATE POLICY "Admins can manage content blocks" ON public.content_blocks FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 2. orders
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
        CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
        DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
        CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 3. order_items
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
        CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
        DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
        CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 4. coupons
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'coupons') THEN
        ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Only admins can insert coupons." ON public.coupons;
        CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT WITH CHECK (public.is_admin_or_super_admin());
        DROP POLICY IF EXISTS "Only admins can update coupons." ON public.coupons;
        CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE USING (public.is_admin_or_super_admin());
        DROP POLICY IF EXISTS "Only admins can delete coupons." ON public.coupons;
        CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE USING (public.is_admin_or_super_admin());
    END IF;

    -- 5. brands
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'brands') THEN
        ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
        CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 6. device_models
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'device_models') THEN
        ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Admins can manage device_models" ON public.device_models;
        CREATE POLICY "Admins can manage device_models" ON public.device_models FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 7. case_types
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'case_types') THEN
        ALTER TABLE public.case_types ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Admins can manage case_types" ON public.case_types;
        CREATE POLICY "Admins can manage case_types" ON public.case_types FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 8. product_compatibility
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_compatibility') THEN
        ALTER TABLE public.product_compatibility ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Admins can manage product_compatibility" ON public.product_compatibility;
        CREATE POLICY "Admins can manage product_compatibility" ON public.product_compatibility FOR ALL USING (public.is_admin_or_super_admin());
    END IF;

    -- 9. site_events
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_events') THEN
        ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Admin All Events" ON public.site_events;
        CREATE POLICY "Admins can manage site_events" ON public.site_events FOR ALL USING (public.is_admin_or_super_admin());
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
