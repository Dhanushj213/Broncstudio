-- 1. Insert Brands
INSERT INTO brands (name, slug) VALUES 
('Apple', 'apple'),
('Samsung', 'samsung'),
('OnePlus', 'oneplus')
ON CONFLICT (slug) DO NOTHING;

-- Get Brand IDs
DO $$
DECLARE
    apple_id UUID;
    samsung_id UUID;
    oneplus_id UUID;
BEGIN
    SELECT id INTO apple_id FROM brands WHERE slug = 'apple';
    SELECT id INTO samsung_id FROM brands WHERE slug = 'samsung';
    SELECT id INTO oneplus_id FROM brands WHERE slug = 'oneplus';

    -- 2. Insert Apple Models
    INSERT INTO device_models (brand_id, name, slug) VALUES
    (apple_id, 'iPhone 6', 'iphone-6'),
    (apple_id, 'iPhone 6s', 'iphone-6s'),
    (apple_id, 'iPhone 7', 'iphone-7'),
    (apple_id, 'iPhone 7 Plus', 'iphone-7-plus'),
    (apple_id, 'iPhone 8', 'iphone-8'),
    (apple_id, 'iPhone 8 Plus', 'iphone-8-plus'),
    (apple_id, 'iPhone SE (2020)', 'iphone-se-2020'),
    (apple_id, 'iPhone X', 'iphone-x'),
    (apple_id, 'iPhone XR', 'iphone-xr'),
    (apple_id, 'iPhone XS', 'iphone-xs'),
    (apple_id, 'iPhone XS Max', 'iphone-xs-max'),
    (apple_id, 'iPhone 11', 'iphone-11'),
    (apple_id, 'iPhone 11 Pro', 'iphone-11-pro'),
    (apple_id, 'iPhone 11 Pro Max', 'iphone-11-pro-max'),
    (apple_id, 'iPhone 12 Mini', 'iphone-12-mini'),
    (apple_id, 'iPhone 12', 'iphone-12'),
    (apple_id, 'iPhone 12 Pro', 'iphone-12-pro'),
    (apple_id, 'iPhone 12 Pro Max', 'iphone-12-pro-max'),
    (apple_id, 'iPhone 13 Mini', 'iphone-13-mini'),
    (apple_id, 'iPhone 13', 'iphone-13'),
    (apple_id, 'iPhone 13 Pro', 'iphone-13-pro'),
    (apple_id, 'iPhone 13 Pro Max', 'iphone-13-pro-max'),
    (apple_id, 'iPhone 14', 'iphone-14'),
    (apple_id, 'iPhone 14 Plus', 'iphone-14-plus'),
    (apple_id, 'iPhone 14 Pro', 'iphone-14-pro'),
    (apple_id, 'iPhone 14 Pro Max', 'iphone-14-pro-max'),
    (apple_id, 'iPhone 15', 'iphone-15'),
    (apple_id, 'iPhone 15 Plus', 'iphone-15-plus'),
    (apple_id, 'iPhone 15 Pro', 'iphone-15-pro'),
    (apple_id, 'iPhone 15 Pro Max', 'iphone-15-pro-max'),
    (apple_id, 'iPhone 16', 'iphone-16'),
    (apple_id, 'iPhone 16 Plus', 'iphone-16-plus'),
    (apple_id, 'iPhone 16 Pro', 'iphone-16-pro'),
    (apple_id, 'iPhone 16 Pro Max', 'iphone-16-pro-max'),
    (apple_id, 'iPhone 17', 'iphone-17'),
    (apple_id, 'iPhone 17 Air', 'iphone-17-air'),
    (apple_id, 'iPhone 17 Pro', 'iphone-17-pro'),
    (apple_id, 'iPhone 17 Pro Max', 'iphone-17-pro-max')
    ON CONFLICT (slug) DO NOTHING;

    -- 3. Insert Samsung Models
    INSERT INTO device_models (brand_id, name, slug) VALUES
    (samsung_id, 'Galaxy S22', 'galaxy-s22'),
    (samsung_id, 'Galaxy S22 Ultra', 'galaxy-s22-ultra'),
    (samsung_id, 'Galaxy S23', 'galaxy-s23'),
    (samsung_id, 'Galaxy S23 Plus', 'galaxy-s23-plus'),
    (samsung_id, 'Galaxy S23 Ultra', 'galaxy-s23-ultra')
    ON CONFLICT (slug) DO NOTHING;

    -- 4. Insert OnePlus Models
    INSERT INTO device_models (brand_id, name, slug) VALUES
    (oneplus_id, 'OnePlus 7T', 'oneplus-7t'),
    (oneplus_id, 'OnePlus 7T Pro', 'oneplus-7t-pro'),
    (oneplus_id, 'OnePlus 7 Pro', 'oneplus-7-pro'),
    (oneplus_id, 'OnePlus Nord', 'oneplus-nord'),
    (oneplus_id, 'OnePlus Nord CE', 'oneplus-nord-ce'),
    (oneplus_id, 'OnePlus 8T', 'oneplus-8t'),
    (oneplus_id, 'OnePlus 8 Pro', 'oneplus-8-pro'),
    (oneplus_id, 'OnePlus 9', 'oneplus-9'),
    (oneplus_id, 'OnePlus 9 Pro', 'oneplus-9-pro'),
    (oneplus_id, 'OnePlus 9R', 'oneplus-9r'),
    (oneplus_id, 'OnePlus 10 Pro', 'oneplus-10-pro'),
    (oneplus_id, 'OnePlus 10R', 'oneplus-10r'),
    (oneplus_id, 'OnePlus 10T', 'oneplus-10t'),
    (oneplus_id, 'OnePlus 11R', 'oneplus-11r'),
    (oneplus_id, 'OnePlus 11', 'oneplus-11')
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- 5. Insert Case Types
INSERT INTO case_types (name, slug) VALUES
('Hard Clear Case', 'hard-clear-case'),
('Sublimation Case', 'sublimation-case'),
('Glass Case', 'glass-case')
ON CONFLICT (slug) DO NOTHING;
