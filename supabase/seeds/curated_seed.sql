INSERT INTO curated_sections (title, description, image_url, display_order, category_slugs, is_active)
VALUES
  ('Gifts Under ₹499', 'Small joys, big smiles.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80', 1, ARRAY['keychains', 'badges', 'accessories'], true),
  ('Study Time', 'Fun meets focus.', 'https://images.unsplash.com/photo-1456735190827-d1261f7add50?w=600&q=80', 2, ARRAY['notebooks', 'stationery'], true),
  ('Desk Therapy', 'Workspaces that feel like you.', 'https://images.unsplash.com/photo-1497215842964-222b430dc0a8?w=600&q=80', 3, ARRAY['mouse-pads', 'coasters'], true),
  ('Weekend Fits', 'Relaxed. Easy. Effortless.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', 4, ARRAY['men-hoodies', 'clothing'], true),
  ('Mini Home Makeover', 'Small changes, big vibe.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', 5, ARRAY['posters', 'home-decor'], true),
  ('Everyday Carry', 'What you reach for daily.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', 6, ARRAY['bags', 'wallets'], true);
