'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Upload, ShoppingBag, ArrowRight, ArrowLeft, Check, X, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Image from 'next/image';

// ----------------------------------------------------------------------
// TYPES (Derived from New Admin Schema)
// ----------------------------------------------------------------------
interface PlacementConfig {
    enabled: boolean;
    price: number;
    max_width: number;
    max_height: number;
}

interface PrintTypeConfig {
    enabled: boolean;
    price: number;
}

interface PersonalizationConfig {
    enabled: boolean;
    colors: string[];
    sizes: string[];
    print_types: Record<string, PrintTypeConfig>;
    placements: Record<string, PlacementConfig>;
    image_requirements: {
        min_dpi: number;
        max_size_mb: number;
        allowed_formats: string[];
    };
}

interface BaseProduct {
    id: string;
    name: string; // Internal name
    price: number;
    images: string[];
    description: string;
    metadata: {
        product_type: string;
        personalization: PersonalizationConfig;
    };
}

// ----------------------------------------------------------------------
// DATA & UTILS (Client Side Taxonomy)
// ----------------------------------------------------------------------
import { PERSONALIZATION_TAXONOMY, Gender } from '@/lib/personalization';
const CATEGORY_GROUPS = Object.keys(PERSONALIZATION_TAXONOMY);

// ----------------------------------------------------------------------
// COMPONENT: START SCREEN (Categories)
// ----------------------------------------------------------------------
function CategorySelectionView({ onSelect }: { onSelect: (category: string, subCategory?: string) => void }) {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight mb-4">Start Designing</h1>
            <p className="text-gray-500 text-lg mb-12">Select a category to view available blank products.</p>

            {!selectedGroup ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {CATEGORY_GROUPS.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                // @ts-ignore
                                if (PERSONALIZATION_TAXONOMY[cat].subcategories) {
                                    setSelectedGroup(cat);
                                } else {
                                    onSelect(cat);
                                }
                            }}
                            className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl border border-gray-100 hover:border-navy-100 transition-all group"
                        >
                            <span className="text-xl font-bold text-navy-900 group-hover:text-blue-600">{cat}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <button onClick={() => setSelectedGroup(null)} className="mb-8 text-sm font-bold text-gray-400 hover:text-navy-900 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back to Categories
                    </button>
                    <h2 className="text-2xl font-bold text-navy-900 mb-8">Select Collection</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* @ts-ignore */}
                        {PERSONALIZATION_TAXONOMY[selectedGroup].subcategories?.map((sub: string) => (
                            <button
                                key={sub}
                                onClick={() => onSelect(selectedGroup, sub)}
                                className="p-8 rounded-3xl bg-blue-50 hover:bg-blue-600 hover:shadow-xl border border-blue-100 transition-all group"
                            >
                                <span className="text-xl font-bold text-blue-900 group-hover:text-white capitalize">{sub}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// COMPONENT: FILTERED PRODUCT GRID
// ----------------------------------------------------------------------
function FilteredProductList({ category, subCategory, onSelect, onBack }: { category: string; subCategory?: string; onSelect: (p: BaseProduct) => void; onBack: () => void }) {
    const [products, setProducts] = useState<BaseProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('metadata->>type', 'personalization_base');

            if (data) {
                // Filter Logic
                const filtered = data.filter((p: any) => {
                    const pMeta = p.metadata?.personalization || {};
                    // Check if product belongs to this category logic (using internal name or explicit field if added)
                    // Currently rely on 'Name' or 'Product Type' matching the taxonomy?
                    // Better: We should filter by gender_supported if subCategory is a Gender

                    if (category === 'Clothing' && subCategory) {
                        // Gender check
                        const supported = p.metadata?.gender_supported || [];
                        const targetGender = subCategory.toLowerCase();
                        // Special case: 'Unisex' products show up in Men and Women
                        if (targetGender === 'men' || targetGender === 'women') {
                            return supported.includes(targetGender) || supported.includes('unisex');
                        }
                        return supported.includes(targetGender);
                    }
                    // For other categories, just show all for now or filter by type string matching
                    // Crude filter: check if Product Type is in the taxonomy list for this category
                    // @ts-ignore
                    const types = PERSONALIZATION_TAXONOMY[category]?.types || [];
                    return Array.isArray(types) && types.includes(p.metadata.product_type);
                });
                setProducts(filtered);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [category, subCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={20} className="text-navy-900" />
                </button>
                <h2 className="text-2xl font-black text-navy-900">
                    {category} {subCategory && ` / ${subCategory}`}
                </h2>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <h3 className="text-xl font-bold text-gray-400">No products found.</h3>
                    <p className="text-gray-400">Try a different category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="group cursor-pointer" onClick={() => onSelect(product)}>
                            <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                                <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="font-bold text-navy-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">₹{product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// COMPONENT: BUILDER WIZARD
// ----------------------------------------------------------------------
function PersonalizationBuilder({ product, onBack }: { product: BaseProduct; onBack: () => void }) {
    // Normalization Helper for Backwards Compatibility
    const normalizeConfig = (rawConfig: any): PersonalizationConfig => {
        const config = { ...rawConfig };

        // Migrate Print Types (Array -> Record)
        if (Array.isArray(config.print_types)) {
            const newTypes: Record<string, PrintTypeConfig> = {};
            config.print_types.forEach((t: string) => {
                // Default legacy types to enabled with standard price if not present
                newTypes[t] = { enabled: true, price: 50 };
            });
            config.print_types = newTypes;
        }

        // Migrate Placements if needed (though admin handles this, read-only might need safety) //
        return config;
    };

    const config = normalizeConfig(product.metadata.personalization);

    // Derived Data
    const enabledPlacements = Object.entries(config.placements || {})
        .filter(([_, v]) => v.enabled)
        .map(([k, v]) => ({ name: k, ...v }));

    // State
    const [step, setStep] = useState(1); // 1=Options, 2=Print Type, 3=Design
    const [selection, setSelection] = useState({
        color: config.colors?.[0] || '',
        size: '',
        print_type: Object.keys(config.print_types || {})[0] || '',
        placements: {} as Record<string, File | null>, // 'Front' -> File
        notes: ''
    });

    // Price Calc
    const selectedPrintTypePrice = config.print_types?.[selection.print_type]?.price || 0;

    // Total Print Cost = Sum of (Placement Cost + Placement Print Surcharge)
    // Wait, typically Surcharge is per placement. So for every active placement, we add the print type price.
    const numberOfPlacements = Object.keys(selection.placements).length;
    const placementBaseCost = Object.keys(selection.placements).reduce((acc, placement) => {
        return acc + (config.placements[placement]?.price || 0);
    }, 0);

    const totalPrintCost = placementBaseCost + (selectedPrintTypePrice * numberOfPlacements);

    const gstRate = 0.18;
    const subtotal = product.price + totalPrintCost;
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;

    // Helpers
    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const canProceed = () => {
        if (step === 1) {
            // Validate Color & Size (if applicable)
            if (!selection.color) return false;
            // If sizes exist, it MUST be selected
            if (config.sizes?.length > 0 && !selection.size) return false;
            return true;
        }
        if (step === 2) return !!selection.print_type;
        if (step === 3) return Object.keys(selection.placements).length > 0;
        return false;
    };

    const handleFileUpload = (placement: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelection(prev => ({
                ...prev,
                placements: { ...prev.placements, [placement]: e.target.files![0] }
            }));
        }
    };

    const removeFile = (placement: string) => {
        const newPlacements = { ...selection.placements };
        delete newPlacements[placement];
        setSelection(prev => ({ ...prev, placements: newPlacements }));
    };

    const handleAddToCart = () => {
        alert("Added to Cart Successfully! (Simulated)");
        // In real app: Add to Context Cart with metadata
        // router.push('/cart');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">

            {/* LEFT: PREVIEW AREA */}
            <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col relative px-4 py-8 lg:p-0">
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={onBack}
                        className="p-3 bg-white rounded-full shadow-md text-navy-900 hover:scale-110 transition-transform flex items-center justify-center"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center min-h-[50vh] lg:min-h-screen">
                    <div className="relative w-full max-w-lg aspect-[4/5] bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                        <Image
                            src={product.images[0]}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        {/* Fake Tint Overlay */}
                        <div
                            className="absolute inset-0 mix-blend-multiply opacity-20 pointer-events-none"
                            style={{ backgroundColor: selection.color.toLowerCase() }}
                        />

                        {/* Simple Tag */}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-navy-900 shadow-sm border border-gray-100 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-green-600" /> Base: {product.metadata.product_type}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: CONFIGURATION WIZARD */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col h-screen overflow-y-auto">

                {/* Header */}
                <div className="pt-12 px-8 lg:px-16 pb-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-400">
                        <span className={`transition-colors ${step >= 1 ? 'text-navy-900' : ''}`}>01 Options</span>
                        <div className={`h-px w-8 transition-colors ${step >= 2 ? 'bg-navy-900' : 'bg-gray-200'}`} />
                        <span className={`transition-colors ${step >= 2 ? 'text-navy-900' : ''}`}>02 Method</span>
                        <div className={`h-px w-8 transition-colors ${step >= 3 ? 'bg-navy-900' : 'bg-gray-200'}`} />
                        <span className={`transition-colors ${step >= 3 ? 'text-navy-900' : ''}`}>03 Design</span>
                    </div>
                    <h2 className="text-3xl font-black text-navy-900 mb-1">{product.name}</h2>
                    <p className="text-sm text-gray-500">Customize your premium product.</p>
                </div>

                {/* STEPS CONTENT */}
                <div className="flex-1 px-8 lg:px-16 py-8 space-y-12">

                    {/* STEP 1: OPTIONS (Color & Size) */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 space-y-10">

                            {/* Colors */}
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                                    Product Color <span className="text-red-500">*</span>
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {config.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelection({ ...selection, color })}
                                            className={`group relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${selection.color === color
                                                ? 'border-navy-900 scale-110 shadow-lg'
                                                : 'border-transparent hover:scale-105'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-full rounded-full border border-gray-200 shadow-inner"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            />
                                            {selection.color === color && (
                                                <div className="absolute -bottom-8 bg-black text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {color}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-3 text-sm font-bold text-navy-900/70">Selected: {selection.color || 'None'}</p>
                            </div>

                            {/* Sizes */}
                            {config.sizes?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                                        Size <span className="text-red-500">*</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {config.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelection({ ...selection, size })}
                                                className={`w-16 h-12 rounded-xl text-sm font-bold border-2 transition-all ${selection.size === size
                                                    ? 'border-navy-900 bg-navy-900 text-white shadow-lg shadow-navy-900/20'
                                                    : 'border-gray-100 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="text-xs font-bold text-blue-600 mt-4 hover:underline">View Size Guide</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: PRINT TYPE */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                                Printing Method <span className="text-red-500">*</span>
                            </h3>
                            <div className="grid gap-4">
                                <div className="grid gap-4">
                                    {Object.entries(config.print_types || {}).filter(([_, v]) => v.enabled).map(([type, typeConfig]) => (
                                        <label
                                            key={type}
                                            className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${selection.print_type === type
                                                ? 'border-navy-900 bg-navy-50 shadow-md ring-1 ring-navy-900'
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setSelection({ ...selection, print_type: type })}
                                        >
                                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selection.print_type === type ? 'border-navy-900' : 'border-gray-300'
                                                }`}>
                                                {selection.print_type === type && <div className="w-2.5 h-2.5 rounded-full bg-navy-900" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="block font-bold text-navy-900 text-lg mb-1">{type}</span>
                                                    {numberOfPlacements > 0 && (
                                                        <span className="text-sm font-bold text-navy-900 bg-white px-2 py-1 rounded border border-gray-200">
                                                            +₹{typeConfig.price * numberOfPlacements}
                                                        </span>
                                                    )}
                                                    {numberOfPlacements === 0 && (
                                                        <span className="text-sm font-bold text-gray-400">
                                                            +₹{typeConfig.price}/loc
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500">Premium quality {type.toLowerCase()}.</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PLACEMENTS & UPLOAD */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 space-y-8 pb-32">
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-2">Upload Your Design</h3>
                                <p className="text-gray-500 text-sm mb-6">Choose print locations and upload artwork for each.</p>

                                <div className="space-y-4">
                                    {enabledPlacements.map(placement => {
                                        const hasFile = !!selection.placements[placement.name];
                                        return (
                                            <div key={placement.name} className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all ${hasFile ? 'border-green-500 bg-white ring-1 ring-green-500' : 'border-dashed border-gray-200 hover:border-navy-200 bg-gray-50/50'
                                                }`}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <span className="font-bold text-navy-900 text-lg">{placement.name}</span>
                                                        <br />
                                                        <span className="text-xs text-gray-500">Max {placement.max_width}" x {placement.max_height}"</span>
                                                    </div>
                                                    <span className="text-sm font-bold bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm text-gray-700">
                                                        {selectedPrintTypePrice > 0 ? `+₹${placement.price + selectedPrintTypePrice}` : `+₹${placement.price}`}
                                                    </span>
                                                </div>

                                                {hasFile ? (
                                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center text-green-700">
                                                                <Check size={20} />
                                                            </div>
                                                            <div>
                                                                <span className="block text-sm font-bold text-green-800 truncate max-w-[150px]">
                                                                    {selection.placements[placement.name]?.name}
                                                                </span>
                                                                <span className="text-[10px] text-green-600 font-bold">Ready for print</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => removeFile(placement.name)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full py-6 bg-white border border-gray-200 rounded-xl hover:border-navy-900 hover:shadow-md transition-all group">
                                                        <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 group-hover:scale-110 transition-transform">
                                                            <Upload size={20} />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-sm font-bold text-navy-900 block mb-0.5">Click to upload</span>
                                                            <span className="text-[10px] text-gray-400">JPG, PNG, PDF (Max 20MB)</span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept={config.image_requirements.allowed_formats.map(f => `.${f}`).join(',')}
                                                            onChange={(e) => handleFileUpload(placement.name, e)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="text-sm font-bold text-navy-900 mb-2">Instructions for printing (Optional)</h3>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 transition-colors text-sm"
                                    placeholder="e.g. Center logo perfectly, Make logo 3 inch wide..."
                                    rows={3}
                                    value={selection.notes}
                                    onChange={(e) => setSelection({ ...selection, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* STICKY FOOTER: PRICE & ACTIONS */}
                <div className="border-t border-gray-100 bg-white p-6 lg:px-16 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 text-sm">
                        <span className="text-gray-500">Base Product</span>
                        <span className="font-bold">₹{product.price.toFixed(2)}</span>
                    </div>
                    {totalPrintCost > 0 && (
                        <div className="flex items-center justify-between mb-4 text-sm animate-in slide-in-from-bottom-2">
                            <span className="text-gray-500">Printing Charges</span>
                            <span className="font-bold text-green-600">+₹{totalPrintCost.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                        <div>
                            <span className="block text-2xl font-black text-navy-900">₹{subtotal.toFixed(2)}</span>
                            <span className="text-xs text-gray-400">+18% GST Calculated at Checkout</span>
                        </div>

                        <div className="flex gap-3">
                            {step > 1 && (
                                <button onClick={handlePrev} className="px-6 py-4 font-bold text-gray-500 hover:text-navy-900 hover:bg-gray-50 rounded-xl transition-colors">
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-navy-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!canProceed()}
                                    className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-navy-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag size={18} /> Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN PAGE ROUTER
// ----------------------------------------------------------------------
export default function PersonalisePage() {
    const [view, setView] = useState<'CATEGORY' | 'LIST' | 'BUILDER'>('CATEGORY');
    const [category, setCategory] = useState<{ main: string; sub?: string } | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null);

    const handleCategorySelect = (main: string, sub?: string) => {
        setCategory({ main, sub });
        setView('LIST');
    };

    const handleProductSelect = (p: BaseProduct) => {
        setSelectedProduct(p);
        setView('BUILDER');
    };

    return (
        <div className="min-h-screen bg-white">
            {view === 'CATEGORY' && <CategorySelectionView onSelect={handleCategorySelect} />}

            {view === 'LIST' && category && (
                <FilteredProductList
                    category={category.main}
                    subCategory={category.sub}
                    onSelect={handleProductSelect}
                    onBack={() => setView('CATEGORY')}
                />
            )}

            {view === 'BUILDER' && selectedProduct && (
                <PersonalizationBuilder
                    product={selectedProduct}
                    onBack={() => setView('LIST')}
                />
            )}
        </div>
    );
}
