'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Search, Filter, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PERSONALIZATION_TAXONOMY } from '@/lib/personalization';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
interface BaseProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description: string;
    metadata: {
        product_type: string;
        personalization: any;
    };
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const ProductCard = ({ product }: { product: BaseProduct }) => (
    <Link href={`/personalise/${product.id}`} className="group block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
            <Image
                src={product.images[0] || 'https://placehold.co/600x800/png?text=No+Image'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button className="w-full py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-neutral-50 flex items-center justify-center gap-2">
                    Customize <ChevronRight size={16} />
                </button>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-neutral-900 dark:text-white truncate" title={product.name}>{product.name}</h3>
            <p className="text-neutral-500 text-sm mt-1">{product.metadata.product_type}</p>
            <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-lg">₹{product.price}</span>
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">Base Price</span>
            </div>
        </div>
    </Link>
);

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function PersonaliseListingPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<BaseProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<BaseProduct[]>([]);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('metadata->>type', 'personalization_base')
                .order('created_at', { ascending: false });

            if (data) {
                setProducts(data);
                setFilteredProducts(data);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // 2. Filter Logic
    useEffect(() => {
        let result = products;

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => {
                // Determine category based on Taxonomy reverse lookup or metadata logic
                // For simplicity, we check if the product type exists in the selected category's definition
                // OR we can rely on the user confirming category_group in admin.
                // admin saves 'category_group' in taxonomy checks but not directly in metadata root usually.
                // Let's rely on checking if the product_type belongs to the category.

                const catConfig = PERSONALIZATION_TAXONOMY[selectedCategory as keyof typeof PERSONALIZATION_TAXONOMY];
                if (!catConfig) return false;

                // @ts-ignore
                if (catConfig.types && Array.isArray(catConfig.types)) {
                    // Direct types
                    // @ts-ignore
                    return catConfig.types.includes(p.metadata.product_type);
                }

                // Subcategories (Clothing)
                // @ts-ignore
                if (catConfig.subcategories) {
                    // Check if product type is in any subcategory of this group
                    // @ts-ignore
                    const allTypes = Object.values(catConfig.types).flat();
                    return allTypes.includes(p.metadata.product_type);
                }

                return false;
            });
        }

        // Subcategory Filter (e.g. Men, Women)
        if (selectedSubCategory) {
            result = result.filter(p => {
                const pGenders = p.metadata.personalization?.gender_supported || [];
                const target = selectedSubCategory.toLowerCase();
                return pGenders.includes(target) || pGenders.includes('unisex');
            });
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.metadata.product_type.toLowerCase().includes(q)
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, selectedSubCategory, searchQuery, products]);

    const categories = ['All', ...Object.keys(PERSONALIZATION_TAXONOMY)];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-[var(--header-height)]">

            {/* HEROBANNER */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Create Your Own</h1>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                        Premium custom apparel and accessories. Select a base product and make it uniquely yours with our design studio.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* SIDEBAR (Desktop) */}
                    <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Filter size={18} /> Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSelectedSubCategory(''); // Reset sub on main change
                                        }}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subcategories (Conditional) */}
                        {/* @ts-ignore */}
                        {selectedCategory !== 'All' && PERSONALIZATION_TAXONOMY[selectedCategory]?.subcategories && (
                            <div className="animate-in slide-in-from-left-2">
                                <h3 className="font-bold text-sm text-neutral-400 uppercase tracking-wider mb-3">Collection</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedSubCategory('')}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${!selectedSubCategory ? 'font-bold text-neutral-900' : 'text-neutral-500'
                                            }`}
                                    >
                                        View All
                                    </button>
                                    {/* @ts-ignore */}
                                    {PERSONALIZATION_TAXONOMY[selectedCategory].subcategories.map((sub: string) => (
                                        <button
                                            key={sub}
                                            onClick={() => setSelectedSubCategory(sub)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${selectedSubCategory === sub
                                                    ? 'bg-neutral-100 text-neutral-900 font-bold'
                                                    : 'text-neutral-600 hover:text-neutral-900'
                                                }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1">

                        {/* SEARCH & MOBILE FILTER TOGGLE */}
                        <div className="flex gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                className="lg:hidden px-4 py-3 bg-white border border-neutral-200 rounded-xl flex items-center gap-2 font-bold"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Filter size={20} /> Filters
                            </button>
                        </div>

                        {/* MOBILE FILTERS (Expandable) */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden mb-8 p-4 bg-white rounded-xl border border-neutral-200 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* PRODUCT GRID */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-900 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                                    <Search size={32} className="text-neutral-400" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900">No products found</h3>
                                <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                    className="mt-4 text-blue-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
