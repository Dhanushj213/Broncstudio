'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, ArrowLeft, Upload, ShoppingBag, Check, X, ChevronRight, Info, Sparkles, Zap, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { PersonalizationConfig } from '@/lib/personalization';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

// ----------------------------------------------------------------------
// TYPES
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<BaseProduct | null>(null);

    // Selections
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Per-Placement Configuration
    const [placements, setPlacements] = useState<Record<string, { enabled: boolean, printType: string, uploadedImage: string | null }>>({});
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
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
            const filePath = `${product?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('personalization-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('personalization-uploads')
                .getPublicUrl(filePath);

            updatePlacementConfig(placementKey, 'uploadedImage', publicUrl);
            toast.success(`${placementKey}: Design ready`);
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploadingState(prev => ({ ...prev, [placementKey]: false }));
        }
    };

    const totalPrice = (() => {
        if (!product) return 0;
        let total = product.price;
        const config = product.metadata.personalization;

        Object.entries(placements).forEach(([key, state]) => {
            if (state.enabled) {
                const placementConfig = config.placements[key];
                if (placementConfig) total += placementConfig.price;

                if (state.printType && config.print_types[state.printType]) {
                    total += config.print_types[state.printType].price;
                }
            }
        });
        return total;
    })();

    const activePlacements = Object.values(placements).filter(p => p.enabled);
    const isValid =
        product &&
        (product.metadata.personalization.sizes?.length === 0 || selectedSize) &&
        (product.metadata.personalization.colors?.length === 0 || selectedColor) &&
        activePlacements.length > 0 &&
        activePlacements.every(p => p.printType && p.uploadedImage);

    const handleAddToCart = () => {
        if (!isValid || !product) return;

        const customMetadata = {
            is_custom: true,
            base_product_id: product.id,
            size: selectedSize,
            color: selectedColor,
            placements: placements,
            note: note,
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

        toast.success('Your design has been added to the cart!');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-[var(--header-height)]">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
    );

    if (!product) return null;

    const meta = product.metadata.personalization;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-[var(--header-height)] pb-32">

            {/* STICKY MOBILE PREVIEW */}
            <div className="sticky top-[var(--header-height)] z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 lg:hidden px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden flex-shrink-0">
                        <Image src={getGoogleDriveDirectLink(product.images[0])} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="text-sm font-black truncate w-40 dark:text-white uppercase tracking-tight">{product.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-blue-600">₹{totalPrice.toFixed(2)}</span>
                            {totalPrice > product.price && <span className="text-[10px] text-neutral-400 font-bold">Customized</span>}
                        </div>
                    </div>
                </div>
                <Link href="/personalise" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
                    <ArrowLeft size={20} />
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">

                {/* Desktop Back Nav */}
                <Link href="/personalise" className="hidden lg:inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-10 transition-all font-black uppercase text-xs tracking-widest hover:-translate-x-1">
                    <ArrowLeft size={16} /> Back to Studio
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* LEFT: GALLERY */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-[4/5] bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl group"
                        >
                            <Image
                                src={getGoogleDriveDirectLink(product.images[0])}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority
                            />

                            {/* Visual Accents */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="px-4 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">Pro Studio</span>
                                <span className="px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">Eco-Conscious</span>
                            </div>
                        </motion.div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: ShieldCheck, label: 'Quality Audit' },
                                { icon: Zap, label: 'Fast Print' },
                                { icon: ShieldCheck, label: 'Secure Pay' }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                    <badge.icon size={20} className="text-blue-600" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-500 text-center">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: CONFIGURATION */}
                    <div className="space-y-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Official Product</span>
                                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Personalizable</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter leading-none">{product.name}</h1>

                            <div className="flex items-end gap-6 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Total Impact</span>
                                    <span className="text-4xl font-black text-neutral-900 dark:text-white">₹{totalPrice.toFixed(2)}</span>
                                </div>
                                {totalPrice > product.price && (
                                    <div className="mb-1 text-sm font-bold text-neutral-400 line-through">Base: ₹{product.price}</div>
                                )}
                            </div>

                            <p className="text-neutral-500 text-lg leading-relaxed font-medium">{product.description}</p>
                        </div>

                        {/* CONFIGURATION SECTIONS */}
                        <div className="space-y-12">
                            {/* 1. SELECTIONS */}
                            <div className="space-y-8 p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                {meta.colors && meta.colors.length > 0 && (
                                    <div className="animate-in fade-in slide-in-from-left-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">01. Choose Palette</label>
                                            <span className="text-xs font-bold text-blue-600">{selectedColor || 'None'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {meta.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-6 py-3 rounded-2xl border-2 font-black text-sm transition-all duration-300 transform active:scale-95 ${selectedColor === color
                                                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xl'
                                                        : 'border-neutral-100 text-neutral-500 hover:border-neutral-300 dark:border-neutral-800'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {meta.sizes && meta.sizes.length > 0 && (
                                    <div className="animate-in fade-in slide-in-from-left-4 [animation-delay:100ms]">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">02. Select Size</label>
                                            <span className="text-xs font-bold text-blue-600">{selectedSize || 'None'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {meta.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 font-black text-sm transition-all duration-300 transform active:scale-95 ${selectedSize === size
                                                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xl'
                                                        : 'border-neutral-100 text-neutral-500 hover:border-neutral-300 dark:border-neutral-800'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. PLACEMENTS */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">03. Design Placements</h3>
                                    <div className="h-px flex-1 mx-4 bg-neutral-200 dark:bg-neutral-800" />
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(meta.placements).map(([key, config]) => {
                                        if (!config.enabled) return null;
                                        const isActive = placements[key]?.enabled;

                                        return (
                                            <div key={key} className={`group border-2 rounded-3xl transition-all duration-500 overflow-hidden ${isActive ? 'border-blue-600 bg-white dark:bg-blue-900/5 shadow-2xl' : 'border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30'}`}>
                                                <button
                                                    onClick={() => togglePlacement(key)}
                                                    className="w-full flex items-center justify-between p-6 text-left"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-blue-600 border-blue-600 text-white scale-110 rotate-3 shadow-lg' : 'border-neutral-200 bg-white dark:bg-neutral-800'}`}>
                                                            {isActive ? <Check size={20} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-neutral-300" />}
                                                        </div>
                                                        <div>
                                                            <span className={`text-lg font-black block transition-colors leading-none mb-1 ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>{key}</span>
                                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">+₹{config.price} Option</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={20} className={`text-neutral-300 transition-transform duration-500 ${isActive ? 'rotate-90 text-blue-600 scale-125' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-6 pt-0 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                                                                <div className="grid grid-cols-1 gap-6 pt-6 animate-in fade-in slide-in-from-top-4">

                                                                    {/* Print Method */}
                                                                    <div className="space-y-3">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                                                            <ShieldCheck size={12} className="text-blue-600" /> Technology
                                                                        </label>
                                                                        <div className="grid grid-cols-1 gap-2">
                                                                            {Object.entries(meta.print_types).filter(([_, c]) => c.enabled).map(([pKey, pConf]) => (
                                                                                <button
                                                                                    key={pKey}
                                                                                    onClick={() => updatePlacementConfig(key, 'printType', pKey)}
                                                                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 text-sm font-black transition-all ${placements[key].printType === pKey
                                                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                                                                        : 'border-neutral-50 dark:border-neutral-800 hover:border-neutral-100'}`}
                                                                                >
                                                                                    <span>{pKey}</span>
                                                                                    <span className="text-[10px] font-bold">+₹{pConf.price}</span>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {/* Upload */}
                                                                    <div className="space-y-3">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                                                            <Upload size={12} className="text-blue-600" /> Digital Artwork
                                                                        </label>
                                                                        <div className={`relative group/upload border-2 border-dashed rounded-[2rem] p-8 text-center transition-all duration-500 ${placements[key].uploadedImage ? 'border-green-500 bg-green-50/20 dark:bg-green-900/10 shadow-inner' : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-400 bg-white/50 dark:bg-transparent'}`}>
                                                                            {placements[key].uploadedImage ? (
                                                                                <div className="flex flex-col items-center gap-4">
                                                                                    <div className="w-24 h-24 bg-white rounded-3xl border-2 border-green-200 relative overflow-hidden shadow-2xl rotate-2">
                                                                                        <Image src={placements[key].uploadedImage!} alt="Upload" fill className="object-contain p-2" />
                                                                                    </div>
                                                                                    <div className="flex flex-col items-center">
                                                                                        <span className="text-sm font-black text-green-700 dark:text-green-400 mb-2">Design Captured</span>
                                                                                        <button
                                                                                            onClick={() => updatePlacementConfig(key, 'uploadedImage', null)}
                                                                                            className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                                        >
                                                                                            Remove X
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <label className="cursor-pointer flex flex-col items-center justify-center gap-4 py-4 group">
                                                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, key)} disabled={uploadingState[key]} />
                                                                                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-lg">
                                                                                        {uploadingState[key] ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="text-sm font-black text-neutral-900 dark:text-white mb-1 tracking-tight">Select High Res Image</div>
                                                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Supports PNG, JPG (SVG Pro)</p>
                                                                                    </div>
                                                                                </label>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. NOTES */}
                            <div className="space-y-4 p-8 bg-neutral-900 dark:bg-white rounded-[2rem] text-white dark:text-neutral-900 shadow-2xl">
                                <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    <Info size={14} /> Production Mandate
                                </label>
                                <textarea
                                    className="w-full bg-white/10 dark:bg-neutral-100 border-0 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-blue-600/30 outline-none transition-all placeholder:text-neutral-600"
                                    placeholder="Write any unique instructions regarding placement or specific color matching here..."
                                    rows={3}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* STICKY BOTTOM ACTION BAR (Mobile) */}
                        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden">
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-4 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isValid}
                                        className={`flex-1 py-5 rounded-2xl font-black text-base shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 ${isValid
                                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:shadow-blue-500/20'
                                            : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="relative">
                                            <ShoppingBag size={20} strokeWidth={3} />
                                            {isValid && <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                                        </div>
                                        <span>Add to Designer Pack</span>
                                    </button>
                                </div>
                                {!isValid && (
                                    <div className="flex items-center justify-center gap-2 mt-4 px-2">
                                        <Info size={12} className="text-red-500" />
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-red-500"> Complete all steps to finalize design </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* DESKTOP ACTION BAR */}
                        <div className="hidden lg:block pt-10">
                            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-700 ${isValid ? 'border-neutral-900 dark:border-white shadow-2xl' : 'border-neutral-100 dark:border-neutral-900'}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h4 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-1">Estimated Pack Value</h4>
                                        <div className="text-4xl font-black text-neutral-900 dark:text-white">₹{totalPrice.toFixed(2)}</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Production Queue</span>
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Ready In 3 Days
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isValid}
                                    className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition-all transform active:scale-95 ${isValid
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:translate-y-[-4px] hover:shadow-2xl'
                                        : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingBag size={24} strokeWidth={3} />
                                    <span>Personalize & Checkout</span>
                                </button>

                                {!isValid && (
                                    <p className="text-center text-xs text-red-500 mt-6 font-black uppercase tracking-widest flex items-center justify-center gap-2 opacity-70">
                                        <X size={14} className="stroke-[3]" /> Please complete the design steps above
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Visual Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
