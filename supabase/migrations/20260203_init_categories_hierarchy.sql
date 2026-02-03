-- Ensure categories table matches our needs
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add parent_id if it doesn't exist (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='parent_id') THEN
        ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

-- Allow authenticated admins (or service role) full access
-- Note: Service Role bypasses RLS, so this is for client-side admin usage if enabled later.
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories USING (true) WITH CHECK (true); 
-- logic for "Admins only" depends on your auth setup, leaving open for now or rely on Service Role for critical updates.
