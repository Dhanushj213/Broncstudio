-- Data Cleanup for Case Collections

-- 1. Fix Typos in Product Names
UPDATE products 
SET name = REPLACE(name, 'Sublima7on', 'Sublimation')
WHERE name LIKE '%Sublima7on%';

-- 2. Fix Typos in Product Descriptions
UPDATE products 
SET description = REPLACE(description, 'Sublima7on', 'Sublimation')
WHERE description LIKE '%Sublima7on%';

-- 3. Normalize Model Names in existing metadata if any
-- (Example if we had things like "iPhone15" without space)
UPDATE products
SET name = REPLACE(name, 'iPhone15', 'iPhone 15')
WHERE name LIKE '%iPhone15%';

UPDATE products
SET name = REPLACE(name, 'iPhone14', 'iPhone 14')
WHERE name LIKE '%iPhone14%';

-- 4. Clean up any cases where 'iPhone Cases' was used as a single product name 
-- and potentially clarify it if they are now base products.
-- This depends on the specific catalog, but standardizing common terms helps.

-- 5. Ensure all Phone Case products have the correct 'product_type' in metadata
UPDATE products
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb), 
    '{product_type}', 
    '"Phone Case"'
)
WHERE name ILIKE '%Case%' 
  AND (metadata->>'product_type' IS NULL OR metadata->>'product_type' != 'Phone Case');
