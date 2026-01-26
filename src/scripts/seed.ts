
import { createClient } from '@supabase/supabase-js';
import { CATEGORY_TAXONOMY } from '@/data/categories';
import { readFileSync } from 'fs';
import path from 'path';

// Load .env.local manually to avoid 'dotenv' dependency if not present
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envFile = readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && !process.env[key]) {
                // Remove quotes if present
                process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
            }
        });
        console.log("✅ Loaded .env.local");
    } catch (e) {
        console.warn("⚠️ Could not load .env.local, checking process.env");
    }
};

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using Anon key as we opened RLS

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase URL or Key. Make sure .env.local exists.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPERS ---

async function upsertCategory(name: string, slug: string, description: string | undefined, parentId: string | null, type: string) {
    const { data, error } = await supabase
        .from('categories')
        .upsert({
            slug,
            name,
            description,
            parent_id: parentId,
            type,
            image_url: null // Add placeholders if needed
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (error) {
        console.error(`❌ Error upserting category ${name}:`, error.message);
        return null;
    }
    // console.log(`✅ Category: ${name} (${type})`);
    return data;
}

async function insertProductsForCategory(categoryId: string, categoryName: string, categorySlug: string) {
    // Generate 5-10 mock products
    const count = Math.floor(Math.random() * 6) + 5;
    const products = Array.from({ length: count }).map((_, i) => {
        const basePrice = 499 + Math.floor(Math.random() * 2000);
        return {
            name: `${categoryName} ${i % 2 === 0 ? 'Premium' : 'Classic'} ${i + 1}`,
            slug: `${categorySlug}-item-${i + 1}-${Math.random().toString(36).substring(7)}`,
            description: `High quality ${categoryName} designed for lifestyle.`,
            price: basePrice,
            category_id: categoryId,
            stock_status: 'in_stock',
            images: [`https://source.unsplash.com/random/400x400?product,${i}`] // Mock image
        };
    });

    const { error } = await supabase.from('products').insert(products);
    if (error) {
        console.error(`❌ Error inserting products for ${categoryName}:`, error.message);
    } else {
        // console.log(`   ✨ Added ${count} products to ${categoryName}`);
    }
}

// --- MAIN LOOP ---

async function seed() {
    console.log("🌱 Starting Database Seed...");

    for (const worldKey in CATEGORY_TAXONOMY) {
        const world = (CATEGORY_TAXONOMY as any)[worldKey];

        // 1. World
        const worldRecord = await upsertCategory(world.name, world.slug, world.description, null, 'world');
        if (!worldRecord) continue;
        console.log(`🌍 World: ${world.name}`);

        // Helper to process children
        const processChildren = async (items: any[], parentId: string, level: string) => {
            for (const item of items) {
                // Determine Type
                let type = 'category';
                if (item.type) type = item.type; // Use explicit type if available
                else if (level === 'intent') type = 'instruction'; // Fallback

                // Validate against DB constraint ('world', 'intent', 'collection', 'category')
                const validTypes = ['world', 'intent', 'collection', 'category'];
                if (!validTypes.includes(type)) type = 'collection'; // Default to collection if invalid

                // If it has 'items' (strings or objects), it might be a terminal category wrapper or a grouping
                // In local data: 
                // - Intent -> items (strings)
                // - Subcategory -> items (objects with name/slug)

                const catRecord = await upsertCategory(item.name || item.title, item.slug, item.description, parentId, type);
                if (!catRecord) continue;

                // Check for deeper nesting (Groups like Men/Women)
                if (item.subcategories) {
                    await processChildren(item.subcategories, catRecord.id, 'subcategory');
                }
                // Check for 'items' which are usually leaf nodes in this dataset
                else if (item.items) {
                    for (const leaf of item.items) {
                        const leafName = typeof leaf === 'string' ? leaf : leaf.name;
                        const leafSlug = typeof leaf === 'string' ? `${item.slug}-${leaf.toLowerCase().replace(/\s+/g, '-')}` : leaf.slug;

                        // 'item' is not a valid DB type, use 'category'
                        const leafRecord = await upsertCategory(leafName, leafSlug, undefined, catRecord.id, 'category');

                        if (leafRecord) {
                            // INSERT PRODUCTS HERE
                            await insertProductsForCategory(leafRecord.id, leafName, leafSlug);
                        }
                    }
                }
                // If no items, maybe this itself is a category to add products to?
                else {
                    await insertProductsForCategory(catRecord.id, item.name, item.slug);
                }
            }
        };

        if (world.intents) await processChildren(world.intents, worldRecord.id, 'intent');
        if (world.subcategories) await processChildren(world.subcategories, worldRecord.id, 'subcategory');
        if (world.groups) await processChildren(world.groups, worldRecord.id, 'group');
    }

    console.log("✅ Seeding Complete!");
}

seed().catch(console.error);
