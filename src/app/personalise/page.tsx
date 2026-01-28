'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Check, Upload, ShoppingBag, ArrowRight, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Types derived from our Admin Logic
interface PersonalizationConfig {
    enabled: boolean;
    colors: string[];
    sizes: string[];
    print_types: string[];
    placements: string[]; // ['Front', 'Back']
    print_prices: Record<string, number>;
    image_requirements: {
        min_dpi: number;
        max_size_mb: number;
        allowed_formats: string[];
    };
}

interface BaseProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    metadata: {
        personalization: PersonalizationConfig;
    };
}

// ----------------------------------------------------------------------
// COMPONENT: PRODUCT SELECTOR
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
            // Fetch products tagged as 'personalization_base' OR enabled for personalization
            // For now, we filter on client side if needed, or query specifically.
            // Let's assume we want ALL products that have personalization.enabled = true
            const { data, error } = await supabase
                .from('products')
                .select('*')
                // .eq('metadata->>type', 'personalization_base') // Ideal if we strictly migrated
                .not('metadata->personalization', 'is', null);

            if (data) {
                // Filter client side to be safe
                const valid = data.filter((p: any) => p.metadata?.personalization?.enabled === true);
                setProducts(valid);
            }
            setLoading(false);
        };
        fetchBases();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-navy-900 mb-2 font-display">Start Designing</h1>
            <p className="text-gray-500 mb-12">Select a premium base product to customize.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => onSelect(product)}>
                        <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-transparent group-hover:border-navy-900/10 transition-all shadow-sm group-hover:shadow-2xl">
                            <Image
                                src={product.images[0] || 'https://placehold.co/600x800'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pb-8">
                                <span className="bg-white text-navy-900 px-6 py-2 rounded-full font-bold text-sm shadow-xl">Customize This</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-navy-900">{product.name}</h3>
                        <p className="text-gray-500">From ₹{product.price}</p>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <h3 className="text-xl font-bold text-gray-400">No customizable products found.</h3>
                    <p className="text-gray-400">Please contact admin to enable personalization bases.</p>
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

    // State
    const [step, setStep] = useState(1); // 1=Color, 2=Size, 3=Placement/Upload
    const [selection, setSelection] = useState({
        color: config.colors[0] || '',
        size: '',
        placements: {} as Record<string, File | null> // 'Front' -> File
    });

    const currentPrice = product.price + Object.keys(selection.placements).reduce((acc, placement) => {
        return acc + (config.print_prices[placement] || 0);
    }, 0);

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const canProceed = () => {
        if (step === 1) return !!selection.color;
        if (step === 2) return !!selection.size;
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

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* LEFT: PREVIEW AREA */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 p-2 bg-white rounded-full shadow-lg text-navy-900 hover:scale-110 transition-transform z-10"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="relative w-full max-w-md aspect-[4/5] bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Simplified Preview Mockup */}
                    <Image
                        src={product.images[0]}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />

                    {/* Overlay for Color Tinting (Simplified) */}
                    {selection.color && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-navy-900 shadow-sm border border-gray-100">
                            Selected: {selection.color}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: CONTROLS */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-20 flex flex-col">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-8 text-sm font-bold text-gray-400">
                        <span className={step >= 1 ? 'text-navy-900' : ''}>01 Color</span>
                        <div className="w-8 h-px bg-gray-200" />
                        <span className={step >= 2 ? 'text-navy-900' : ''}>02 Size</span>
                        <div className="w-8 h-px bg-gray-200" />
                        <span className={step >= 3 ? 'text-navy-900' : ''}>03 Design</span>
                    </div>

                    <h2 className="text-3xl font-black text-navy-900 mb-2">{product.name}</h2>
                    <p className="text-xl text-navy-900 font-bold mb-8">₹{currentPrice.toFixed(2)}</p>

                    <div className="space-y-8 min-h-[300px]">

                        {/* STEP 1: COLOR */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Color</h3>
                                <div className="flex flex-wrap gap-4">
                                    {config.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelection({ ...selection, color })}
                                            className={`px-6 py-3 rounded-xl border-2 transition-all font-bold ${selection.color === color
                                                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                                                    : 'border-gray-100 text-gray-500 hover:border-navy-200'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: SIZE */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {config.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelection({ ...selection, size })}
                                            className={`w-16 h-12 flex items-center justify-center rounded-xl border-2 transition-all font-bold ${selection.size === size
                                                    ? 'border-navy-900 bg-navy-900 text-white shadow-lg shadow-navy-900/20'
                                                    : 'border-gray-100 text-gray-500 hover:border-navy-200'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PLACEMENT & UPLOADS */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                                <h3 className="text-lg font-bold text-gray-900">Customize Placements</h3>
                                <div className="space-y-4">
                                    {config.placements.map(placement => {
                                        const hasFile = !!selection.placements[placement];
                                        return (
                                            <div key={placement} className={`p-4 rounded-xl border-2 transition-all ${hasFile ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-200 hover:border-navy-300'
                                                }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-navy-900">{placement}</span>
                                                    <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded">
                                                        +₹{config.print_prices[placement] || 199}
                                                    </span>
                                                </div>

                                                {hasFile ? (
                                                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-green-200">
                                                        <span className="text-sm truncate max-w-[150px] text-green-700 font-medium">
                                                            {selection.placements[placement]?.name}
                                                        </span>
                                                        <button
                                                            onClick={() => removeFile(placement)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center justify-center gap-2 cursor-pointer w-full py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors">
                                                        <Upload size={16} />
                                                        <span className="text-sm font-bold">Upload Design</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept={config.image_requirements.allowed_formats.map(f => `.${f}`).join(',')}
                                                            onChange={(e) => handleFileUpload(placement, e)}
                                                        />
                                                    </label>
                                                )}

                                                {!hasFile && (
                                                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                                                        Max {config.image_requirements.max_size_mb}MB • {config.image_requirements.allowed_formats.join(', ').toUpperCase()} • {config.image_requirements.min_dpi} DPI Recommended
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    {step > 1 ? (
                        <button
                            onClick={handlePrev}
                            className="px-6 py-3 font-bold text-gray-500 hover:text-navy-900 transition-colors"
                        >
                            Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => alert("Added to Cart! (Demo)")}
                            disabled={!canProceed()}
                            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                            <ShoppingBag size={18} /> Add to Cart - ₹{currentPrice.toFixed(2)}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN PAGE VIEW
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
