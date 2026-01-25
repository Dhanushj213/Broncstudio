export const CATEGORY_TAXONOMY = {
    'little-legends': {
        id: 'little-legends',
        name: 'Little Legends',
        slug: 'little-legends',
        description: 'Where curiosity begins. Books, toys, and outfits for big imaginations.',
        image: '/images/worlds/little-legends.jpg', // Placeholder
        intents: [
            { name: 'Learn & Imagine', slug: 'learn-and-imagine', type: 'collection', items: ['Books', 'Puzzles', 'Flashcards'], description: 'Books & Puzzles' },
            { name: 'Create & Colour', slug: 'create-and-colour', type: 'collection', items: ['Sketchbooks', 'Crayons', 'DIY Kits'], description: 'Art & Creativity' },
            { name: 'Play & Explore', slug: 'play-and-explore', type: 'collection', items: ['Toys', 'Games'], description: 'Educational Toys' },
            { name: 'Mini Style', slug: 'mini-style', type: 'collection', items: ['Kids Apparel'], description: 'Fashion for Kids' }
        ],
        subcategories: [
            {
                id: 'books-stationery',
                name: 'Story & Scribble',
                slug: 'story-and-scribble',
                items: [
                    { name: 'Tiny Tales', slug: 'tiny-tales', original: 'Kids Books' },
                    { name: 'Colouring Books', slug: 'colouring-books' },
                    { name: 'Creative Sketches', slug: 'creative-sketches', original: 'Sketchbook' },
                ]
            },
            {
                id: 'toys-activities',
                name: 'Play & Wonder',
                slug: 'play-and-wonder',
                items: [
                    { name: 'Brain Builders', slug: 'brain-builders', original: 'MDF Wooden Puzzles' },
                ]
            },
            {
                id: 'kids-clothing',
                name: 'Mini Fashion',
                slug: 'mini-fashion',
                items: [
                    { name: 'Little Champ Tee', slug: 'little-champ-tee', original: 'Boy Classic Tee' },
                    { name: 'Tiny Trend Tee', slug: 'tiny-trend-tee', original: 'Girl Classic Tee' },
                    { name: 'Rompers', slug: 'kids-rompers' },
                    { name: 'Winter Wear', slug: 'kids-winter' }
                ]
            },
            {
                id: 'kids-stationery',
                name: 'Little Stationers',
                slug: 'kids-stationery',
                items: [
                    { name: 'Notebooks', slug: 'notebook' },
                    { name: 'Daily Planners', slug: 'planner' },
                    { name: 'Notepads', slug: 'notepad' },
                    { name: 'Bookmarks', slug: 'bookmark' },
                    { name: 'Postcards', slug: 'postcards' },
                    { name: 'Greeting Cards', slug: 'greeting-cards' }
                ]
            },
            {
                id: 'kids-activities',
                name: 'Fun & Games',
                slug: 'kids-activities',
                items: [
                    { name: 'Jigsaw Puzzles', slug: 'jigsaw' },
                    { name: 'Tattoos', slug: 'tattoos' },
                    { name: 'Stickers', slug: 'stickers' },
                    { name: 'Ornaments', slug: 'ornaments' }
                ]
            }
        ]
    },
    'everyday-icons': {
        id: 'everyday-icons',
        name: 'Everyday Icons',
        slug: 'everyday-icons',
        description: 'Clothing for men, women & kids — styled by mood.',
        image: '/images/worlds/everyday-icons.jpg',
        intents: [
            { name: 'Chill & Oversized', slug: 'chill-and-oversized', type: 'style', filter: 'oversized', description: 'Relaxed Fits' },
            { name: 'Clean & Classic', slug: 'clean-and-classic', type: 'style', filter: 'classic', description: 'Timeless Essentials' },
            { name: 'Bold & Printed', slug: 'bold-and-printed', type: 'style', filter: 'graphic', description: 'Statement Pieces' },
            { name: 'Family Fits', slug: 'family-fits', type: 'style', filter: 'matching', description: 'Twinning Sets' }
        ],
        groups: [
            {
                id: 'men',
                name: 'Modern Man',
                slug: 'modern-man',
                subcategories: [
                    {
                        id: 'men-tops',
                        name: 'Tops',
                        slug: 'men-tops',
                        items: [
                            { name: 'Classic Tees', slug: 'men-classic-tees' },
                            { name: 'Oversized Tees', slug: 'men-oversized-tees' },
                            { name: 'Polos', slug: 'men-polos' },
                            { name: 'Hoodies', slug: 'men-hoodies' },
                            { name: 'Jackets', slug: 'men-jackets' },
                            { name: 'Bottoms', slug: 'men-bottoms' }
                        ]
                    },
                ]
            },
            {
                id: 'women',
                name: 'Modern Muse',
                slug: 'modern-muse',
                subcategories: [
                    {
                        id: 'women-tops',
                        name: 'Tops',
                        slug: 'women-tops',
                        items: [
                            { name: 'Classic Tees', slug: 'women-classic-tees' },
                            { name: 'Boyfriend Tees', slug: 'women-boyfriend-tees' },
                            { name: 'Dresses', slug: 'women-dresses' },
                            { name: 'Bottom Wear', slug: 'women-bottoms' },
                            { name: 'Activewear', slug: 'women-active' },
                            { name: 'Outerwear', slug: 'women-outerwear' }
                        ]
                    }
                ]
            }
        ]
    },
    'little-luxuries': {
        id: 'little-luxuries',
        name: 'Little Luxuries',
        slug: 'little-luxuries',
        description: 'Small things that feel special. Gifts, keepsakes, and charms.',
        subcategories: [
            {
                id: 'personalized',
                name: 'Personalized Gifts',
                slug: 'personalized-gifts',
                description: 'Custom Charms',
                items: [
                    { name: 'Keychains', slug: 'keychains', original: 'Keychain' },
                    { name: 'Badges', slug: 'badges', original: 'Badge' },
                    { name: 'Luggage Tags', slug: 'luggage-tags', original: 'Luggage Tag' },
                    { name: 'Patches', slug: 'patches', original: 'Patch' },
                ]
            }
        ]
    },
    'space-stories': {
        id: 'space-stories',
        name: 'Space Stories',
        slug: 'space-stories',
        description: 'Designs that live with you. Decor, dining, and comfort.',
        subcategories: [
            {
                id: 'wall-decor',
                name: 'Wall Tales',
                slug: 'wall-tales',
                description: 'Posters & Art',
                items: [
                    { name: 'Posters', slug: 'posters' },
                    { name: 'Canvas', slug: 'canvas' },
                    { name: 'Magnets', slug: 'magnets' }
                ]
            },
            {
                id: 'home-comforts',
                name: 'Home Comforts',
                slug: 'home-comforts',
                description: 'Cushions & Rugs',
                items: [
                    { name: 'Cushions', slug: 'cushions' },
                    { name: 'Coasters', slug: 'coasters' }
                ]
            },
            {
                id: 'drinkware',
                name: 'Sip Station',
                slug: 'sip-station',
                description: 'Mugs & Bottles',
                items: [
                    { name: 'Coffee Mugs', slug: 'mugs' },
                    { name: 'Magic Mugs', slug: 'magic-mugs' },
                    { name: 'Steel Bottles', slug: 'bottles' },
                    { name: 'Sippers', slug: 'sippers' }
                ]
            }
        ]
    },
    'style-extras': {
        id: 'style-extras',
        name: 'Style Extras',
        slug: 'style-extras',
        description: 'Add-ons that complete the look. Caps, bags, and tech gear.',
        subcategories: [
            {
                id: 'bags',
                name: 'Carry Culture',
                slug: 'carry-culture',
                description: 'Backpacks & Totes',
                items: [
                    { name: 'Tote Bags (Zip)', slug: 'totes-zipper' },
                    { name: 'Large Totes', slug: 'totes-large' },
                    { name: 'Drawstrings', slug: 'drawstring-bags' }
                ]
            },
            {
                id: 'tech',
                name: 'Tech Accessories',
                slug: 'tech-accessories',
                description: 'Cases & Sleeves',
                items: [
                    { name: 'iPhone Cases', slug: 'iphone-cases' },
                    { name: 'Samsung Cases', slug: 'samsung-cases' },
                    { name: 'OnePlus Cases', slug: 'oneplus-cases' },
                    { name: 'Mouse Pads', slug: 'mouse-pads' },
                    { name: 'Gaming Pads', slug: 'gaming-pads' }
                ]
            },
            {
                id: 'headwear',
                name: 'Head & Hair',
                slug: 'headwear',
                description: 'Caps & Hats',
                items: [
                    { name: 'Caps', slug: 'caps' },
                    { name: 'Snapbacks', slug: 'snapbacks' },
                    { name: 'Bucket Hats', slug: 'bucket-hats' },
                    { name: 'Scarves', slug: 'scarves' },
                    { name: 'Scrunchies', slug: 'scrunchies' },
                    { name: 'Aprons', slug: 'aprons' }
                ]
            }
        ]
    },
    'pawfect-picks': {
        id: 'pawfect-picks',
        name: 'Pawfect Picks',
        slug: 'pawfect-picks',
        description: 'For the ones with paws.',
        subcategories: [
            {
                id: 'pet-apparel',
                name: 'Furry Fashion',
                slug: 'furry-fashion',
                description: 'Apparel for Pets',
                items: [
                    { name: 'Dog Tees', slug: 'dog-tees' }
                ]
            },
            {
                id: 'pet-accessories',
                name: 'Pet Accessories',
                slug: 'pet-accessories',
                description: 'Collars & Tags',
                items: [
                    { name: 'Pet Tags', slug: 'pet-tags' }
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
    { label: 'Pawfect Picks', href: '/shop/pawfect-picks', categoryId: 'pawfect-picks' },
];
