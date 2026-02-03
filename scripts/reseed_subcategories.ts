
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STANDARD_STRUCTURE: Record<string, string[]> = {
    'Clothing': ['Men', 'Women', 'Kids', 'T-Shirts', 'Hoodies', 'Jackets'],
    'Accessories': ['Caps', 'Hats', 'Scarves', 'Socks'],
    'Drinkware': ['Coffee Mugs', 'Water Bottles', 'Tumblers'],
    'Tech & Desk': ['Phone Cases', 'Mouse Pads', 'Laptop Sleeves'],
    'Gifts & Stationery': ['Notebooks', 'Stickers', 'Greeting Cards', 'Badges'],
    'Home & Decor': ['Posters', 'Cushions', 'Wall Art'],
    'Toys & Activities': ['Puzzles', 'DIY Kits', 'Board Games'],
    'Bags': ['Tote Bags', 'Backpacks', 'Pouches'],
    'Pets': ['Dog Tees', 'Pet Bandanas', 'Pet Tags']
};

const DUMMY_IMAGES = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    'https://images.unsplash.com/photo-1503602642458-2321114458ed?w=800&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc072ed28?w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
];

async function main() {
    console.log('Starting re-seed process...');

    // 1. Fetch Core Department IDs
    const { data: depts, error: deptError } = await supabase
        .from('categories')
        .select('id, name')
        .is('parent_id', null);

    if (deptError || !depts) {
        console.error('Error fetching departments:', deptError);
        return;
    }

    console.log(`Found ${depts.length} core departments.`);

    for (const dept of depts) {
        const subcats = STANDARD_STRUCTURE[dept.name];
        if (!subcats) {
            console.log(`Skipping ${dept.name} (no structure defined)`);
            continue;
        }

        console.log(`Processing Department: ${dept.name}...`);

        for (const subName of subcats) {
            // 2. Create/Get Subcategory
            let subId = '';
            const { data: existingSub } = await supabase
                .from('categories')
                .select('id')
                .eq('parent_id', dept.id)
                .eq('name', subName)
                .single();

            if (existingSub) {
                subId = existingSub.id;
                // Don't re-seed products if they might exist, but user asked for "add some". 
                // I will just add them anyway, they have random slugs.
            } else {
                const { data: newSub, error: createError } = await supabase
                    .from('categories')
                    .insert({
                        name: subName,
                        slug: subName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
                        parent_id: dept.id,
                        description: `Best ${subName}`
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error(`  Error creating subcat ${subName}:`, createError.message);
                    continue;
                }
                subId = newSub.id;
                console.log(`  Created Subcategory: ${subName}`);
            }

            // 3. Create 5 Dummy Products
            const products = Array.from({ length: 5 }).map((_, i) => {
                const name = `${subName} Test Product ${i + 1}`;
                const slug = `${subName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-test-${i + 1}-${Math.random().toString(36).substr(2, 5)}`;

                return {
                    name: name,
                    slug: slug,
                    description: `This is a high-quality test product for ${subName}.`,
                    price: (Math.random() * 2000 + 500).toFixed(2),
                    category_id: subId,
                    images: [DUMMY_IMAGES[i % DUMMY_IMAGES.length]],
                    metadata: {
                        stock_status: 'in_stock',
                        is_featured: i === 0,
                        is_new_arrival: i === 1,
                        colors: [
                            { name: 'Black', code: '#000000' },
                            { name: 'White', code: '#ffffff' }
                        ],
                        sizes: ['S', 'M', 'L']
                    }
                };
            });

            const { error: prodError } = await supabase
                .from('products')
                .insert(products);

            if (prodError) {
                console.error(`    Error adding products to ${subName}:`, prodError.message);
            } else {
                console.log(`    Added 5 products to ${subName}`);
            }
        }
    }

    console.log('Re-seed complete!');
}

main();
