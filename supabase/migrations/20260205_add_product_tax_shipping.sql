ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(10,2) DEFAULT 18.00,
ADD COLUMN IF NOT EXISTS shipping_cost_pct DECIMAL(10,2) DEFAULT 0.00;

COMMENT ON COLUMN products.tax_rate IS 'GST/Tax Rate percentage for this product';
COMMENT ON COLUMN products.shipping_cost_pct IS 'Shipping Cost calculated as percentage of product price';
