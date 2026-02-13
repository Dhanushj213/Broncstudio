-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Device Models Table
CREATE TABLE IF NOT EXISTS device_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Case Types Table
CREATE TABLE IF NOT EXISTS case_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Compatibility Table
CREATE TABLE IF NOT EXISTS product_compatibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  device_model_id UUID REFERENCES device_models(id) ON DELETE CASCADE,
  stock INT DEFAULT 0,
  sku TEXT UNIQUE,
  price_override DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, device_model_id)
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public can view device_models" ON device_models FOR SELECT USING (true);
CREATE POLICY "Public can view case_types" ON case_types FOR SELECT USING (true);
CREATE POLICY "Public can view product_compatibility" ON product_compatibility FOR SELECT USING (true);

-- Admin Manage Access (Assuming Service Role or specific logic later)
CREATE POLICY "Admins can manage brands" ON brands USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage device_models" ON device_models USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage case_types" ON case_types USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage product_compatibility" ON product_compatibility USING (true) WITH CHECK (true);
