export const CATEGORY_TAXONOMY = {
    'kids': {
        id: 'little-legends', // Keep legacy ID if consistent with DB UUIDs or just use it as ref
        name: 'Stationery & Play', // RENAMED to match header
        slug: 'kids', // RENAMED
        legacy_slug: 'little-legends', // FOR DB MAPPING
        description: 'Curiosity & Play.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        subcategories: [
            {
                id: 'books',
                name: 'Books',
                slug: 'kids-books',
                items: [
                    { name: 'Story Books', slug: 'kids-story-books' },
                    { name: 'Classic Books', slug: 'classic-books' },
                    { name: 'Colouring Books', slug: 'kids-colouring-books' }
                ]
            },
            {
                id: 'stationery',
                name: 'Stationery',
                slug: 'stationery',
                items: [
                    { name: 'Sketchbooks', slug: 'sketchbooks' },
                    { name: 'Notebooks', slug: 'notebooks' },
                    { name: 'Daily Planners', slug: 'daily-planners' },
                    { name: 'Notepads', slug: 'notepads' }
                ]
            },
            {
                id: 'toys-activities',
                name: 'Toys & Activities',
                slug: 'toys-activities',
                items: [
                    { name: 'MDF Puzzles', slug: 'mdf-puzzles' },
                    { name: 'Jigsaw Puzzles', slug: 'jigsaw-puzzles' },
                    { name: 'Tattoos', slug: 'kids-tattoos' },
                    { name: 'Stickers', slug: 'kids-stickers' }
                ]
            }
        ]
    },
    'clothing': {
        id: 'everyday-icons',
        name: 'Clothing', // RENAMED
        slug: 'clothing', // RENAMED
        legacy_slug: 'everyday-icons',
        description: 'Fashion for Everyone.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        subcategories: [
            {
                id: 'clothing-men',
                name: 'Men',
                slug: 'men',
                items: [
                    { name: 'Classic Crew', slug: 'men-classic-crew' },
                    { name: 'Oversized Tees', slug: 'men-oversized-tees' },
                    { name: 'Polos', slug: 'men-polos' },
                    { name: 'Hoodies', slug: 'men-hoodies' },
                    { name: 'Jackets', slug: 'men-jackets' },
                    { name: 'Bottoms', slug: 'men-bottoms' }
                ]
            },
            {
                id: 'clothing-women',
                name: 'Women',
                slug: 'women',
                items: [
                    { name: 'Tops & Tees', slug: 'women-tops-tees' },
                    { name: 'Dresses', slug: 'women-dresses' },
                    { name: 'Bottom Wear', slug: 'women-bottom-wear' },
                    { name: 'Activewear', slug: 'women-activewear' },
                    { name: 'Outerwear', slug: 'women-outerwear' }
                ]
            },
            {
                id: 'clothing-kids',
                name: 'Kids',
                slug: 'kids-clothing',
                items: [
                    { name: 'Boys Tees', slug: 'boys-tees' },
                    { name: 'Girls Tees', slug: 'girls-tees' },
                    { name: 'Rompers', slug: 'rompers' },
                    { name: 'Winter Wear', slug: 'kids-winter-wear' }
                ]
            }
        ]
    },
    'lifestyle': {
        id: 'little-luxuries',
        name: 'Lifestyle', // RENAMED to match header
        slug: 'lifestyle', // RENAMED
        db_slug: 'gifts', // DB Mapping
        legacy_slug: 'little-luxuries',
        description: 'Small Joys & Gifting.',
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
                name: 'Gifts & Trinkets',
                slug: 'gifts', // sub-slug reuse might be ambiguous, ensure unique path in resolve
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
    'home': {
        id: 'space-stories',
        name: 'Home & Tech', // RENAMED to match header
        slug: 'home', // RENAMED
        legacy_slug: 'space-stories',
        description: 'Decor & Comfort.',
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
    'accessories': {
        id: 'style-extras',
        name: 'Accessories', // RENAMED
        slug: 'accessories', // RENAMED
        legacy_slug: 'style-extras',
        description: 'Style Extras.',
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
                    { name: 'Drawstrings', slug: 'drawstring-bags' }
                ]
            }
        ]
    },
    'pets': {
        id: 'pets',
        name: 'Pets',
        slug: 'pets',
        legacy_slug: 'pets',
        description: 'Furry Friends.',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
        subcategories: [
            {
                id: 'pet-essentials',
                name: 'Essentials',
                slug: 'pet-essentials',
                items: [
                    { name: 'Dog Tees', slug: 'dog-tees' },
                    { name: 'Dog Tags', slug: 'pet-tags' }
                ]
            }
        ]
    }
};

