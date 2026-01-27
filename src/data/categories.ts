export const CATEGORY_TAXONOMY = {
    'little-legends': {
        id: 'little-legends',
        name: 'Little Legends',
        slug: 'little-legends',
        description: 'Where curiosity begins.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        subcategories: [
            {
                id: 'books',
                name: 'Books',
                slug: 'kids-books',
                items: [
                    { name: 'Kids Story Books', slug: 'story-books' },
                    { name: 'Classic Books', slug: 'classic-books' },
                    { name: 'Kids Colouring Books', slug: 'colouring-books' }
                ]
            },
            {
                id: 'stationery',
                name: 'Stationery',
                slug: 'kids-stationery',
                items: [
                    { name: 'Sketchbooks', slug: 'sketchbook' },
                    { name: 'Notebooks', slug: 'notebook' },
                    { name: 'Daily Planners', slug: 'planner' },
                    { name: 'Notepads', slug: 'notepad' }
                ]
            },
            {
                id: 'paper-accessories',
                name: 'Paper Accessories',
                slug: 'paper-accessories',
                items: [
                    { name: 'Bookmarks', slug: 'bookmark' },
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
                    { name: 'Stickers', slug: 'stickers' }
                ]
            }
        ]
    },
    'everyday-icons': {
        id: 'everyday-icons',
        name: 'Everyday Icons',
        slug: 'everyday-icons',
        description: 'Fashion for Everyone.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        subcategories: [
            {
                id: 'clothing-men',
                name: 'Clothing – Men',
                slug: 'men-clothing',
                items: [
                    { name: 'Classic Crew', slug: 'men-classic-crew' },
                    { name: 'Oversized Tees', slug: 'men-oversized-tee' },
                    { name: 'Polos', slug: 'men-polos' },
                    { name: 'Hoodies', slug: 'men-hoodies' },
                    { name: 'Jackets', slug: 'men-jackets' },
                    { name: 'Bottoms', slug: 'men-bottoms' }
                ]
            },
            {
                id: 'clothing-women',
                name: 'Clothing – Women',
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
                id: 'clothing-kids',
                name: 'Clothing – Kids',
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
    'little-luxuries': {
        id: 'little-luxuries',
        name: 'Little Luxuries',
        slug: 'little-luxuries',
        description: 'Gifting & Joys.',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        subcategories: [
            {
                id: 'drinkware',
                name: 'Drinkware',
                slug: 'drinkware',
                items: [
                    { name: 'Coffee Mugs', slug: 'coffee-mugs' },
                    { name: 'Magic Mugs', slug: 'magic-mugs' },
                    { name: 'Steel Bottles', slug: 'steel-bottles' },
                    { name: 'Sippers', slug: 'sippers' }
                ]
            },
            {
                id: 'gifts',
                name: 'Gifts',
                slug: 'gifts',
                items: [
                    { name: 'Trinkets', slug: 'trinkets' },
                    { name: 'Keychains', slug: 'keychains' },
                    { name: 'Badges', slug: 'badges' },
                    { name: 'Luggage Tags', slug: 'luggage-tags' },
                    { name: 'Patches', slug: 'patches' }
                ]
            }
        ]
    },
    'space-stories': {
        id: 'space-stories',
        name: 'Space Stories',
        slug: 'space-stories',
        description: 'Home & Comfort.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
        subcategories: [
            {
                id: 'home-decor',
                name: 'Home & Decor',
                slug: 'home-decor',
                items: [
                    { name: 'Posters', slug: 'posters' },
                    { name: 'Canvas', slug: 'canvas' },
                    { name: 'Coasters', slug: 'coasters' },
                    { name: 'Cushions', slug: 'cushions' },
                    { name: 'Magnets', slug: 'magnets' }
                ]
            },
            {
                id: 'desk-essentials',
                name: 'Desk Essentials',
                slug: 'desk-essentials',
                items: [
                    { name: 'Mouse Pads', slug: 'mouse-pads' },
                    { name: 'Gaming Pads', slug: 'gaming-pads' }
                ]
            }
        ]
    },
    'style-extras': {
        id: 'style-extras',
        name: 'Style Extras',
        slug: 'style-extras',
        description: 'Accessories.',
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
            },
            {
                id: 'bags',
                name: 'Bags',
                slug: 'bags',
                items: [
                    { name: 'Tote Bags (Zip)', slug: 'tote-bags-zip' },
                    { name: 'Large Totes', slug: 'large-totes' },
                    { name: 'Drawstrings', slug: 'drawstrings' }
                ]
            },
            {
                id: 'tech-accessories',
                name: 'Tech Accessories',
                slug: 'tech-accessories',
                items: [
                    { name: 'Phone Cases', slug: 'phone-cases' }
                ]
            }
        ]
    }
};

export const MAIN_NAV_LINKS = [
    { label: 'Little Legends', href: '/shop/little-legends', categoryId: 'little-legends' },
    { label: 'Everyday Icons', href: '/shop/everyday-icons', categoryId: 'everyday-icons' },
    { label: 'Little Luxuries', href: '/shop/little-luxuries', categoryId: 'little-luxuries' },
    { label: 'Space Stories', href: '/shop/space-stories', categoryId: 'space-stories' },
    { label: 'Style Extras', href: '/shop/style-extras', categoryId: 'style-extras' },
];
