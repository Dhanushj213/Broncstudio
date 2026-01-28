'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronUp, AlertTriangle, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BASE_PRODUCT_TYPES = [
    'T-Shirt', 'Hoodie', 'Sweatshirt', 'Mug', 'Bottle', 'Cap', 'Tote Bag', 'Phone Case', 'Mouse Pad', 'Other'
];

const PREDEFINED_COLORS = ['White', 'Black', 'Navy', 'Olive', 'Grey', 'Red', 'Blue', 'Yellow', 'Pink', 'Beige', 'Maroon'];
const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Standard'];
const PLACEMENTS = ['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve', 'Wrap Around'];
const PRINT_TYPES = ['DTG', 'Embroidery', 'Sublimation', 'UV Print'];

interface PlacementConfig {
    enabled: boolean;
    price: number;
    max_width: number;
    max_height: number;
}

export default function EditPersonalizationProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Collapsible Sections State
    const [sections, setSections] = useState({
        identity: true,
        customization: true,
        printing: true,
        pricing: true
    });

    const toggleSection = (key: keyof typeof sections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    const [formData, setFormData] = useState({
        name: '', // Internal Admin Name
        product_type: 'T-Shirt',
        description: '', // Optional
        price: '', // Base Price

        images: [] as string[],

        // Customization Rules
        personalization: {
            enabled: true,
            colors: [] as string[],
            sizes: [] as string[],
            print_types: [] as string[],

            // Rich Placement Config
            placements: {} as Record<string, PlacementConfig>,

            image_requirements: {
                min_dpi: 300,
                max_size_mb: 20,
                allowed_formats: ['png', 'jpg', 'pdf']
            }
        }
    });

    const [imageInput, setImageInput] = useState('');
    const [customColor, setCustomColor] = useState(''); // New State
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (id) fetchProduct(id);
    }, [id]);

    const fetchProduct = async (productId: string) => {
        setFetching(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error || !data) {
            alert('Error loading product');
            router.push('/admin/personalization');
            return;
        }

        const meta = data.metadata || {};
        const pConfig = meta.personalization || {};

        // Migrate old simple placements array to new object structure if needed
        let placements = pConfig.placements || {};
        if (Array.isArray(placements)) {
            const newPlacements: Record<string, PlacementConfig> = {};
            placements.forEach((p: string) => {
                newPlacements[p] = { enabled: true, price: pConfig.print_prices?.[p] || 199, max_width: 10, max_height: 10 };
            });
            placements = newPlacements;
        }

        setFormData({
            name: data.name,
            product_type: meta.product_type || 'T-Shirt',
            description: data.description || '',
            price: data.price.toString(),
            images: data.images || [],
            personalization: {
                enabled: true,
                colors: pConfig.colors || [],
                sizes: pConfig.sizes || [],
                print_types: pConfig.print_types || [],
                placements: placements,
                image_requirements: pConfig.image_requirements || { min_dpi: 300, max_size_mb: 20, allowed_formats: ['png', 'jpg', 'pdf'] }
            }
        });
        setFetching(false);
    };

    // Helpers
    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
    };

    const updatePlacement = (placement: string, field: keyof PlacementConfig, value: any) => {
        const current = formData.personalization.placements[placement] || { enabled: false, price: 199, max_width: 10, max_height: 10 };

        if (field === 'enabled' && value === false) {
            // Remove if disabled
            const newPlacements = { ...formData.personalization.placements };
            delete newPlacements[placement];
            setFormData({
                ...formData,
                personalization: { ...formData.personalization, placements: newPlacements }
            });
            return;
        }

        const updated = { ...current, [field]: value, enabled: true };
        setFormData({
            ...formData,
            personalization: {
                ...formData.personalization,
                placements: { ...formData.personalization.placements, [placement]: updated }
            }
        });
    };

    const handleAddImage = () => {
        if (!imageInput.trim()) return;
        setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
        setImageInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { name, price, product_type, personalization, images } = formData;

        if (!name || !price) {
            alert('Please complete Section 1 & 4 (Name & Price).');
            setLoading(false);
            return;
        }

        if (personalization.colors.length === 0) {
            alert('Please select at least one color in Section 2.');
            setLoading(false);
            return;
        }

        if (Object.keys(personalization.placements).length === 0) {
            alert('Please enable at least one print placement in Section 3.');
            setLoading(false);
            return;
        }

        // Update
        const { error } = await supabase.from('products').update({
            name: name,
            description: formData.description,
            price: parseFloat(price),
            images: images,
            metadata: {
                type: 'personalization_base',
                product_type: product_type,
                gender_supported: [],
                personalization: personalization
            }
        }).eq('id', id);

        if (error) {
            console.error(error);
            alert('Failed to update base product: ' + error.message);
        } else {
            router.push('/admin/personalization');
            router.refresh();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This will remove the base product forever.")) return;
        setLoading(true);
        await supabase.from('products').delete().eq('id', id);
        router.push('/admin/personalization');
        router.refresh();
    };

    const isApparel = ['T-Shirt', 'Hoodie', 'Sweatshirt'].includes(formData.product_type);

    if (fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-navy-900" /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-32">
            {/* Header */}
            <div className="mb-8 pt-4">
                <Link href="/admin/personalization" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4 text-sm font-bold">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Edit Base Product</h1>
                        <p className="text-gray-500 mt-1">Update configuration rules.</p>
                    </div>
                    <button onClick={handleDelete} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                        Delete Product
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECTION 1: IDENTITY */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button type="button" onClick={() => toggleSection('identity')} className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-lg font-bold text-gray-900">Base Product Identity</h2>
                        </div>
                        {sections.identity ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {sections.identity && (
                        <div className="p-6 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Base Product Type *</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                        value={formData.product_type}
                                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                                    >
                                        {BASE_PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1.5">Determines available size options and placement defaults.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Internal Name *</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                        placeholder="e.g. Plain Classic Crew T-Shirt (Base)"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">Used internally to identify this blank stock.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                    rows={3}
                                    placeholder="Details about material, fit, etc."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION 2: CUSTOMIZATION */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button type="button" onClick={() => toggleSection('customization')} className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-lg font-bold text-gray-900">Customization Rules</h2>
                        </div>
                        {sections.customization ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {sections.customization && (
                        <div className="p-6 border-t border-gray-100 space-y-8 animate-in slide-in-from-top-2">

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    Available Colors <span className="text-red-500">*</span>
                                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Select at least one</span>
                                </h3>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {PREDEFINED_COLORS.map(color => {
                                        const isSelected = formData.personalization.colors.includes(color);
                                        return (
                                            <label key={color} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${isSelected ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => setFormData({
                                                        ...formData,
                                                        personalization: {
                                                            ...formData.personalization,
                                                            colors: toggleArrayItem(formData.personalization.colors, color)
                                                        }
                                                    })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border border-black/10`} style={{ backgroundColor: color.toLowerCase() }} />
                                                <span className="font-bold text-sm">{color}</span>
                                            </label>
                                        );
                                    })}
                                    {/* Selected Custom Colors */}
                                    {formData.personalization.colors.filter(c => !PREDEFINED_COLORS.includes(c)).map(color => (
                                        <label key={color} className="cursor-pointer px-4 py-2 rounded-lg border bg-navy-900 text-white border-navy-900 transition-all flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={true}
                                                onChange={() => setFormData({
                                                    ...formData,
                                                    personalization: {
                                                        ...formData.personalization,
                                                        colors: formData.personalization.colors.filter(c => c !== color)
                                                    }
                                                })}
                                            />
                                            <div className="w-3 h-3 rounded-full border border-white/20 bg-white" />
                                            <span className="font-bold text-sm">{color}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Add Custom Color Input */}
                                <div className="flex items-center gap-2 max-w-sm">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 text-sm"
                                        placeholder="Add Custom Color (e.g. Teal)"
                                        value={customColor}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (customColor.trim()) {
                                                    setFormData({
                                                        ...formData,
                                                        personalization: {
                                                            ...formData.personalization,
                                                            colors: [...formData.personalization.colors, customColor.trim()]
                                                        }
                                                    });
                                                    setCustomColor('');
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (customColor.trim()) {
                                                setFormData({
                                                    ...formData,
                                                    personalization: {
                                                        ...formData.personalization,
                                                        colors: [...formData.personalization.colors, customColor.trim()]
                                                    }
                                                });
                                                setCustomColor('');
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-100 font-bold text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Sizes (Conditional) */}
                            {isApparel && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Available Sizes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {PREDEFINED_SIZES.map(size => {
                                            const isSelected = formData.personalization.sizes.includes(size);
                                            return (
                                                <label key={size} className={`cursor-pointer px-3 h-10 flex items-center justify-center rounded-lg border transition-all text-sm font-bold min-w-[3rem] ${isSelected ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => setFormData({
                                                            ...formData,
                                                            personalization: {
                                                                ...formData.personalization,
                                                                sizes: toggleArrayItem(formData.personalization.sizes, size)
                                                            }
                                                        })}
                                                    />
                                                    {size}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Sizes shown to customer on personalization page.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SECTION 3: PRINTING RULES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button type="button" onClick={() => toggleSection('printing')} className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">3</div>
                            <h2 className="text-lg font-bold text-gray-900">Printing Rules</h2>
                        </div>
                        {sections.printing ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {sections.printing && (
                        <div className="p-6 border-t border-gray-100 space-y-8 animate-in slide-in-from-top-2">

                            {/* Print Methods */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Supported Print Methods</h3>
                                <div className="flex flex-wrap gap-4">
                                    {PRINT_TYPES.map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                                checked={formData.personalization.print_types.includes(type)}
                                                onChange={() => setFormData({
                                                    ...formData,
                                                    personalization: {
                                                        ...formData.personalization,
                                                        print_types: toggleArrayItem(formData.personalization.print_types, type)
                                                    }
                                                })}
                                            />
                                            <span className="text-gray-700 font-medium">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Placements */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                                    Placements & Dimensions
                                    <span className="text-xs font-normal text-gray-400">Configure enabled areas</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PLACEMENTS.map(placement => {
                                        const config = formData.personalization.placements[placement];
                                        const isEnabled = !!config && config.enabled;

                                        return (
                                            <div key={placement} className={`rounded-xl border transition-all ${isEnabled ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100' : 'bg-gray-50 border-gray-100 opacity-70 hover:opacity-100'}`}>

                                                {/* Header / Toggle */}
                                                <div className="p-4 flex items-center justify-between">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                                            checked={isEnabled}
                                                            onChange={(e) => updatePlacement(placement, 'enabled', e.target.checked)}
                                                        />
                                                        <span className={`font-bold ${isEnabled ? 'text-navy-900' : 'text-gray-500'}`}>{placement}</span>
                                                    </label>
                                                    {isEnabled && (
                                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                                                    )}
                                                </div>

                                                {/* Details (Expanded) */}
                                                {isEnabled && (
                                                    <div className="p-4 pt-0 grid grid-cols-2 gap-3 border-t border-blue-50 mt-2">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Width (in)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900"
                                                                value={config.max_width}
                                                                onChange={(e) => updatePlacement(placement, 'max_width', parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Height (in)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900"
                                                                value={config.max_height}
                                                                onChange={(e) => updatePlacement(placement, 'max_height', parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Print Price (₹)</label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900 bg-green-50/30 border-green-100"
                                                                    value={config.price}
                                                                    onChange={(e) => updatePlacement(placement, 'price', parseFloat(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION 4: PRICING & ASSETS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button type="button" onClick={() => toggleSection('pricing')} className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">4</div>
                            <h2 className="text-lg font-bold text-gray-900">Pricing & Assets</h2>
                        </div>
                        {sections.pricing ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {sections.pricing && (
                        <div className="p-6 border-t border-gray-100 space-y-8 animate-in slide-in-from-top-2">

                            {/* Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Base Product Cost (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 outline-none font-bold text-lg text-navy-900"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">Cost of the blank item alone.</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                                    <p className="font-bold text-navy-900 mb-1">Customer Pricing Model:</p>
                                    <p className="text-gray-600">Base Cost + (Placement Price × Count) + 18% GST</p>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Base Product Images</label>
                                <p className="text-xs text-gray-400 mb-3">Upload clean blank product images (no designs). First image is default.</p>

                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                        placeholder="https://... (Paste Image URL)"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddImage}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                {formData.images.length > 0 ? (
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-2">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                <Image src={img} alt="" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...formData.images];
                                                        newImages.splice(idx, 1);
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                {idx === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded font-bold">MAIN</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <span className="text-sm">No images added</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="sticky bottom-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-4 px-12 rounded-full shadow-xl shadow-navy-900/20 transition-all hover:scale-105 disabled:opacity-70 flex items-center gap-3"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
