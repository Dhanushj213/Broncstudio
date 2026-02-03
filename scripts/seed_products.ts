
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Hardcoded for this script to avoid import issues
const CATEGORY_TAXONOMY = {
    'kids': {
        id: 'little-legends',
        name: 'Stationery & Play',
        slug: 'kids',
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
        name: 'Clothing',
        slug: 'clothing',
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
                slug: 'kids-clothing', // Changed from 'kids' to match sync script conflict resolution
                items: [
                    { name: 'Boys Tees', slug: 'boys-tees' },
                    { name: 'Girls Tees', slug: 'girls-tees' },
                    { name: 'Rompers', slug: 'rompers' },
                    { name: 'Winter Wear', slug: 'kids-winter-wear' }
                ]
            }
        ]
    },
    'gifts': {
        id: 'little-luxuries',
        name: 'Gifts & Pets',
        slug: 'gifts',
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
                slug: 'gifts-trinkets', // Disambiguating slug
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
        name: 'Home & Tech',
        slug: 'home',
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
        name: 'Accessories',
        slug: 'accessories',
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
            },
            {
                id: 'tech-accessories',
                name: 'Tech Accessories',
                slug: 'phone-cases',
                items: [
                    { name: 'iPhone', slug: 'iphone-cases' },
                    { name: 'Samsung', slug: 'samsung-cases' },
                    { name: 'OnePlus', slug: 'oneplus-cases' }
                ]
            }
        ]
    },
    'pets': {
        id: 'pets',
        name: 'Pets',
        slug: 'pets',
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

const COLORS = ['Black', 'White', 'Navy', 'Red', 'Green', 'Heather Grey'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubset(arr: string[]) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, getRandomInt(1, 4));
}

async function seed() {
    console.log('--- Starting Seed ---');

    for (const [key, root] of Object.entries(CATEGORY_TAXONOMY)) {
        console.log(`Checking Root: ${root.name} (${root.slug})`);

        // Check/Create Root
        let rootId = null;
        const { data: existingRoot } = await supabase.from('categories').select('id').eq('slug', root.slug).single();

        if (!existingRoot) {
            console.log(`  Creating Root...`);
            const { data: newRoot } = await supabase.from('categories').insert({ name: root.name, slug: root.slug }).select().single();
            rootId = newRoot?.id;
        } else {
            rootId = existingRoot.id;
        }

        if (!rootId) continue;

        for (const sub of root.subcategories) {
            // Check/Create Level 2
            let subId = null;
            const { data: existingSub } = await supabase.from('categories').select('id').eq('slug', sub.slug).single();
            if (!existingSub) {
                console.log(`  Creating Sub: ${sub.name}`);
                const { data: newSub } = await supabase.from('categories').insert({ name: sub.name, slug: sub.slug, parent_id: rootId }).select().single();
                subId = newSub?.id;
            } else {
                subId = existingSub.id;
            }

            if (!subId) continue;

            for (const item of sub.items) {
                let itemId = null;
                const { data: existingItem } = await supabase.from('categories').select('id').eq('slug', item.slug).single();
                if (!existingItem) {
                    console.log(`   Creating Item: ${item.name} (${item.slug})`);
                    const { data: newItem } = await supabase.from('categories').insert({ name: item.name, slug: item.slug, parent_id: subId }).select().single();
                    itemId = newItem?.id;
                } else {
                    itemId = existingItem.id;
                }

                if (itemId) {
                    // SEED PRODUCTS
                    // Check current count
                    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', itemId);
                    const currentCount = count || 0;

                    if (currentCount < 5) {
                        const needed = 5 - currentCount;
                        console.log(`    Seeding ${needed} products for ${item.name}...`);

                        const productsToInsert = [];
                        for (let i = 0; i < needed; i++) {
                            productsToInsert.push({
                                name: `${item.name} Style ${i + 1 + currentCount}`,
                                slug: `${item.slug}-style-${i + 1 + currentCount}-${Date.now()}`,
                                category_id: itemId,
                                price: getRandomInt(29, 99),
                                stock_status: 'in_stock',
                                metadata: {
                                    colors: getRandomSubset(COLORS),
                                    sizes: getRandomSubset(SIZES)
                                }
                            });
                        }

                        if (productsToInsert.length > 0) {
                            const { error } = await supabase.from('products').insert(productsToInsert);
                            if (error) console.error('    Error inserting products:', error);
                        }
                    } else {
                        // console.log(`    ${item.name} has ${currentCount} products.`);
                    }
                }
            }
        }
    }
    console.log('--- Seed Complete ---');
}

seed();
