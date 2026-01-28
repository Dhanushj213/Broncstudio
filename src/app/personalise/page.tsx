'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Upload, Check, Loader2, Package, Gift, PenTool, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { PRODUCT_TAXONOMY, COLORS, PLACEMENTS, PRINT_SIZES } from '@/data/product_taxonomy';

// --- Types ---
interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    category_id: string;
    metadata?: {
        product_type?: string;
        gender_visibility?: string[];
        personalization?: {
            enabled: boolean;
            colors?: string[];
            sizes?: string[];
            placements?: string[];
            print_type?: string;
            print_price?: number;
            image_requirements?: {
                min_dpi: number;
                max_size_mb: number;
            };
        };
        // fallback legacy fields
        colors?: { name: string; code: string }[];
        primary_color?: string;
    };
}

export default function PersonalisePage() {
    // --- State ---

    // Step 1: Segmentation
    const [selectedCategory, setSelectedCategory] = useState(''); // e.g. "Clothing"
    const [selectedSubCategory, setSelectedSubCategory] = useState(''); // e.g. "Men" (or "Unisex")
    const [productType, setProductType] = useState(''); // e.g. "Classic Crew T-Shirt"

    // Step 2: Product Specifics
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Step 3: Configuration
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // Step 4: Personalization
    const [selectedPlacement, setSelectedPlacement] = useState('');
    const [designFile, setDesignFile] = useState<File | null>(null);
    const [designPreview, setDesignPreview] = useState<string | null>(null);
    const [designIdea, setDesignIdea] = useState('');

    // Step 5: Add-ons
    const [isGiftPacked, setIsGiftPacked] = useState(false);
    const [isBoxPacked, setIsBoxPacked] = useState(false);
    const [hasPersonalNote, setHasPersonalNote] = useState(false);
    const [personalNoteFile, setPersonalNoteFile] = useState<File | null>(null);
    const [customerNote, setCustomerNote] = useState(''); // Internal note

    const [addingToCart, setAddingToCart] = useState(false);

    // Hooks
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- Derived Data ---

    const currentCategoryData = PRODUCT_TAXONOMY.find(c => c.category === selectedCategory);
    const currentSubCategoryData = currentCategoryData?.subcategories.find(s => s.name === selectedSubCategory);

    // --- Effects ---

    // Fetch products based on selection
    useEffect(() => {
        if (!selectedCategory || !selectedSubCategory) {
            setAvailableProducts([]);
            return;
        }

        const fetchProducts = async () => {
            setLoadingProducts(true);
            // Fetch all products and filter locally for this demo (production would query by tags/meta)
            const { data } = await supabase.from('products').select('*');

            if (data) {
                // Filter Logic:
                // 1. Must match product type if selected
                // 2. Must support Personalization (config.enabled = true)
                // 3. Must be in category (loose match for demo) or match Gender Visibility

                let filtered = data.filter((p: Product) => {
                    const meta = p.metadata || {};
                    // Must enable personalization
                    if (!meta.personalization?.enabled) return false;

                    // Match Type
                    if (productType && meta.product_type !== productType && !p.name.includes(productType)) {
                        // Loose match name if type field missing
                        return false;
                    }

                    // Match SubCategory (Gender)
                    // If subcategory is 'Men', Product must have 'men' or 'unisex' in visibility
                    // If subcategory is 'Unisex', product must have 'unisex'
                    const vis = meta.gender_visibility || [];
                    const subLower = selectedSubCategory.toLowerCase();

                    if (selectedSubCategory === 'Unisex') {
                        if (!vis.includes('unisex')) return false;
                    } else if (['Men', 'Women', 'Kids'].includes(selectedSubCategory)) {
                        if (!vis.includes(subLower) && !vis.includes('unisex')) return false;
                    }

                    return true;
                });

                setAvailableProducts(filtered);
                // Auto-select if only 1
                // if (filtered.length === 1) setSelectedProduct(filtered[0]);
            }
            setLoadingProducts(false);
        };

        fetchProducts();
    }, [selectedCategory, selectedSubCategory, productType]);

    // Reset when product changes
    useEffect(() => {
        setSelectedColor('');
        setSelectedSize('');
        setSelectedPlacement('');
    }, [selectedProduct]);


    // --- Handlers ---

    const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validations
            if (file.size > 20 * 1024 * 1024) {
                alert("File too large (>20MB)");
                return;
            }
            // DPI Check (Mock)
            // In real app, we'd read image metadata.

            setDesignFile(file);
            setDesignPreview(URL.createObjectURL(file));
        }
    };

    const calculateTotal = () => {
        if (!selectedProduct) return 0;
        let total = selectedProduct.price;

        // Print Cost
        const printCost = selectedProduct.metadata?.personalization?.print_price || 199;
        total += printCost;

        // Add-ons
        if (isBoxPacked) total += (20 * 1.18);
        if (isGiftPacked) total += (50 * 1.18);
        if (hasPersonalNote) total += (50 * 1.18);

        return Math.round(total);
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        // Validation
        if (!selectedColor && (selectedProduct.metadata?.personalization?.colors?.length || 0) > 0) {
            alert("Please select a color"); return;
        }
        if (!selectedSize && (selectedProduct.metadata?.personalization?.sizes?.length || 0) > 0) {
            alert("Please select a size"); return;
        }
        if (!selectedPlacement) {
            alert("Please select a print placement"); return;
        }
        if (!designFile && !designIdea) {
            alert("Please upload a design or provide detailed instructions."); return;
        }

        setAddingToCart(true);

        // Payload Construction
        const payload = {
            product_id: selectedProduct.id,
            category: selectedCategory,
            subcategory: selectedSubCategory,
            product_type: productType,
            gender_visibility: selectedProduct.metadata?.gender_visibility,

            // Selection
            color: selectedColor,
            size: selectedSize,

            // Personalization
            print_type: selectedProduct.metadata?.personalization?.print_type || 'DTG',
            design_placement: selectedPlacement,
            uploaded_design: designFile?.name || 'No file',
            design_idea: designIdea,

            // Metadata
            dpi_verified: true, // Assumed passed validation

            // Add-ons
            gift_packing: isGiftPacked,
            box_packing: isBoxPacked,
            personal_note_file: personalNoteFile?.name,
            customer_note: customerNote,

            // Price Breakdown
            price_breakdown: {
                base: selectedProduct.price,
                print: selectedProduct.metadata?.personalization?.print_price || 199,
                addons: (calculateTotal() - selectedProduct.price - (selectedProduct.metadata?.personalization?.print_price || 199))
            }
        };

        const customProduct = {
            ...selectedProduct,
            name: `Personalised ${selectedProduct.name} (${selectedPlacement})`,
            price: calculateTotal(),
            image: selectedProduct.images?.[0] || '',
            metadata: payload
        };

        addToCart(customProduct, 'Custom');
        addToast("Added custom order to bag!", "success");
        setAddingToCart(false);
    };

    // --- Render ---

    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-32">
            <div className="bg-white border-b border-gray-100 py-12 px-6 text-center shadow-sm">
                <h1 className="font-heading text-4xl font-bold text-navy-900 mb-2">🎨 Personalise Your Product</h1>
                <p className="text-gray-500">The studio is yours. Create something unique.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

                {/* CONFIGURATOR */}
                <div className="flex-1 space-y-8">

                    {/* STEP 1: CATEGORY SELECTION */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            <h2 className="text-xl font-bold text-navy-900">Select Product Base</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                                    value={selectedCategory}
                                    onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); setProductType(''); }}
                                >
                                    <option value="">Select Category</option>
                                    {PRODUCT_TAXONOMY.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                                </select>
                            </div>

                            {/* SubCategory */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sub-Category</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                    value={selectedSubCategory}
                                    onChange={(e) => { setSelectedSubCategory(e.target.value); setProductType(''); }}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Select Group</option>
                                    {currentCategoryData?.subcategories.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>

                            {/* Product Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Type</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                    value={productType}
                                    onChange={(e) => setProductType(e.target.value)}
                                    disabled={!selectedSubCategory}
                                >
                                    <option value="">Select Type</option>
                                    {currentSubCategoryData?.types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Product Grid (Filtered) */}
                        {productType && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Choose your base model:</h3>
                                {loadingProducts ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-navy-900" /></div>
                                ) : availableProducts.length === 0 ? (
                                    <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500 text-sm">
                                        No customizable products found for this selection yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {availableProducts.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setSelectedProduct(p)}
                                                className={`p-3 rounded-xl border text-left transition-all ${selectedProduct?.id === p.id ? 'border-navy-900 bg-navy-50 ring-1 ring-navy-900' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                                    {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                                                </div>
                                                <p className="font-bold text-navy-900 text-xs truncate">{p.name}</p>
                                                <p className="text-xs text-gray-500">₹{p.price}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {selectedProduct && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 space-y-8">

                            {/* STEP 2: VARIANTS (Admin Controlled) */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <h2 className="text-xl font-bold text-navy-900">Configure Product</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Colors */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Select Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {/* Logic: Use `personalization.colors` if defined, else legacy `metadata.colors` */}
                                            {((selectedProduct.metadata?.personalization?.colors?.length || 0) > 0
                                                ? selectedProduct.metadata!.personalization!.colors
                                                : colorsFallback(selectedProduct) // Helper needed, or simplify
                                            )?.map((colorName: string) => {
                                                const colorCode = COLORS.find(c => c.name === colorName)?.code || '#ccc';
                                                return (
                                                    <button
                                                        key={colorName}
                                                        onClick={() => setSelectedColor(colorName)}
                                                        className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform ${selectedColor === colorName ? 'border-navy-900 scale-110 ring-2 ring-offset-2 ring-navy-900' : 'border-gray-200 hover:scale-105'}`}
                                                        style={{ backgroundColor: colorCode }}
                                                        title={colorName}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Select Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Logic: Use `personalization.sizes` if defined, else legacy */}
                                            {((selectedProduct.metadata?.personalization?.sizes?.length || 0) > 0
                                                ? selectedProduct.metadata!.personalization!.sizes
                                                : ['S', 'M', 'L', 'XL'] // Fallback
                                            )?.map((sizeName: string) => (
                                                <button
                                                    key={sizeName}
                                                    onClick={() => setSelectedSize(sizeName)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${selectedSize === sizeName ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-700 border-gray-200 hover:border-navy-900'}`}
                                                >
                                                    {sizeName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* STEP 3: DESIGN */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <h2 className="text-xl font-bold text-navy-900">Design & Placement</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Placement */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Print Placement</label>
                                        <div className="flex flex-wrap gap-3">
                                            {(selectedProduct.metadata?.personalization?.placements || ['Front']) // Default if empty
                                                .map((p: string) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPlacement(p)}
                                                        className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${selectedPlacement === p ? 'bg-navy-50 border-navy-900 text-navy-900' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                    >
                                                        <span className={`w-3 h-3 rounded-full ${selectedPlacement === p ? 'bg-navy-900' : 'bg-gray-300'}`} />
                                                        {p}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Upload */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Upload File</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-navy-900 transition-colors bg-gray-50 relative cursor-pointer text-center group">
                                            <input type="file" onChange={handleDesignUpload} accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <Upload className="mx-auto text-gray-400 mb-3 group-hover:text-navy-900 transition-colors" size={32} />
                                            <p className="font-bold text-navy-900 mb-1">{designFile ? designFile.name : "Click to Upload Design"}</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, PDF (Max 20MB)</p>
                                        </div>
                                    </div>

                                    {/* Preview if Image */}
                                    {designPreview && (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-white rounded border border-gray-200 overflow-hidden relative">
                                                <img src={designPreview} className="object-cover w-full h-full" alt="Preview" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-navy-900">Preview Loaded</p>
                                                <p className="text-xs text-green-600 font-bold flex items-center gap-1"><Check size={12} /> DPI Verified (Mock)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* STEP 4: ADD-ONS */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    <h2 className="text-xl font-bold text-navy-900">Add-ons</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isBoxPacked ? 'border-navy-900 bg-navy-50' : 'border-gray-200'}`}>
                                        <input type="checkbox" checked={isBoxPacked} onChange={e => setIsBoxPacked(e.target.checked)} className="mt-1 w-5 h-5 rounded text-navy-900 focus:ring-navy-900" />
                                        <div className="flex-1">
                                            <div className="flex justify-between font-bold text-navy-900"><span>Box Packing</span><span>₹{Math.round(20 * 1.18)}</span></div>
                                            <p className="text-xs text-gray-500">Secure individual box.</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isGiftPacked ? 'border-coral-500 bg-coral-50' : 'border-gray-200'}`}>
                                        <input type="checkbox" checked={isGiftPacked} onChange={e => setIsGiftPacked(e.target.checked)} className="mt-1 w-5 h-5 rounded text-coral-500 focus:ring-coral-500" />
                                        <div className="flex-1">
                                            <div className="flex justify-between font-bold text-navy-900"><span>Gift Packing</span><span>₹{Math.round(50 * 1.18)}</span></div>
                                            <p className="text-xs text-gray-500">Includes custom envelope & wrap.</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${hasPersonalNote ? 'border-navy-900 bg-navy-50' : 'border-gray-200'}`}>
                                        <input type="checkbox" checked={hasPersonalNote} onChange={e => setHasPersonalNote(e.target.checked)} className="mt-1 w-5 h-5 rounded text-navy-900 focus:ring-navy-900" />
                                        <div className="flex-1">
                                            <div className="flex justify-between font-bold text-navy-900"><span>Personal Note</span><span>₹{Math.round(50 * 1.18)}</span></div>
                                            <p className="text-xs text-gray-500">A5 printed note. Upload below.</p>
                                            {hasPersonalNote && (
                                                <input type="file" onChange={(e) => e.target.files && setPersonalNoteFile(e.target.files[0])} className="mt-2 w-full text-xs" />
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* CUSTOMER NOTE */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                                <h2 className="text-sm font-bold text-navy-900 mb-2">Note to Team (Optional)</h2>
                                <textarea value={customerNote} onChange={e => setCustomerNote(e.target.value)} rows={2} className="w-full p-3 border border-gray-200 rounded-xl text-sm" placeholder="Any specific requirements..." />
                            </section>

                        </div>
                    )}
                </div>

                {/* STICKY SUMMARY */}
                {selectedProduct && (
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100/50">
                            <h3 className="text-xl font-heading font-bold text-navy-900 mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Product</span>
                                    <span className="font-bold">₹{selectedProduct.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Custom Print</span>
                                    <span className="font-bold">₹{selectedProduct.metadata?.personalization?.print_price || 199}</span>
                                </div>
                                {(isBoxPacked || isGiftPacked || hasPersonalNote) && <div className="h-px bg-gray-100 my-2" />}
                                {isBoxPacked && <div className="flex justify-between text-gray-600"><span>Box Packing</span><span>₹{Math.round(20 * 1.18)}</span></div>}
                                {isGiftPacked && <div className="flex justify-between text-gray-600"><span>Gift Packing</span><span>₹{Math.round(50 * 1.18)}</span></div>}
                                {hasPersonalNote && <div className="flex justify-between text-gray-600"><span>Note</span><span>₹{Math.round(50 * 1.18)}</span></div>}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-navy-900">Total</span>
                                <span className="text-2xl font-bold text-coral-500">₹{calculateTotal()}</span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {addingToCart ? <Loader2 className="animate-spin" /> : <Package size={20} />}
                                Add to Cart
                            </button>

                            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-400">
                                <Info size={12} />
                                <span>Final price includes GST</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// Helper to extract colors from legacy format if new personalization config missing
function colorsFallback(p: Product) {
    if (p.metadata?.colors && Array.isArray(p.metadata.colors)) {
        return p.metadata.colors.map(c => c.name);
    }
    return [];
}
