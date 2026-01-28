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

interface PersonalizationConfig {
    enabled: boolean;
    colors: string[];
    sizes: string[];
    print_types: string[];
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
// COMPONENT: PRODUCT GRID
// ----------------------------------------------------------------------
function ProductSelector({ onSelect }: { onSelect: (p: BaseProduct) => void }) {
    const [products, setProducts] = useState<BaseProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchBases = async () => {
            // Fetch all valid personalization bases
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('metadata->>type', 'personalization_base'); // If migrated

            if (data) {
                // Fallback check if type isn't set yet
                const valid = data.filter((p: any) =>
                    p.metadata?.type === 'personalization_base' ||
                    p.metadata?.personalization?.enabled === true
                );
                setProducts(valid);
            }
            setLoading(false);
        };
        fetchBases();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-navy-900" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight">Create Your Own</h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Select a premium base product below, upload your design, and we'll handle the rest. Museum-quality printing on demand.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map(product => (
                    <div key={product.id} className="group cursor-pointer flex flex-col items-center text-center" onClick={() => onSelect(product)}>
                        <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-transparent group-hover:border-gray-200">
                            <Image
                                src={product.images[0] || 'https://placehold.co/600x800'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                <span className="bg-white text-navy-900 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl whitespace-nowrap">Customize</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-navy-900 mb-1 line-clamp-1">{product.metadata?.product_type || product.name}</h3>
                        <p className="text-gray-500 font-medium">From ₹{product.price}</p>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <h3 className="text-xl font-bold text-gray-400">No base products available.</h3>
                    <p className="text-gray-400">Please check back later or contact support.</p>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// COMPONENT: BUILDER WIZARD
// ----------------------------------------------------------------------
function PersonalizationBuilder({ product, onBack }: { product: BaseProduct; onBack: () => void }) {
    const { personalization: config } = product.metadata;

    // Derived Data
    const enabledPlacements = Object.entries(config.placements || {})
        .filter(([_, v]) => v.enabled)
        .map(([k, v]) => ({ name: k, ...v }));

    // State
    const [step, setStep] = useState(1); // 1=Options, 2=Print Type, 3=Design
    const [selection, setSelection] = useState({
        color: config.colors?.[0] || '',
        size: '',
        print_type: config.print_types?.[0] || '',
        placements: {} as Record<string, File | null>, // 'Front' -> File
        notes: ''
    });

    // Price Calc
    const printCost = Object.keys(selection.placements).reduce((acc, placement) => {
        return acc + (config.placements[placement]?.price || 0);
    }, 0);

    const gstRate = 0.18;
    const subtotal = product.price + printCost;
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
                                {config.print_types.map(type => (
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
                                        <div>
                                            <span className="block font-bold text-navy-900 text-lg mb-1">{type}</span>
                                            <span className="text-sm text-gray-500">High quality durable print suitable for this product.</span>
                                        </div>
                                    </label>
                                ))}
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
                                                        +₹{placement.price}
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
                    {printCost > 0 && (
                        <div className="flex items-center justify-between mb-4 text-sm animate-in slide-in-from-bottom-2">
                            <span className="text-gray-500">Printing Charges</span>
                            <span className="font-bold text-green-600">+₹{printCost.toFixed(2)}</span>
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
    const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null);

    return (
        <div className="min-h-screen bg-white">
            {selectedProduct ? (
                <PersonalizationBuilder
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                />
            ) : (
                <ProductSelector onSelect={setSelectedProduct} />
            )}
        </div>
    );
}
