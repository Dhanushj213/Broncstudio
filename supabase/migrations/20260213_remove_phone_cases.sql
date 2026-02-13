-- Migration to remove phone case related tables and data
-- Fixed to handle foreign key constraints on the categories table

-- 1. DROP Tables with CASCADE to handle internal dependencies
DROP TABLE IF EXISTS product_compatibility CASCADE;
DROP TABLE IF EXISTS device_models CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS case_types CASCADE;

-- 2. Clean up category hierarchy
DO $$
DECLARE
    target_id UUID;
BEGIN
    -- Find the main phone-cases category ID
    SELECT id INTO target_id FROM categories WHERE slug = 'phone-cases';
    
    IF target_id IS NOT NULL THEN
        -- Delete products belonging to this category or its children
        DELETE FROM products WHERE category_id = target_id 
           OR category_id IN (SELECT id FROM categories WHERE parent_id = target_id);
           
        -- Delete child categories first
        DELETE FROM categories WHERE parent_id = target_id;
        
        -- Finally delete the parent category
        DELETE FROM categories WHERE id = target_id;
    END IF;
END $$;
