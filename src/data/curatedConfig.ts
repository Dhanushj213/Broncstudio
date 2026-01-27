export interface CuratedTheme {
    id: string;
    title: string;
    description: string;
    image: string;
    category_slugs: string[]; // Slugs to pull products from
    price_max?: number;       // Optional max price
    filter_tags?: string[];   // Optional tag filters
}

export const CURATED_CONFIG: Record<string, CuratedTheme> = {
    'gifts-under-499': {
        id: 'gifts-under-499',
        title: 'Gifts Under ₹499',
        description: 'Small joys, big smiles.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', // Colorful small items
        category_slugs: [
            'keychains', 'badges', 'patches', 'bookmarks',
            'postcards', 'kids-stickers', 'kids-tattoos',
            'magic-mugs', 'pet-tags', 'coasters', 'magnets'
        ],
        price_max: 500
    },
    'back-to-school': {
        id: 'back-to-school',
        title: 'Study Time',
        description: 'Fun meets focus.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', // Desk/Books vibe
        category_slugs: [
            'kids-colouring-books', 'sketchbooks', 'notebooks',
            'daily-planners', 'bookmarks', 'kids-stickers',
            'mdf-puzzles', 'jigsaw-puzzles'
        ]
    },
    'desk-therapy': {
        id: 'desk-therapy',
        title: 'Desk Therapy',
        description: 'Workspaces that feel like you.',
        image: 'https://images.unsplash.com/photo-1497215842964-222b430dc0a8?w=600&q=80', // Clean desk setup
        category_slugs: [
            'mouse-pads', 'gaming-pads', 'coffee-mugs',
            'coasters', 'magnets', 'posters', 'canvas'
        ]
    },
    'everyday-carry': {
        id: 'everyday-carry',
        title: 'Everyday Carry',
        description: 'What you reach for daily.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', // Backpack/Essentials
        category_slugs: [
            'tote-bags-zip', 'large-totes', 'drawstring-bags',
            'phone-cases', 'iphone-cases', 'samsung-cases',
            'keychains', 'steel-bottles', 'sippers'
        ]
    },
    'weekend-fits': {
        id: 'weekend-fits',
        title: 'Weekend Fits',
        description: 'Relaxed. Easy. Effortless.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', // Casual fashion
        category_slugs: [
            'men-oversized-tees', 'men-classic-crew', 'men-hoodies',
            'men-bottoms', 'caps', 'bucket-hats',
            'women-tops-tees', 'women-activewear'
        ]
    },
    'mini-home-makeover': {
        id: 'mini-home-makeover',
        title: 'Mini Home Makeover',
        description: 'Small changes, big vibe.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', // Interior decor
        category_slugs: [
            'posters', 'canvas', 'cushions', 'coasters', 'magnets',
            'magic-mugs'
        ]
    },
    'little-ones': {
        id: 'little-ones',
        title: 'For the Little Ones',
        description: 'Play, learn, imagine.',
        image: 'https://images.unsplash.com/photo-1519340241574-2291ec3a0c24?w=600&q=80', // Kids playing
        category_slugs: [
            'kids-story-books', 'kids-colouring-books',
            'jigsaw-puzzles', 'mdf-puzzles', 'kids-tattoos',
            'kids-stickers', 'boys-tees', 'girls-tees'
        ]
    },
    'pawfect-picks': {
        id: 'pawfect-picks',
        title: 'Pawfect Picks 🐾',
        description: 'Because pets are family.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80', // Dog
        category_slugs: [
            'dog-tees', 'pet-tags'
        ]
    }
};

export const CURATED_GRID_ORDER = [
    'gifts-under-499',
    'desk-therapy',
    'weekend-fits',
    'everyday-carry',
    'mini-home-makeover',
    'back-to-school',
    'little-ones',
    'pawfect-picks'
];
