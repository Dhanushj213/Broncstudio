'use client';

import React, { useEffect, useState, use } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, ArrowLeft, Upload, ShoppingBag, Check, X, ChevronRight, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { PersonalizationConfig } from '@/lib/personalization';

// ----------------------------------------------------------------------
// TYPES (Replicate BaseProduct)
// ----------------------------------------------------------------------
interface BaseProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    metadata: {
        product_type: string;
        personalization: PersonalizationConfig;
    };
}

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function PersonaliseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart } = useCart();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<BaseProduct | null>(null);

    // Selections
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Per-Placement Configuration
    // Map<PlacementKey, { enabled: boolean, printType: string, file: string | null }>
    const [placements, setPlacements] = useState<Record<string, { enabled: boolean, printType: string, uploadedImage: string | null }>>({});

    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({}); // Track uploading per placement
    const [note, setNote] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                toast.error('Product not found');
                router.push('/personalise');
                return;
            }

            setProduct(data);

            // Initialize default placements state
            const meta = data.metadata?.personalization;
            if (meta?.placements) {
                const initialPlacements: any = {};
                Object.keys(meta.placements).forEach(key => {
                    initialPlacements[key] = {
                        enabled: false,
                        printType: '',
                        uploadedImage: null
                    };
                });
                setPlacements(initialPlacements);
            }

            // Default select things if only 1 option
            if (meta?.sizes?.length === 1) setSelectedSize(meta.sizes[0]);
            if (meta?.colors?.length === 1) setSelectedColor(meta.colors[0]);

            setLoading(false);
        };

        fetchProduct();
    }, [id, router]);

    // 2. Handlers
    const togglePlacement = (key: string) => {
        setPlacements(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                enabled: !prev[key].enabled
            }
        }));
    };

    const updatePlacementConfig = (key: string, field: 'printType' | 'uploadedImage', value: any) => {
        setPlacements(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, placementKey: string) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        setUploadingState(prev => ({ ...prev, [placementKey]: true }));

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${placementKey}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${product?.id}/${fileName}`; // Group by product ID folder? or just random

            const { error: uploadError } = await supabase.storage
                .from('personalization-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('personalization-uploads')
                .getPublicUrl(filePath);

            updatePlacementConfig(placementKey, 'uploadedImage', publicUrl);
            toast.success(`${placementKey}: Image uploaded`);
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploadingState(prev => ({ ...prev, [placementKey]: false }));
        }
    };

    // 3. Price Calculation
    const calculatePrice = () => {
        if (!product) return 0;
        let total = product.price;

        const config = product.metadata.personalization;

        // Iterate over ENABLED placements
        Object.entries(placements).forEach(([key, state]) => {
            if (state.enabled) {
                // Add Placement Base Price
                const placementConfig = config.placements[key];
                if (placementConfig) total += placementConfig.price;

                // Add Print Type Price
                if (state.printType && config.print_types[state.printType]) {
                    total += config.print_types[state.printType].price;
                }
            }
        });

        return total;
    };

    const totalPrice = calculatePrice();
    const activePlacements = Object.values(placements).filter(p => p.enabled);
    const isValid =
        product &&
        (product.metadata.personalization.sizes?.length === 0 || selectedSize) &&
        (product.metadata.personalization.colors?.length === 0 || selectedColor) &&
        activePlacements.length > 0 &&
        activePlacements.every(p => p.printType); // Require print type for all enabled? Maybe image is optional for some print types? Let's assume generic valid.
    // Actually, usually user needs to upload image OR text (if we supported text). For now let's say isValid if PrintType selected. Upload might be optional if they want us to design it? 
    // User request: "Design upload per placement" implies they upload. Use check if user uploaded image?
    // Let's enforce: If enabled, must have Print Type AND Image.

    const canAddToCart = isValid && activePlacements.every(p => p.uploadedImage);

    const handleAddToCart = () => {
        if (!canAddToCart || !product) return;

        // Construct Custom Metadata
        const customMetadata = {
            is_custom: true,
            base_product_id: product.id,
            size: selectedSize,
            color: selectedColor,
            placements: placements,
            note: note,

            // Financial Breakdown for Tax Calc
            base_price_unit: product.price,
            customization_cost_unit: totalPrice - product.price,
            gst_percent: product.metadata.personalization.gst_percent ?? 12,
            print_gst_percent: product.metadata.personalization.print_gst_percent ?? 18
        };

        addToCart({
            ...product,
            price: totalPrice,
            metadata: customMetadata
        }, selectedSize || 'OS');

        toast.success('Added to cart');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-[var(--header-height)]">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
    );

    if (!product) return null;

    const meta = product.metadata.personalization;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-[var(--header-height)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <Link href="/personalise" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* LEFT: GALLERY */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Thumbnails if multiple images (Later enhancement) */}
                    </div>

                    {/* RIGHT: CONFIGURATION */}
                    <div className="space-y-10">
                        <div>
                            <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
                                {totalPrice > product.price && (
                                    <span className="text-sm text-neutral-500 line-through">Base: ₹{product.price}</span>
                                )}
                            </div>
                            <p className="text-neutral-500 mt-4 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

                        {/* 1. ATTRIBUTES */}
                        <div className="space-y-6">
                            {/* COLORS */}
                            {meta.colors && meta.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-3">Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {meta.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${selectedColor === color
                                                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SIZES */}
                            {meta.sizes && meta.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-3">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {meta.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 flex items-center justify-center rounded-lg border font-bold text-sm transition-all ${selectedSize === size
                                                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

                        {/* 2. PLACEMENTS (Iterative) */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Customization Areas</h3>
                                <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                                    Select areas to customize
                                </span>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(meta.placements).map(([key, config]) => {
                                    if (!config.enabled) return null;
                                    const isActive = placements[key]?.enabled;

                                    return (
                                        <div key={key} className={`border rounded-xl transition-all overflow-hidden ${isActive ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white bg-white dark:bg-neutral-900/50' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20'}`}>
                                            {/* HEADER (Toggle) */}
                                            <button
                                                onClick={() => togglePlacement(key)}
                                                className="w-full flex items-center justify-between p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300 bg-white'}`}>
                                                        {isActive && <Check size={12} />}
                                                    </div>
                                                    <span className={`font-bold ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>{key}</span>
                                                </div>
                                                <span className="text-sm font-medium text-neutral-500">+₹{config.price} base</span>
                                            </button>

                                            {/* BODY (Config) */}
                                            {isActive && (
                                                <div className="p-4 pt-0 border-t border-dashed border-neutral-200 dark:border-neutral-800 mt-2 animate-in slide-in-from-top-2">
                                                    <div className="grid grid-cols-1 gap-4 mt-4">

                                                        {/* Print Type Selector */}
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Print Method</label>
                                                            <select
                                                                className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900 text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                                                                value={placements[key].printType}
                                                                onChange={(e) => updatePlacementConfig(key, 'printType', e.target.value)}
                                                            >
                                                                <option value="">Select Method...</option>
                                                                {Object.entries(meta.print_types).filter(([_, c]) => c.enabled).map(([pKey, pConf]) => (
                                                                    <option key={pKey} value={pKey}>{pKey} (+₹{pConf.price})</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* File Upload */}
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Design</label>
                                                            <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${placements[key].uploadedImage ? 'border-green-500 bg-green-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                                                {placements[key].uploadedImage ? (
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                                            <div className="w-10 h-10 bg-white rounded border border-neutral-200 relative flex-shrink-0">
                                                                                <Image src={placements[key].uploadedImage!} alt="Upload" fill className="object-contain p-1" />
                                                                            </div>
                                                                            <span className="text-sm font-bold text-green-700 truncate">Image Uploaded</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => updatePlacementConfig(key, 'uploadedImage', null)}
                                                                            className="p-1.5 hover:bg-white rounded-full text-neutral-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <X size={16} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-2">
                                                                        <input
                                                                            type="file"
                                                                            className="hidden"
                                                                            accept="image/*"
                                                                            onChange={(e) => handleFileUpload(e, key)}
                                                                            disabled={uploadingState[key]}
                                                                        />
                                                                        {uploadingState[key] ? (
                                                                            <Loader2 className="animate-spin text-neutral-400" size={20} />
                                                                        ) : (
                                                                            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
                                                                                <Upload size={16} /> Upload artwork
                                                                            </div>
                                                                        )}
                                                                    </label>
                                                                )}
                                                            </div>
                                                            {config.max_width && config.max_height && (
                                                                <p className="text-[10px] text-neutral-400 mt-1.5 text-right">
                                                                    Max area: {config.max_width}" x {config.max_height}"
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. NOTES */}
                        <div>
                            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Notes</label>
                            <textarea
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                placeholder="Any special instructions for our team..."
                                rows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>


                        {/* ACTION BAR */}
                        <div className="sticky bottom-4 z-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${canAddToCart
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:translate-y-[-2px]'
                                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingBag size={20} />
                                <span>Add to Cart - ₹{totalPrice.toFixed(2)}</span>
                            </button>
                            {!canAddToCart && (
                                <p className="text-center text-xs text-red-500 mt-2 font-medium">
                                    Please select attributes and at least one placement with a print method & design.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
