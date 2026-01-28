'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Upload, ShoppingBag, ArrowRight, ArrowLeft, Check, X, ShieldCheck, ChevronDown, Info } from 'lucide-react';
import Image from 'next/image';
import { PERSONALIZATION_TAXONOMY, PrintTypeConfig, PlacementConfig, PersonalizationConfig } from '@/lib/personalization';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
interface BaseProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    metadata: {
        product_type: string;
        personalization: PersonalizationConfig;
    };
}

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function PersonalisePage() {
    const { addToCart } = useCart();
    // State: Selection
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [availableProducts, setAvailableProducts] = useState<BaseProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // State: Customization
    const [size, setSize] = useState<string>('');
    const [placement, setPlacement] = useState<string>('');
    const [printType, setPrintType] = useState<string>('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [note, setNote] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch Products when criteria change
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchProducts = async () => {
            setLoadingProducts(true);
            setAvailableProducts([]);

            // Fetch all base products
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('metadata->>type', 'personalization_base');

            if (data) {
                // Client-side filtering based on taxonomy + gender visibility
                const filtered = data.filter((p: BaseProduct) => {
                    const pMeta = p.metadata?.personalization;
                    const pType = p.metadata?.product_type;
                    if (!pType || !pMeta) return false;

                    // 1. Check if Category matches (Taxonomy)
                    // @ts-ignore
                    const categoryConfig = PERSONALIZATION_TAXONOMY[selectedCategory];
                    if (!categoryConfig) return false;

                    // 2. Handle Subcategories (Clothing)
                    if (categoryConfig.subcategories) {
                        if (!selectedSubCategory) return false;

                        const targetGender = selectedSubCategory.toLowerCase();
                        const pGenders = pMeta.gender_supported || [];

                        // Rule: Product must support the selected gender (e.g. 'Men' selected -> Product supports 'men')
                        // Unisex products support ['men', 'women', 'unisex'] so they will pass.
                        // Standard products supports ['men'] so they will pass.
                        // We do NOT strictly check if the type is listed in the taxonomy for *that specific* subcategory if it's a cross-listed unisex item?
                        // Actually, let's rely on the gender_supported flag as the primary truth for "Visibility" as per request.

                        return pGenders.includes(targetGender as any);
                    } else {
                        // Direct types (Non-Clothing)
                        // @ts-ignore
                        const allowedTypes = categoryConfig.types || [];
                        return allowedTypes.includes(pType);
                    }
                });
                setAvailableProducts(filtered);
            }
            setLoadingProducts(false);
        };

        fetchProducts();
    }, [selectedCategory, selectedSubCategory]);

    // 2. Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('personalization-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('personalization-uploads')
                .getPublicUrl(filePath);

            setUploadedImage(publicUrl);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // 3. Price Calculation
    const calculatePrice = () => {
        if (!selectedProduct) return 0;
        let total = selectedProduct.price;

        const config = selectedProduct.metadata.personalization;

        // Add Print Type Price
        if (printType && config.print_types[printType]) {
            total += config.print_types[printType].price;
        }

        // Add Placement Price
        if (placement && config.placements[placement]) {
            total += config.placements[placement].price;
        }

        return total;
    };

    const finalPrice = calculatePrice();
    const hasSizes = (selectedProduct?.metadata.personalization.sizes?.length || 0) > 0;
    const canAddToCart = selectedProduct && (!hasSizes || size) && placement && printType;

    console.log("DEBUG VALIDATION:", {
        hasSizes,
        size,
        placement,
        printType,
        canAddToCart,
        productSizes: selectedProduct?.metadata.personalization.sizes
    });

    const handleAddToCart = () => {
        if (!canAddToCart) return;

        addToCart({
            ...selectedProduct,
            price: finalPrice, // Override base price with calculated price
            metadata: {
                is_custom: true,
                size,
                placement,
                print_type: printType,
                image_url: uploadedImage,
                note
            }
        }, size);

        toast.success("Added to cart!");
        // Reset or redirect? For now, we keep them there to maybe add another.
    };

    // Derived Lists
    // @ts-ignore
    const subCategories = selectedCategory ? (PERSONALIZATION_TAXONOMY[selectedCategory]?.subcategories || []) : [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full bg-white rounded-3xl shadow-xl overflow-hidden min-h-[800px] flex flex-col md:flex-row">

                {/* ------------------------------------------------------------- */}
                {/* LEFT: VISUALIZER (Only if product selected) or WELCOME GRAPHIC */}
                {/* ------------------------------------------------------------- */}
                <div className="w-full md:w-1/2 bg-gray-100 relative flex items-center justify-center p-8">
                    {selectedProduct ? (
                        <div className="relative w-full max-w-md aspect-[4/5] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group">
                            <Image
                                src={selectedProduct.images[0]}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {uploadedImage && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-1/2 aspect-square relative opacity-90 mix-blend-multiply border-2 border-dashed border-blue-400 bg-blue-50/20">
                                        {/* Simple overlay simulation */}
                                        <Image src={uploadedImage} alt="Print Preview" fill className="object-contain p-2" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                                <ShieldCheck size={40} className="opacity-20" />
                            </div>
                            <p className="font-bold text-lg">Select a product to start designing</p>
                        </div>
                    )}
                </div>


                {/* ------------------------------------------------------------- */}
                {/* RIGHT: CONTROLS */}
                {/* ------------------------------------------------------------- */}
                <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto max-h-[100vh]">
                    <h1 className="text-3xl font-black text-navy-900 mb-2">Personalize Your Gear</h1>
                    <p className="text-gray-500 mb-8">Choose a product, upload your art, and we'll handle the rest.</p>

                    {/* 1. SELECTION DROPDOWNS */}
                    <div className="space-y-6 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-navy-900 font-bold"
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setSelectedCategory(e.target.value);
                                            setSelectedSubCategory('');
                                            setSelectedProduct(null);
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        {Object.keys(PERSONALIZATION_TAXONOMY).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            {subCategories.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Collection</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-navy-900 font-bold"
                                            value={selectedSubCategory}
                                            onChange={(e) => {
                                                setSelectedSubCategory(e.target.value);
                                                setSelectedProduct(null); // Reset product on subcat change
                                            }}
                                        >
                                            <option value="">Select Collection</option>
                                            {subCategories.map((sub: string) => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PRODUCT SELECTOR */}
                        {(selectedCategory && (!subCategories.length || selectedSubCategory)) && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Select Product</label>
                                {loadingProducts ? (
                                    <div className="flex items-center gap-2 text-gray-400 py-2"><Loader2 className="animate-spin" size={16} /> Loading products...</div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-navy-900 font-bold"
                                            value={selectedProduct?.id || ''}
                                            onChange={(e) => {
                                                const prod = availableProducts.find(p => p.id === e.target.value);
                                                setSelectedProduct(prod || null);
                                                // Reset configs
                                                setSize('');
                                                setPlacement('');
                                                setPrintType('');
                                                setUploadedImage(null);
                                            }}
                                        >
                                            <option value="">Choose a Base Product...</option>
                                            {availableProducts.map(product => (
                                                <option key={product.id} value={product.id}>{product.name} - ₹{product.price}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. CUSTOMIZATION FORM */}
                    {selectedProduct && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="h-px bg-gray-100" />

                            <h2 className="text-xl font-black text-navy-900">Customize It</h2>

                            {/* SIZE */}
                            {selectedProduct.metadata.personalization.sizes?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProduct.metadata.personalization.sizes.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(s)}
                                                className={`px-4 py-2 rounded-lg border font-bold text-sm transition-all ${size === s
                                                    ? 'bg-navy-900 text-white border-navy-900 shadow-md transform scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* PRINT PLACEMENT */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Placement</label>
                                    <div className="space-y-2">
                                        {Object.entries(selectedProduct.metadata.personalization.placements)
                                            .filter(([_, conf]) => conf.enabled)
                                            .map(([key, conf]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setPlacement(key)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${placement === key
                                                        ? 'border-navy-900 bg-navy-50 text-navy-900 font-bold ring-1 ring-navy-900'
                                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span>{key}</span>
                                                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">+₹{conf.price}</span>
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                {/* PRINT TYPE */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Print Type</label>
                                    <div className="space-y-2">
                                        {Object.entries(selectedProduct.metadata.personalization.print_types)
                                            .filter(([_, conf]) => conf.enabled)
                                            .map(([key, conf]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setPrintType(key)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${printType === key
                                                        ? 'border-navy-900 bg-navy-50 text-navy-900 font-bold ring-1 ring-navy-900'
                                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span>{key}</span>
                                                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">+₹{conf.price}</span>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* UPLOAD */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">Upload Design</label>
                                <div className={`border-2 border-dashed rounded-xl p-6 transition-all text-center ${uploadedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-navy-900 hover:bg-gray-50'}`}>
                                    {uploadedImage ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-200 text-green-700 rounded-lg flex items-center justify-center">
                                                    <Check size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-green-800 text-sm">Image uploaded successfully</p>
                                                    <p className="text-xs text-green-600">Ready for print</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setUploadedImage(null)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-red-500">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="animate-spin text-navy-900" />
                                                    <span className="text-sm font-bold text-gray-500">Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto text-gray-400 mb-2" />
                                                    <span className="block text-sm font-bold text-navy-900">Click to Upload Image</span>
                                                    <span className="block text-xs text-gray-400 mt-1">PNG, JPG (Max 10MB)</span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* NOTE */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">Special Instructions (Optional)</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-navy-900 text-sm"
                                    rows={3}
                                    placeholder="Any specific requirements for printing..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            {/* PRICE & ACTION */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 font-medium">Total Price</span>
                                    <span className="text-3xl font-black text-navy-900">₹{finalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!canAddToCart}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${canAddToCart
                                        ? 'bg-navy-900 text-white hover:bg-navy-800 hover:scale-[1.02]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingBag size={20} />
                                    Add to Bag
                                </button>
                                {!canAddToCart && (
                                    <p className="text-center text-xs text-red-400 mt-3 font-medium flex items-center justify-center gap-1">
                                        <Info size={12} /> Please complete all selections
                                    </p>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