export const MAIN_NAV_LINKS = [];


interface TaxonomyItem {
    label: string;
    href: string;
    badge?: string;
}

interface TaxonomyGroup {
    title: string;
    items: TaxonomyItem[];
}

interface Department {
    label: string;
    href: string;
    color: string;
    groups: TaxonomyGroup[];
}

// New Functional Department Taxonomy (Maps to updated CATEGORY_TAXONOMY)
export const DEPARTMENT_TAXONOMY: Record<string, Department> = {
    'clothing': {
        label: 'Clothing',
        href: '/shop/clothing',
        color: 'coral',
        groups: [
            {
                title: 'Men',
                items: [
                    { label: 'Classic Crew', href: '/shop/clothing/men/men-classic-crew' },
                    { label: 'Oversized Tees', href: '/shop/clothing/men/men-oversized-tees', badge: 'Trending' },
                    { label: 'Polos', href: '/shop/clothing/men/men-polos' },
                    { label: 'Hoodies', href: '/shop/clothing/men/men-hoodies' },
                    { label: 'Jackets', href: '/shop/clothing/men/men-jackets' },
                    { label: 'Bottoms', href: '/shop/clothing/men/men-bottoms' }
                ]
            },
            {
                title: 'Women',
                items: [
                    { label: 'Tops & Tees', href: '/shop/clothing/women/women-tops-tees' },
                    { label: 'Dresses', href: '/shop/clothing/women/women-dresses' },
                    { label: 'Bottom Wear', href: '/shop/clothing/women/women-bottom-wear' },
                    { label: 'Activewear', href: '/shop/clothing/women/women-activewear', badge: 'Pro' },
                    { label: 'Outerwear', href: '/shop/clothing/women/women-outerwear' }
                ]
            },
            {
                title: 'Kids',
                items: [
                    { label: 'Boys Tees', href: '/shop/clothing/kids-clothing/boys-tees' },
                    { label: 'Girls Tees', href: '/shop/clothing/kids-clothing/girls-tees' },
                    { label: 'Rompers', href: '/shop/clothing/kids-clothing/rompers', badge: 'Cute' },
                    { label: 'Winter Wear', href: '/shop/clothing/kids-clothing/kids-winter-wear' }
                ]
            }
        ]
    },
    'kids': {
        label: 'Stationery & Play',
        href: '/shop/kids',
        color: 'blue',
        groups: [
            {
                title: 'Books',
                items: [
                    { label: 'Story Books', href: '/shop/kids/kids-books/kids-story-books', badge: 'Classic' },
                    { label: 'Colouring Books', href: '/shop/kids/kids-books/kids-colouring-books', badge: 'New' },
                    { label: 'Classic Books', href: '/shop/kids/kids-books/classic-books' }
                ]
            },
            {
                title: 'Toys & Activities',
                items: [
                    { label: 'MDF Puzzles', href: '/shop/kids/toys-activities/mdf-puzzles' },
                    { label: 'Jigsaw Puzzles', href: '/shop/kids/toys-activities/jigsaw-puzzles' },
                    { label: 'Tattoos', href: '/shop/kids/toys-activities/kids-tattoos', badge: 'Fun' },
                    { label: 'Stickers', href: '/shop/kids/toys-activities/kids-stickers' }
                ]
            },
            {
                title: 'Stationery',
                items: [
                    { label: 'Sketchbooks', href: '/shop/kids/stationery/sketchbooks' },
                    { label: 'Notebooks', href: '/shop/kids/stationery/notebooks' },
                    { label: 'Daily Planners', href: '/shop/kids/stationery/daily-planners', badge: 'Hot' },
                    { label: 'Notepads', href: '/shop/kids/stationery/notepads' }
                ]
            }
        ]
    },
    'accessories': {
        label: 'Accessories',
        href: '/shop/accessories',
        color: 'purple',
        groups: [
            {
                title: 'Headwear',
                items: [
                    { label: 'Caps', href: '/shop/accessories/headwear/caps', badge: 'Best' },
                    { label: 'Snapbacks', href: '/shop/accessories/headwear/snapbacks' },
                    { label: 'Bucket Hats', href: '/shop/accessories/headwear/bucket-hats' }
                ]
            },
            {
                title: 'Wearables',
                items: [
                    { label: 'Scarves', href: '/shop/accessories/wearables/scarves' },
                    { label: 'Scrunchies', href: '/shop/accessories/wearables/scrunchies' },
                    { label: 'Aprons', href: '/shop/accessories/wearables/aprons' }
                ]
            },
            {
                title: 'Bags',
                items: [
                    { label: 'Tote Bags (Zip)', href: '/shop/accessories/bags/tote-bags-zip', badge: 'Must Have' },
                    { label: 'Large Totes', href: '/shop/accessories/bags/large-totes' },
                    { label: 'Drawstrings', href: '/shop/accessories/bags/drawstring-bags' }
                ]
            }
        ]
    },
    'home': {
        label: 'Home & Tech',
        href: '/shop/home',
        color: 'emerald',
        groups: [
            {
                title: 'Home & Decor',
                items: [
                    { label: 'Posters', href: '/shop/home/home-decor/posters' },
                    { label: 'Canvas', href: '/shop/home/home-decor/canvas' },
                    { label: 'Coasters', href: '/shop/home/home-decor/coasters' },
                    { label: 'Cushions', href: '/shop/home/home-decor/cushions' },
                    { label: 'Magnets', href: '/shop/home/home-decor/magnets' }
                ]
            },
            {
                title: 'Tech & Desk',
                items: [
                    { label: 'Mouse Pads', href: '/shop/home/desk-essentials/mouse-pads' },
                    { label: 'Gaming Pads', href: '/shop/home/desk-essentials/gaming-pads' }
                ]
            },
            {
                title: 'Drinkware',
                items: [
                    { label: 'Coffee Mugs', href: '/shop/lifestyle/drinkware/coffee-mugs' },
                    { label: 'Magic Mugs', href: '/shop/lifestyle/drinkware/magic-mugs' },
                    { label: 'Steel Bottles', href: '/shop/lifestyle/drinkware/steel-bottles' },
                    { label: 'Sippers', href: '/shop/lifestyle/drinkware/sippers' }
                ]
            }
        ]
    },
    'lifestyle': {
        label: 'Lifestyle',
        href: '/shop/lifestyle',
        color: 'pink',
        groups: [
            {
                title: 'Lifestyle',
                items: [
                    { label: 'Trinkets', href: '/shop/lifestyle/gifts/trinkets' },
                    { label: 'Keychains', href: '/shop/lifestyle/gifts/keychains' },
                    { label: 'Badges', href: '/shop/lifestyle/gifts/badges' },
                    { label: 'Luggage Tags', href: '/shop/lifestyle/gifts/luggage-tags' },
                    { label: 'Patches', href: '/shop/lifestyle/gifts/patches' }
                ]
            }
        ]
    },
    'pets': {
        label: 'Pets',
        href: '/shop/pets',
        color: 'amber',
        groups: [
            {
                title: 'Pets',
                items: [
                    { label: 'Dog Tees', href: '/shop/pets/pet-essentials/dog-tees', badge: 'Cute' },
                    { label: 'Pet Tags', href: '/shop/pets/pet-essentials/pet-tags' }
                ]
            }
        ]
    }
};
