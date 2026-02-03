
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_text') THEN
        ALTER TABLE store_settings ADD COLUMN announcement_text TEXT DEFAULT 'Free Shipping on all orders over $50';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_link') THEN
        ALTER TABLE store_settings ADD COLUMN announcement_link TEXT DEFAULT '/shop/new-arrivals';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_active') THEN
        ALTER TABLE store_settings ADD COLUMN announcement_active BOOLEAN DEFAULT true;
    END IF;
END $$;
