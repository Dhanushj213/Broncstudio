export const CATEGORY_TAXONOMY = {
    'kids-learning': {
        id: 'kids-learning',
        name: 'KIDS & LEARNING',
        slug: 'kids-learning',
        description: 'Where curiosity begins. Books, toys, and activities.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        subcategories: [
            {
                id: 'books',
                name: 'Books',
                slug: 'kids-books',
                items: [
                    { name: 'Kids Story Books', slug: 'story-books' },
                    { name: 'Classic', slug: 'classic-books' },
                    { name: 'Kids Colouring Books', slug: 'colouring-books' }
                ]
            },
            {
                id: 'stationery',
                name: 'Stationery',
                slug: 'kids-stationery',
                items: [
                    { name: 'Sketchbook', slug: 'sketchbook' },
                    { name: 'Notebook', slug: 'notebook' },
                    { name: 'Daily Planner', slug: 'planner' },
                    { name: 'Notepad', slug: 'notepad' }
                ]
            },
            {
                id: 'paper-accessories',
                name: 'Paper Accessories',
                slug: 'paper-accessories',
                items: [
                    { name: 'Bookmark', slug: 'bookmark' },
                    { name: 'Postcards', slug: 'postcards' },
                    { name: 'Greeting Cards', slug: 'greeting-cards' }
                ]
            },
            {
                id: 'toys-activities',
                name: 'Toys & Activities',
                slug: 'toys-and-activities',
                items: [
                    { name: 'MDF Puzzles', slug: 'mdf-puzzles' },
                    { name: 'Jigsaw Puzzles', slug: 'jigsaw-puzzles' },
                    { name: 'Tattoos', slug: 'tattoos' },
                    { name: 'Stickers', slug: 'stickers' },
                    { name: 'Ornaments', slug: 'ornaments' }
                ]
            }
        ]
    },
    'clothing': {
        id: 'clothing',
        name: 'CLOTHING',
        slug: 'clothing',
        description: 'Style for everyone.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        subcategories: [
            {
                id: 'men',
                name: 'Men',
                slug: 'men-clothing',
                items: [
                    { name: 'Classic Crew', slug: 'men-classic-crew' },
                    { name: 'Oversized Tee', slug: 'men-oversized-tee' },
                    { name: 'Polos', slug: 'men-polos' },
                    { name: 'Hoodies', slug: 'men-hoodies' },
                    { name: 'Jackets', slug: 'men-jackets' },
                    { name: 'Bottoms', slug: 'men-bottoms' }
                ]
            },
            {
                id: 'women',
                name: 'Women',
                slug: 'women-clothing',
                items: [
                    { name: 'Tops & Tees', slug: 'women-tops-tees' },
                    { name: 'Dresses', slug: 'women-dresses' },
                    { name: 'Bottom Wear', slug: 'women-bottoms' },
                    { name: 'Activewear', slug: 'women-activewear' },
                    { name: 'Outerwear', slug: 'women-outerwear' }
                ]
            },
            {
                id: 'kids-clothing',
                name: 'Kids',
                slug: 'kids-clothing',
                items: [
                    { name: 'Boys Tees', slug: 'boys-tees' },
                    { name: 'Girls Tees', slug: 'girls-tees' },
                    { name: 'Rompers', slug: 'kids-rompers' },
                    { name: 'Winter Wear', slug: 'kids-winter-wear' }
                ]
            }
        ]
    },
    'accessories': {
        id: 'accessories',
        name: 'ACCESSORIES',
        slug: 'accessories',
        description: 'Complete the look.',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80',
        subcategories: [
            {
                id: 'headwear',
                name: 'Headwear',
                slug: 'headwear',
                items: [
                    { name: 'Caps', slug: 'caps' },
                    { name: 'Snapbacks', slug: 'snapbacks' },
                    { name: 'Bucket Hats', slug: 'bucket-hats' }
                ]
            },
            {
                id: 'wearables',
                name: 'Wearables',
                slug: 'wearables',
                items: [
                    { name: 'Scarves', slug: 'scarves' },
                    { name: 'Scrunchies', slug: 'scrunchies' },
                    { name: 'Aprons', slug: 'aprons' }
                ]
            }
        ]
    },
    'tech-desk': {
        id: 'tech-desk',
        name: 'TECH & DESK',
        slug: 'tech-desk',
        description: 'Work and play in style.',
        image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500&q=80',
        subcategories: [
            {
                id: 'cases',
                name: 'Cases',
                slug: 'phone-cases',
                items: [
                    { name: 'iPhone', slug: 'iphone-cases' },
                    { name: 'Samsung', slug: 'samsung-cases' },
                    { name: 'OnePlus', slug: 'oneplus-cases' }
                ]
            },
            {
                id: 'desk',
                name: 'Desk',
                slug: 'desk-accessories',
                items: [
                    { name: 'Mouse Pads', slug: 'mouse-pads' },
                    { name: 'Gaming Pads', slug: 'gaming-pads' }
                ]
            }
        ]
    },
    'home-decor': {
        id: 'home-decor',
        name: 'HOME & DECOR',
        slug: 'home-decor',
        description: 'Transform your space.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
        subcategories: [
            {
                id: 'decor',
                name: 'Decor',
                slug: 'decor',
                items: [
                    { name: 'Posters', slug: 'posters' },
                    { name: 'Canvas', slug: 'canvas' }
                ]
            },
            {
                id: 'living',
                name: 'Living',
                slug: 'living',
                items: [
                    { name: 'Coasters', slug: 'coasters' },
                    { name: 'Cushions', slug: 'cushions' },
                    { name: 'Magnets', slug: 'magnets' }
                ]
            }
        ]
    },
    'drinkware': {
        id: 'drinkware',
        name: 'DRINKWARE',
        slug: 'drinkware',
        description: 'Sip in style.',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
        subcategories: [
            {
                id: 'mugs',
                name: 'Mugs',
                slug: 'mugs',
                items: [
                    { name: 'Coffee Mugs', slug: 'coffee-mugs' },
                    { name: 'Magic Mugs', slug: 'magic-mugs' }
                ]
            },
            {
                id: 'bottles',
                name: 'Bottles',
                slug: 'bottles',
                items: [
                    { name: 'Steel Bottles', slug: 'steel-bottles' },
                    { name: 'Sippers', slug: 'sippers' }
                ]
            }
        ]
    },
    'bags': {
        id: 'bags',
        name: 'BAGS',
        slug: 'bags',
        description: 'Carry essentials.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        subcategories: [
            {
                id: 'carry-essentials',
                name: 'Carry Essentials',
                slug: 'carry-essentials',
                items: [
                    { name: 'Tote Bags (Zip)', slug: 'tote-bags-zip' },
                    { name: 'Large Totes', slug: 'large-totes' },
                    { name: 'Drawstrings', slug: 'drawstrings' }
                ]
            }
        ]
    },
    'gifts': {
        id: 'gifts',
        name: 'GIFTS',
        slug: 'gifts',
        description: 'Small joys.',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        subcategories: [
            {
                id: 'trinkets',
                name: 'Trinkets',
                slug: 'trinkets',
                items: [
                    { name: 'Keychains', slug: 'keychains' },
                    { name: 'Badges', slug: 'badges' },
                    { name: 'Patches', slug: 'patches' }
                ]
            },
            {
                id: 'tags',
                name: 'Tags',
                slug: 'luggage-tags',
                items: [
                    { name: 'Luggage Tags', slug: 'luggage-tags' }
                ]
            }
        ]
    },
    'pets': {
        id: 'pets',
        name: 'PETS',
        slug: 'pets',
        description: 'Furry friends.',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
        subcategories: [
            {
                id: 'pet-essentials',
                name: 'Essentials',
                slug: 'pet-essentials',
                items: [
                    { name: 'Dog Tees', slug: 'dog-tees' },
                    { name: 'Pet Tags', slug: 'pet-tags' }
                ]
            }
        ]
    }
};

export const MAIN_NAV_LINKS = [
    { label: 'KIDS & LEARNING', href: '/shop/kids-learning', categoryId: 'kids-learning' },
    { label: 'CLOTHING', href: '/shop/clothing', categoryId: 'clothing' },
    { label: 'ACCESSORIES', href: '/shop/accessories', categoryId: 'accessories' },
    { label: 'TECH & DESK', href: '/shop/tech-desk', categoryId: 'tech-desk' },
    { label: 'HOME & DECOR', href: '/shop/home-decor', categoryId: 'home-decor' },
    { label: 'DRINKWARE', href: '/shop/drinkware', categoryId: 'drinkware' },
    { label: 'BAGS', href: '/shop/bags', categoryId: 'bags' },
    { label: 'GIFTS', href: '/shop/gifts', categoryId: 'gifts' },
    { label: 'PETS', href: '/shop/pets', categoryId: 'pets' },
];
