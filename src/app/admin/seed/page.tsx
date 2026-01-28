'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';

// --- DATA SOURCE ---
// Structured from User Request
const SEED_DATA = [
    // --- CLOTHING ---
    { category: 'Clothing', gender: 'men', type: 'T-Shirts', items: ['Classic Crew T-Shirt', 'Standard Crew T-Shirt', 'Full Sleeve T-Shirt', 'V-Neck T-Shirt', 'Polo T-Shirt', 'Sleeveless T-Shirt', 'Raglan T-Shirt'] },
    { category: 'Clothing', gender: 'men', type: 'Outerwear', items: ['Pullover Hoodie', 'Hoodie', 'Zip Hoodie', 'Varsity Jacket'] },
    { category: 'Clothing', gender: 'men', type: 'Bottomwear', items: ['Sweatpants', 'Joggers', 'Terry Shorts', 'Tie Dye Shorts'] },

    { category: 'Clothing', gender: 'women', type: 'Tops', items: ['Classic Crew T-Shirt', 'Baby Tee', 'Crop Top', 'Crop Tank', 'Tank Top'] },
    { category: 'Clothing', gender: 'women', type: 'Dresses', items: ['T-Shirt Dress', 'Maternity Dress'] },
    { category: 'Clothing', gender: 'women', type: 'Outerwear', items: ['Cropped Hoodie'] },

    { category: 'Clothing', gender: 'kids', type: 'Boys', items: ['Classic Crew T-Shirt', 'Hoodie'] },
    { category: 'Clothing', gender: 'kids', type: 'Girls', items: ['Classic Crew T-Shirt'] },

    { category: 'Clothing', gender: 'unisex', type: 'T-Shirts', items: ['Oversized Classic T-Shirt', 'Oversized Standard T-Shirt', 'Tie Dye Oversized T-Shirt', 'Acid Wash Oversized Tee', 'Terry Oversized Tee', 'Supima T-Shirt', 'Basic T-Shirt PC', 'Cotton Stretch T-Shirt'] },
    { category: 'Clothing', gender: 'unisex', type: 'Shirts', items: ['Oversized Shirt'] },
    { category: 'Clothing', gender: 'unisex', type: 'Outerwear', items: ['Hoodie', 'Oversized Hoodie', 'Sweatshirt', 'Oversized Sweatshirt', 'Zip Hoodie', 'Acid Wash Hoodie'] },
    { category: 'Clothing', gender: 'unisex', type: 'Bottomwear', items: ['Sweatpants', 'Joggers', 'Terry Shorts', 'Tie Dye Shorts'] },

    // --- ACCESSORIES ---
    { category: 'Accessories', gender: 'unisex', type: 'Headwear', items: ['Classic Baseball Cap', 'Baseball Ottoman Cap', 'Sports Cap', 'Snapback Cap', 'Trucker Cap', 'Bucket Hat'] },

    // --- DRINKWARE ---
    { category: 'Drinkware', gender: 'unisex', type: 'Mugs', items: ['White Coffee Mug', 'Black Coffee Mug', 'Color Coffee Mug', 'Magic Coffee Mug', 'White Enamel Mug', 'Tumbler Bottle', 'Sipper Bottle', 'Steel Water Bottle'] },

    // --- TECH & DESK ---
    { category: 'Tech & Desk', gender: 'unisex', type: 'Accessories', items: ['Mouse Pad', 'Gaming Pad'] },
    { category: 'Tech & Desk', gender: 'unisex', type: 'Phone Cases', items: ['iPhone Glass Case', 'Samsung Glass Case', 'OnePlus Glass Case', 'iPhone Sublimation Case', 'Samsung Sublimation Case', 'OnePlus Sublimation Case', 'Redmi Sublimation Case'] },

    // --- GIFTS & STATIONERY ---
    { category: 'Gifts & Stationery', gender: 'unisex', type: 'Items', items: ['Bookmark', 'Keychain', 'Badge', 'Black Badge', 'Dog Tag', 'Luggage Tag', 'Stickers', 'Postcards', 'Greeting Cards', 'Embroidery Patches', 'Sketchbook', 'Notebook', 'Notepad', 'Daily Planner'] },

    // --- HOME & DECOR ---
    { category: 'Home & Decor', gender: 'unisex', type: 'Wall Art', items: ['Poster', 'Framed Poster', 'Canvas', 'Acrylic Poster', 'Metal Poster', 'Tapestry'] },
    { category: 'Home & Decor', gender: 'unisex', type: 'Living', items: ['Table Runner', 'Placemat', 'Cloth Napkin', 'Acrylic Coaster', 'Coasters', 'Fridge Magnet', 'Acrylic Display Stand', 'Christmas Ornaments'] },

    // --- TOYS & ACTIVITIES ---
    { category: 'Toys & Activities', gender: 'unisex', type: 'Puzzles', items: ['MDF Wooden Puzzle', 'Jigsaw Puzzle'] },

    // --- BAGS ---
    { category: 'Bags', gender: 'unisex', type: 'Totes', items: ['Tote Bag (Zipper)', 'Tote Bag (Non Zipper)', 'Everyday Large Tote Bag', 'Drawstring Bag'] },

    // --- PETS ---
    { category: 'Pets', gender: 'unisex', type: 'Clothing', items: ['Dog T-Shirts', 'Pet Tags'] }
];

