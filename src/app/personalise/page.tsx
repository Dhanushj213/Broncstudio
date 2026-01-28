'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Upload, Check, Loader2, Package, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// --- Types ---
interface Placement {
    name: string;
    max_w: number;
    max_h: number;
}

interface PersonalizationConfig {
    enabled: boolean;
    colors?: string[];
    sizes?: string[];
    print_types?: string[];
    placements?: Placement[]; // Now objects
    print_price?: number;
    image_requirements?: {
        min_dpi: number;
        max_size_mb: number;
    };
}

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    metadata?: {
        personalization?: PersonalizationConfig;
    };
}

// --- CONSTANTS ---
const STEPS = ['Select Base', 'Configuration', 'Design & Upload', 'Review'];

export default function PersonalisePage() {
    const [step, setStep] = useState(1);

    // Data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Selection State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedPrintType, setSelectedPrintType] = useState('');

    // Upload State (Per Placement)
    // Map: PlacementName -> File
    const [uploads, setUploads] = useState<Record<string, File>>({});
    const [previews, setPreviews] = useState<Record<string, string>>({});

    // Hooks
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- 1. Fetch Base Products ---
    useEffect(() => {
        const fetchBases = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                // .eq('metadata->personalization->enabled', true) // Syntax depends on DB setup, filtering client side safest for JSONB
                .order('created_at', { ascending: false });

            if (data) {
                const bases = data.filter((p: Product) => p.metadata?.personalization?.enabled === true);
                setProducts(bases);
            }
            setLoading(false);
        };
        fetchBases();
    }, []);

    // --- Reset Step triggers ---
    useEffect(() => {
        if (selectedProduct) {
            // Auto-select defaults if only 1 option
            const conf = selectedProduct.metadata?.personalization;
            if (conf?.print_types?.length === 1) setSelectedPrintType(conf.print_types[0]);

            setStep(2); // Move to config
        }
    }, [selectedProduct]);


    // --- Handlers ---
    const handleFileUpload = (placementName: string, file: File) => {
        if (file.size > 20 * 1024 * 1024) {
            alert('File too large (>20MB)');
            return;
        }
        // Strict Spec: 300 DPI check would happen here via FileReader/Canvas logic
        // For now we trust user but ideally prompt.

        setUploads(prev => ({ ...prev, [placementName]: file }));
        setPreviews(prev => ({ ...prev, [placementName]: URL.createObjectURL(file) }));
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        // Calc Price
        const conf = selectedProduct.metadata?.personalization;
        const basePrice = selectedProduct.price;
        const printPrice = conf?.print_price || 0;
        const gst = (basePrice + printPrice) * 0.18;
        const total = basePrice + printPrice + gst;

        const payload = {
            base_product_id: selectedProduct.id,
            base_product_name: selectedProduct.name,
            color: selectedColor || 'Default',
            size: selectedSize || 'Standard',
            print_type: selectedPrintType,
            placements: Object.keys(uploads).reduce((acc, key) => ({
                ...acc, [key]: uploads[key].name // Store filename, real app would upload to storage first
            }), {}),
            dpi_verified: true, // Mocked
            price_breakdown: {
                base: basePrice,
                print: printPrice,
                gst: gst
            }
        };

        const customItem = {
            ...selectedProduct,
            name: `Custom ${selectedProduct.name}`,
            price: total, // FULL PRICE
            image: selectedProduct.images[0],
            metadata: payload
        };

        addToCart(customItem, 'Custom');
        addToast("Custom Design Added to Cart!", "success");
        // Reset
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => window.location.reload(), 1000); // Simple reset
    };

    // --- Helpers ---
    const getPlacements = (): Placement[] => {
        const p = selectedProduct?.metadata?.personalization?.placements;
        // Handle Legacy (Array of strings) vs New (Array of Objects)
        if (!p) return [];

        if (typeof p[0] === 'string') {
            // Map legacy strings to Placement objects with defaults
            return (p as unknown as string[]).map((s) => ({
                name: s,
                max_w: 10,
                max_h: 12
            }));
        }
        return p as Placement[];
    };

    // Validation for Next Step
    const canProceedToDesign = () => {
        if (!selectedPrintType) return false;
        // If sizes exist, must select
        // If colors exist, must select (mocked for now, assuming blanks might be auto-color)
        return true;
    };

    const canAddToCart = () => {
        // Must have at least 1 upload
        return Object.keys(uploads).length > 0;
    };


    // --- Views ---

    if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#FAF9F7] pt-8 pb-32">

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                <h1 className="text-3xl font-heading font-bold text-navy-900">Personalization Studio</h1>
                <p className="text-gray-500">Select a base, configure it, and upload your art.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Product Selection / Config */}
                <div className="lg:col-span-2 space-y-8">

                    {/* STEP 1: SELECT BASE */}
                    <section className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${step === 1 ? 'border-navy-900 ring-1 ring-navy-900' : 'border-gray-100 opacity-60 hover:opacity-100'}`}>
                        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(1)}>
                            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                <span className="bg-navy-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Select Base Product
                            </h2>
                            {selectedProduct && <span className="text-green-600 font-bold text-sm flex items-center gap-1"><Check size={14} /> {selectedProduct.name}</span>}
                        </div>

                        {step === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                                {products.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedProduct(p)}
                                        className={`text-left border rounded-xl overflow-hidden transition-all ${selectedProduct?.id === p.id ? 'border-navy-900 bg-navy-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="aspect-square relative bg-gray-100">
                                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="p-3">
                                            <p className="font-bold text-navy-900 text-sm truncate">{p.name}</p>
                                            <p className="text-xs text-gray-500">From ₹{p.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* STEP 2: CONFIGURATION */}
                    {selectedProduct && (
                        <section className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${step === 2 ? 'border-navy-900 ring-1 ring-navy-900' : 'border-gray-100 opacity-60'}`}>
                            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(2)}>
                                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                    <span className="bg-navy-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Configuration
                                </h2>
                            </div>

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-top-2">

                                    {/* Print Type */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Print Type</label>
                                        <div className="flex gap-3">
                                            {(selectedProduct.metadata?.personalization?.print_types || ['DTG']).map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedPrintType(type)}
                                                    className={`px-4 py-2 border rounded-lg font-bold text-sm transition-all ${selectedPrintType === type ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors (If Any) */}
                                    {/* Mocking Color Selection UI - Assuming blanks have standard colors if defined */}

                                    {/* Sizes (If Any) */}

                                    <button
                                        onClick={() => canProceedToDesign() && setStep(3)}
                                        disabled={!canProceedToDesign()}
                                        className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl disabled:opacity-50"
                                    >
                                        Next: Design & Upload
                                    </button>
                                </div>
                            )}
                        </section>
                    )}

                    {/* STEP 3: UPLOAD */}
                    {selectedProduct && step >= 2 && (
                        <section className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${step === 3 ? 'border-navy-900 ring-1 ring-navy-900' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-center mb-4" onClick={() => setStep(3)}>
                                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                    <span className="bg-navy-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                    Upload Design
                                </h2>
                            </div>

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-top-2">
                                    <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 border border-blue-100">
                                        <Info className="shrink-0" size={20} />
                                        <p>Please upload high-quality PNG/JPG files (Min 300 DPI). Max size 20MB per file.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {getPlacements().map((placement: Placement) => (
                                            <div key={placement.name} className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex justify-between mb-3">
                                                    <span className="font-bold text-navy-900">{placement.name}</span>
                                                    {placement.max_w && <span className="text-xs text-gray-500">Max: {placement.max_w}" x {placement.max_h}"</span>}
                                                </div>

                                                <div className="flex gap-4 items-center">
                                                    {/* Upload Box */}
                                                    <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-navy-900 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative bg-gray-50">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(placement.name, e.target.files[0])}
                                                        />
                                                        <Upload className="text-gray-400 mb-2" />
                                                        <span className="text-xs font-bold text-gray-600">Click to Upload</span>
                                                    </label>

                                                    {/* Preview */}
                                                    {previews[placement.name] && (
                                                        <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden shrink-0">
                                                            <img src={previews[placement.name]} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-0 inset-x-0 bg-green-500 text-white text-[10px] text-center font-bold py-0.5">READY</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                </div>

                {/* RIGHT: Summary Cart */}
                {selectedProduct && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                            <h3 className="text-xl font-bold text-navy-900 mb-6">Price Breakdown</h3>

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Item ({selectedProduct.name})</span>
                                    <span className="font-bold">₹{selectedProduct.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Printing Charges</span>
                                    <span className="font-bold">₹{selectedProduct.metadata?.personalization?.print_price || 0}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>GST (18%)</span>
                                    <span>₹{((selectedProduct.price + (selectedProduct.metadata?.personalization?.print_price || 0)) * 0.18).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-navy-900">Total</span>
                                <span className="text-2xl font-bold text-coral-500">
                                    ₹{((selectedProduct.price + (selectedProduct.metadata?.personalization?.print_price || 0)) * 1.18).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart()}
                                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl shadow-lg hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Package size={20} />
                                Add Custom Order
                            </button>
                            {!canAddToCart() && <p className="text-center text-xs text-red-500 mt-2">Upload at least one design to proceed.</p>}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
