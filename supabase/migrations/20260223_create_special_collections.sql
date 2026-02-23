-- Migration: Create Special Collections
-- Description: Adds tables for dynamic /special collections and linking products

CREATE TABLE IF NOT EXISTS public.special_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    banner_image TEXT,
    thumbnail_image TEXT,
    is_active BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.special_collection_products (
    collection_id UUID REFERENCES public.special_collections(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (collection_id, product_id)
);

-- Add updated_at trigger for special_collections
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_special_collections_modtime ON public.special_collections;
CREATE TRIGGER update_special_collections_modtime
    BEFORE UPDATE ON public.special_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.special_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_collection_products ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read access to special_collections"
    ON public.special_collections FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to special_collection_products"
    ON public.special_collection_products FOR SELECT
    USING (true);

-- Policies for admin write access
CREATE POLICY "Allow admin all access to special_collections"
    ON public.special_collections FOR ALL
    USING (public.is_admin_or_super_admin());

CREATE POLICY "Allow admin all access to special_collection_products"
    ON public.special_collection_products FOR ALL
    USING (public.is_admin_or_super_admin());
