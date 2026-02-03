
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Simplified Taxonomy from categories.ts
const TAXONOMY = {
    'clothing': {
        name: 'Clothing',
        slug: 'clothing',
        subs: [
            {
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
                name: 'Kids',
                slug: 'kids',
                items: [
                    { name: 'Boys Tees', slug: 'boys-tees' },
                    { name: 'Girls Tees', slug: 'girls-tees' },
                    { name: 'Rompers', slug: 'rompers' },
                    { name: 'Winter Wear', slug: 'kids-winter-wear' }
                ]
            }
        ]
    },
    'kids': { // Level 1 slug in taxonomy is 'kids', but root key is kids. Wait, categories.ts says: slug: 'kids', legacy_slug: 'little-legends'. 
        // Actually the DB has root 'Kids' (slug 'kids')? No, DB has root 'Clothing', 'Accessories', etc. 
        // Wait, inspect_roots showed 'Toys & Activities' as ROOT. 
        // But categories.ts puts 'Toys & Activities' UNDER 'kids' (Stationery & Play).
        // Let's stick to categories.ts structure. If DB has diverging roots, I might create duplicates if I'm not careful.
        // BUT, the frontend navigates to /shop/kids. 
        // Let's assume we want to MATCH categories.ts.

        name: 'Stationery & Play',
        slug: 'kids-zone', // Renaming slug to avoid conflict with 'Kids' clothing if needed, but categories.ts uses 'kids'. 
        // Issue: DB already has 'Kids' under 'Clothing' (slug 'kids'). 
        // AND 'Kids' (slug 'kids') as root? No, previous output showed 'Kids' (id: 097...) parent is 'Clothing' (73d...).
        // So 'kids' slug is taken by Clothing > Kids.
        // The 'Stationery & Play' section has slug 'kids' in categories.ts. This is a CONFLICT.
        // I will use 'stationery-play' for now to distinguish.
        items: [
            {
                name: 'Books',
                slug: 'kids-books',
                items: [
                    { name: 'Story Books', slug: 'kids-story-books' },
                    { name: 'Classic Books', slug: 'classic-books' },
                    { name: 'Colouring Books', slug: 'kids-colouring-books' }
                ]
            },
            // ... other kids items
        ]
    }
};

// For this fix, I will focus on CLOTHING as that is what I tested.
// I will ensure 'Clothing' > 'Men' > 'Classic Crew' exists.

const CLOTHING_TAXONOMY = [
    {
        name: 'Men',
        slug: 'men',
        items: [
            { name: 'Classic Crew', slug: 'men-classic-crew' },
            { name: 'Oversized Tees', slug: 'men-oversized-tees' },
            // Add others if needed
        ]
    },
    {
        name: 'Women',
        slug: 'women',
        items: [
            { name: 'Tops & Tees', slug: 'women-tops-tees' },
            { name: 'Dresses', slug: 'women-dresses' },
        ]
    },
    {
        name: 'Kids',
        slug: 'kids', // This is Clothing > Kids
        items: [
            { name: 'Boys Tees', slug: 'boys-tees' },
            { name: 'Girls Tees', slug: 'girls-tees' }
        ]
    }
];

async function migrate() {
    // 1. Get Root Clothing
    const { data: root, error } = await supabase.from('categories').select('id').eq('slug', 'clothing').single();
    if (!root) { console.error('Root clothing not found'); return; }
    console.log('Root Clothing ID:', root.id);

    // 2. Iterate Level 1 (Men, Women, Kids)
    for (const l1 of CLOTHING_TAXONOMY) {
        console.log(`Processing ${l1.name}...`);

        // Find L1 Category
        let { data: catL1 } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', l1.slug)
            .eq('parent_id', root.id)
            .single();

        if (!catL1) {
            console.log(` Creating ${l1.name}...`);
            const { data: newL1 } = await supabase.from('categories').insert({
                name: l1.name,
                slug: l1.slug,
                parent_id: root.id
            }).select().single();
            catL1 = newL1;
        }

        if (catL1) {
            // 3. Upsert Items (Level 2)
            for (const item of l1.items) {
                const { data: existing } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', item.slug)
                    .single();

                if (!existing) {
                    console.log(`  Creating ${item.name} (${item.slug})...`);
                    await supabase.from('categories').insert({
                        name: item.name,
                        slug: item.slug,
                        parent_id: catL1.id
                    });
                } else {
                    console.log(`  ${item.name} exists.`);
                }
            }
        }
    }

    console.log('Done migrating clothing categories.');

    // 4. Update Test Products
    // Assign some random products to 'men-classic-crew'
    console.log('Updating test products...');

    // Get ID for men-classic-crew
    const { data: crew } = await supabase.from('categories').select('id').eq('slug', 'men-classic-crew').single();
    if (crew) {
        // Find some 'Men' products
        const { data: menCats } = await supabase.from('categories').select('id').eq('slug', 'men').single();
        if (menCats) {
            const { data: products } = await supabase.from('products').select('id').eq('category_id', menCats.id).limit(2);
            if (products && products.length > 0) {
                const ids = products.map(p => p.id);
                await supabase.from('products').update({ category_id: crew.id }).in('id', ids);
                console.log(`Updated ${ids.length} products to Men Classic Crew`);
            }
        }
    }
}

migrate();
