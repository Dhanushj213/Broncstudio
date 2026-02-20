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
        image: '',
        category_slugs: [
            'keychains', 'badges', 'patches', 'bookmarks',
            'postcards', 'kids-stickers', 'kids-tattoos',
            'magic-mugs', 'pet-tags', 'coasters', 'magnets',
            'stationery', 'accessories' // Fallbacks
        ],
        price_max: 500
    },
    'back-to-school': {
        id: 'back-to-school',
        title: 'Study Time',
        description: 'Fun meets focus.',
        image: '',
        category_slugs: [
            'kids-colouring-books', 'sketchbooks', 'notebooks',
            'daily-planners', 'bookmarks', 'kids-stickers',
            'mdf-puzzles', 'jigsaw-puzzles',
            'stationery' // Fallback
        ]
    },
    'desk-therapy': {
        id: 'desk-therapy',
        title: 'Desk Therapy',
        description: 'Workspaces that feel like you.',
        image: '',
        category_slugs: [
            'mouse-pads', 'gaming-pads', 'coffee-mugs',
            'coasters', 'magnets', 'posters', 'canvas',
            'tech-accessories' // Fallback
        ]
    },
    'everyday-carry': {
        id: 'everyday-carry',
        title: 'Everyday Carry',
        description: 'What you reach for daily.',
        image: '',
        category_slugs: [
            'tote-bags-zip', 'large-totes', 'drawstring-bags',
            'phone-cases', 'iphone-cases', 'samsung-cases',
            'keychains', 'steel-bottles', 'sippers',
            'bags' // Fallback
        ]
    },
    'weekend-fits': {
        id: 'weekend-fits',
        title: 'Weekend Fits',
        description: 'Relaxed. Easy. Effortless.',
        image: '',
        category_slugs: [
            'men-oversized-tees', 'men-classic-crew', 'men-hoodies',
            'men-bottoms', 'caps', 'bucket-hats',
            'women-tops-tees', 'women-activewear',
            'clothing' // Fallback
        ]
    },
    'mini-home-makeover': {
        id: 'mini-home-makeover',
        title: 'Mini Home Makeover',
        description: 'Small changes, big vibe.',
        image: '',
        category_slugs: [
            'posters', 'canvas', 'cushions', 'coasters', 'magnets',
            'magic-mugs',
            'home-decor' // Fallback
        ]
    },
    'little-ones': {
        id: 'little-ones',
        title: 'For the Little Ones',
        description: 'Play, learn, imagine.',
        image: '',
        category_slugs: [
            'kids-story-books', 'kids-colouring-books',
            'jigsaw-puzzles', 'mdf-puzzles', 'kids-tattoos',
            'kids-stickers', 'boys-tees', 'girls-tees',
            'kids-learning' // Fallback
        ]
    },
    'pawfect-picks': {
        id: 'pawfect-picks',
        title: 'Pawfect Picks 🐾',
        description: 'Because pets are family.',
        image: '',
        category_slugs: [
            'dog-tees', 'pet-tags',
            'pets' // Fallback
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