export default function SeedPage() {
    const [status, setStatus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const log = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
        setStatus(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const runSeed = async () => {
        setLoading(true);
        setStatus([]);
        log('Starting Seed Process...', 'info');

        try {
            // 1. Get or Create Categories
            const categoriesMap = new Map();

            for (const group of SEED_DATA) {
                if (!categoriesMap.has(group.category)) {
                    // Check DB
                    const { data: existing } = await supabase
                        .from('categories')
                        .select('id')
                        .ilike('name', group.category)
                        .single();

                    if (existing) {
                        categoriesMap.set(group.category, existing.id);
                        log(`Found Category: ${group.category}`, 'success');
                    } else {
                        // Create
                        const { data: created, error } = await supabase
                            .from('categories')
                            .insert({ name: group.category, slug: group.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') })
                            .select('id')
                            .single();

                        if (error) {
                            log(`Failed to create category ${group.category}: ${error.message}`, 'error');
                            continue;
                        }
                        categoriesMap.set(group.category, created.id);
                        log(`Created Category: ${group.category}`, 'success');
                    }
                }
            }

            // 2. Insert Products
            let count = 0;
            for (const group of SEED_DATA) {
                const catId = categoriesMap.get(group.category);
                if (!catId) continue;

                for (const itemName of group.items) {
                    // Check if exists to avoid duplicates
                    const { data: existing } = await supabase
                        .from('products')
                        .select('id')
                        .eq('name', itemName)
                        .single();

                    if (existing) {
                        log(`Skipping existing: ${itemName}`, 'info');
                        continue;
                    }

                    // Construct Insert
                    const { error } = await supabase.from('products').insert({
                        name: itemName,
                        description: `Customizable base for ${itemName}. Personalize with your design.`,
                        price: 999.00, // Placeholder
                        category_id: catId,
                        images: ['https://placehold.co/600x600/f3f4f6/1f2937?text=' + encodeURIComponent(itemName)], // Dynamic Placeholder
                        metadata: {
                            is_featured: false,
                            stock_status: 'in_stock',
                            gender: group.gender,
                            gender_visibility: [group.gender],
                            product_type: group.type.toLowerCase(),

                            // CRITICAL: ENABLE PERSONALIZATION
                            personalization: {
                                enabled: true,
                                print_type: 'DTG',
                                print_price: 199,
                                placements: ['Front', 'Back'] // Default placements
                            }
                        }
                    });

                    if (error) {
                        log(`Error adding ${itemName}: ${error.message}`, 'error');
                    } else {
                        count++;
                        // log(`Added: ${itemName}`, 'success'); // Too noisy?
                    }
                }
                log(`Processed group: ${group.category} - ${group.type}`, 'info');
            }

            log(`Seed Complete! Added ${count} new products.`, 'success');

        } catch (err: any) {
            log(`Critical Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Database className="text-coral-500" />
                Product Seeder
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <p className="mb-4 text-gray-600">
                    This tool will populate the database with the requested list of personalized products.
                    It checks for existing items to prevent duplicates.
                </p>

                <h3 className="font-bold text-sm text-gray-900 mb-2">Configuration:</h3>
                <ul className="text-sm text-gray-500 list-disc list-inside mb-6 space-y-1">
                    <li>Personalization: <strong>Enabled</strong></li>
                    <li>Default Price: <strong>₹999.00</strong></li>
                    <li>Default Print Price: <strong>₹199.00</strong></li>
                    <li>Default Placements: <strong>Front, Back</strong></li>
                </ul>

                <button
                    onClick={runSeed}
                    disabled={loading}
                    className="bg-navy-900 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-navy-800 disabled:opacity-50 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Database size={18} />}
                    {loading ? 'Seeding Database...' : 'Run Seed Extraction'}
                </button>
            </div>

            {/* Logs */}
            <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm max-h-[500px] overflow-y-auto">
                {status.length === 0 && <span className="text-gray-600">Waiting to start...</span>}
                {status.map((log, i) => (
                    <div key={i} className={`mb-1 ${log.type === 'success' ? 'text-green-400' :
                            log.type === 'error' ? 'text-red-400' : 'text-blue-300'
                        }`}>
                        <span className="text-gray-600 opacity-50 mr-2">[{log.time}]</span>
                        {log.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
