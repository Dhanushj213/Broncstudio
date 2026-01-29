const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Ideally usage of SERVICE_ROLE_KEY for seeding, but trying ANON first if RLS allows, or user can run in SQL editor.
);

// Hardcoded config from src/data/curatedConfig.ts
const CURATED_CONFIG = {
    'gifts-under-499': {
        title: 'Gifts Under ₹499',
        description: 'Small joys, big smiles.',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80',
        category_slugs: [
            'keychains', 'badges', 'patches', 'bookmarks',
            'postcards', 'kids-stickers', 'kids-tattoos',
            'magic-mugs', 'pet-tags', 'coasters', 'magnets',
            'stationery', 'accessories'
        ],
        price_max: 500,
        display_order: 1
    },
    'back-to-school': {
        title: 'Study Time',
        description: 'Fun meets focus.',
        image: 'https://images.unsplash.com/photo-1456735190827-d1261f7add50?w=600&q=80',
        category_slugs: [
            'kids-colouring-books', 'sketchbooks', 'notebooks',
            'daily-planners', 'bookmarks', 'kids-stickers',
            'mdf-puzzles', 'jigsaw-puzzles',
            'stationery'
        ],
        display_order: 6
    },
    'desk-therapy': {
        title: 'Desk Therapy',
        description: 'Workspaces that feel like you.',
        image: 'https://images.unsplash.com/photo-1497215842964-222b430dc0a8?w=600&q=80',
        category_slugs: [
            'mouse-pads', 'gaming-pads', 'coffee-mugs',
            'coasters', 'magnets', 'posters', 'canvas',
            'tech-accessories'
        ],
        display_order: 2
    },
    'everyday-carry': {
        title: 'Everyday Carry',
        description: 'What you reach for daily.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        category_slugs: [
            'tote-bags-zip', 'large-totes', 'drawstring-bags',
            'phone-cases', 'iphone-cases', 'samsung-cases',
            'keychains', 'steel-bottles', 'sippers',
            'bags'
        ],
        display_order: 4
    },
    'weekend-fits': {
        title: 'Weekend Fits',
        description: 'Relaxed. Easy. Effortless.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
        category_slugs: [
            'men-oversized-tees', 'men-classic-crew', 'men-hoodies',
            'men-bottoms', 'caps', 'bucket-hats',
            'women-tops-tees', 'women-activewear',
            'clothing'
        ],
        display_order: 3
    },
    'mini-home-makeover': {
        title: 'Mini Home Makeover',
        description: 'Small changes, big vibe.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
        category_slugs: [
            'posters', 'canvas', 'cushions', 'coasters', 'magnets',
            'magic-mugs',
            'home-decor'
        ],
        display_order: 5
    },
    'little-ones': {
        title: 'For the Little Ones',
        description: 'Play, learn, imagine.',
        image: 'https://images.unsplash.com/photo-1519340241574-2291ec3a0c24?w=600&q=80',
        category_slugs: [
            'kids-story-books', 'kids-colouring-books',
            'jigsaw-puzzles', 'mdf-puzzles', 'kids-tattoos',
            'kids-stickers', 'boys-tees', 'girls-tees',
            'kids-learning'
        ],
        display_order: 7
    },
    'pawfect-picks': {
        title: 'Pawfect Picks 🐾',
        description: 'Because pets are family.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
        category_slugs: [
            'dog-tees', 'pet-tags',
            'pets'
        ],
        display_order: 8
    }
};

async function seed() {
    console.log('Seeding Curated Sections...');

    // Convert to array
    const records = Object.values(CURATED_CONFIG).map(item => ({
        title: item.title,
        description: item.description,
        image_url: item.image,
        category_slugs: item.category_slugs,
        price_max: item.price_max || null,
        display_order: item.display_order,
        is_active: true
    }));

    const { data, error } = await supabase
        .from('curated_sections')
        .insert(records)
        .select();

    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log(`Successfully seeded ${data.length} records.`);
    }
}

seed();
