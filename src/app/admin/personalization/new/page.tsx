'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronUp, Check, AlertTriangle, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PERSONALIZATION_TAXONOMY, SUPPORTED_GENDERS, Gender, PrintTypeConfig, PlacementConfig } from '@/lib/personalization';

const PREDEFINED_COLORS = ['White', 'Black', 'Navy', 'Olive', 'Grey', 'Red', 'Blue', 'Yellow', 'Pink', 'Beige', 'Maroon'];
const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Standard'];
const PLACEMENTS = ['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve', 'Wrap Around'];
const PRINT_TYPES = ['DTG Printing', 'Embroidery'];



export default function AddPersonalizationProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Collapsible Sections State
    const [sections, setSections] = useState({
        identity: true,
        customization: true,
        printing: true,
        pricing: true
    });

    useEffect(() => {
        const fetchResources = async () => {
            // Fetch Categories
            const { data: cats } = await supabase.from('categories').select('id, name');
            if (cats) {
                setCategories(cats);
                if (cats.length > 0) setFormData(prev => ({ ...prev, category_id: cats[0].id }));
            }
        };
        fetchResources();
    }, []);

    const toggleSection = (key: keyof typeof sections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    const [formData, setFormData] = useState({
        name: '', // Internal Admin Name

        // Taxonomy Selections
        category_group: 'Clothing', // Top Level (Clothing, Accessories...)
        subcategory_group: 'Men', // Secondary (Men, Women.. for Clothing only)
        product_type: 'Classic Crew T-Shirt', // Specific Base Type

        description: '', // Optional
        price: '', // Base Price
        category_id: '', // Database Category ID (Still needed for legacy/schema reasons)

        images: [] as string[],

        // Customization Rules
        personalization: {
            enabled: true,
            colors: [] as string[],
            sizes: [] as string[],
            print_types: {} as Record<string, PrintTypeConfig>,
            placements: {} as Record<string, PlacementConfig>,

            // New Gender Logic
            gender_supported: [] as Gender[],

            image_requirements: {
                min_dpi: 300,
                max_size_mb: 20,
                allowed_formats: ['png', 'jpg', 'pdf']
            }
        }
    });

    const [imageInput, setImageInput] = useState('');
    const [customColor, setCustomColor] = useState(''); // New State for Custom Color
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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

        // Insert
        const { error } = await supabase.from('products').insert({
            name: name, // Internal Name
            description: formData.description,
            price: parseFloat(price),
            category_id: formData.category_id || categories[0]?.id || 'd00d00d0-00d0-00d0-00d0-000000000000', // Use selected or fallback to first valid
            images: images.length > 0 ? images : ['https://placehold.co/600x600/png?text=Base'],
            metadata: {
                type: 'personalization_base',
                product_type: product_type,
                gender_supported: personalization.gender_supported,
                personalization: personalization
            }
        });

        if (error) {
            console.error(error);
            alert('Failed to create base product: ' + error.message);
        } else {
            router.push('/admin/personalization');
            router.refresh();
        }
        setLoading(false);
    };

    const isApparel = ['T-Shirt', 'Hoodie', 'Sweatshirt'].includes(formData.product_type);

    return (
        <div className="max-w-4xl mx-auto pb-32">
            {/* Header */}
            <div className="mb-8 pt-4">
                <Link href="/admin/personalization" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4 text-sm font-bold">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-navy-900 tracking-tight">New Base Product</h1>
                        <p className="text-gray-500 mt-1">Define a blank printable surface and its rules.</p>
                    </div>
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
                                {/* CATEGORY GROUP (Top Level) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Group *</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                        value={formData.category_group}
                                        onChange={(e) => {
                                            const newGroup = e.target.value;
                                            const tax = PERSONALIZATION_TAXONOMY as any;
                                            const firstSub = tax[newGroup]?.subcategories?.[0] || '';
                                            const types = tax[newGroup]?.types;
                                            const firstType = Array.isArray(types) ? types[0] : (types?.[firstSub]?.[0] || '');

                                            setFormData({
                                                ...formData,
                                                category_group: newGroup,
                                                subcategory_group: firstSub,
                                                product_type: firstType
                                            });
                                        }}
                                    >
                                        {Object.keys(PERSONALIZATION_TAXONOMY).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>

                                {/* SUBCATEGORY (If Applicable, e.g. Men/Women) */}
                                {/* @ts-ignore */}
                                {(PERSONALIZATION_TAXONOMY[formData.category_group] as any)?.subcategories && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Category *</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                            value={formData.subcategory_group}
                                            onChange={(e) => {
                                                const newSub = e.target.value;
                                                // @ts-ignore
                                                const firstType = PERSONALIZATION_TAXONOMY[formData.category_group].types[newSub]?.[0] || '';
                                                setFormData({ ...formData, subcategory_group: newSub, product_type: firstType });
                                            }}
                                        >
                                            {/* @ts-ignore */}
                                            {(PERSONALIZATION_TAXONOMY[formData.category_group] as any).subcategories.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* BASE PRODUCT TYPE (Specific) */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Base Product Type *</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                        value={formData.product_type}
                                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                                    >
                                        {(() => {
                                            const group = PERSONALIZATION_TAXONOMY[formData.category_group as keyof typeof PERSONALIZATION_TAXONOMY] as any;
                                            let types: string[] = [];
                                            if (group.subcategories) {
                                                // @ts-ignore
                                                types = group.types[formData.subcategory_group] || [];
                                            } else {
                                                // @ts-ignore
                                                types = group.types || [];
                                            }
                                            return types.map(t => <option key={t} value={t}>{t}</option>);
                                        })()}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1.5">Determines available size options and placement defaults.</p>
                                </div>

                                {/* GENDER SUPPORTED (Multi-Select) */}
                                <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <label className="block text-sm font-bold text-navy-900 mb-2">Supported Genders (Visibility) *</label>
                                    <p className="text-xs text-gray-500 mb-3">Select where this product should appear in the shop. (e.g. Unisex appears in Men & Women)</p>
                                    <div className="flex gap-4">
                                        {SUPPORTED_GENDERS.map(g => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                                    checked={formData.personalization.gender_supported.includes(g)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setFormData(prev => {
                                                            const current = prev.personalization.gender_supported;
                                                            return {
                                                                ...prev,
                                                                personalization: {
                                                                    ...prev.personalization,
                                                                    gender_supported: checked
                                                                        ? [...current, g]
                                                                        : current.filter(x => x !== g)
                                                                }
                                                            };
                                                        });
                                                    }}
                                                />
                                                <span className="capitalize font-bold text-gray-700">{g}</span>
                                            </label>
                                        ))}
                                    </div>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PRINT_TYPES.map(type => {
                                        const config = formData.personalization.print_types[type] || { enabled: false, price: 50 };

                                        return (
                                            <div key={type} className={`rounded-xl border transition-all ${config.enabled ? 'bg-white border-amber-200 shadow-sm ring-1 ring-amber-100' : 'bg-gray-50 border-gray-100 opacity-70 hover:opacity-100'}`}>
                                                <div className="p-4 flex items-center justify-between">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                                            checked={config.enabled}
                                                            onChange={(e) => {
                                                                const isEnabled = e.target.checked;
                                                                if (!isEnabled) {
                                                                    const newTypes = { ...formData.personalization.print_types };
                                                                    delete newTypes[type];
                                                                    setFormData({
                                                                        ...formData,
                                                                        personalization: { ...formData.personalization, print_types: newTypes }
                                                                    });
                                                                } else {
                                                                    setFormData({
                                                                        ...formData,
                                                                        personalization: {
                                                                            ...formData.personalization,
                                                                            print_types: {
                                                                                ...formData.personalization.print_types,
                                                                                [type]: { enabled: true, price: config.price }
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <span className={`font-bold ${config.enabled ? 'text-gray-900' : 'text-gray-500'}`}>{type}</span>
                                                    </label>
                                                </div>

                                                {config.enabled && (
                                                    <div className="p-4 pt-0 border-t border-amber-50 mt-1">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Surcharge (Per Print)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                                            <input
                                                                type="number"
                                                                className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900 bg-amber-50/30 border-amber-100 focus:outline-none focus:border-amber-300"
                                                                value={config.price}
                                                                onChange={(e) => setFormData({
                                                                    ...formData,
                                                                    personalization: {
                                                                        ...formData.personalization,
                                                                        print_types: {
                                                                            ...formData.personalization.print_types,
                                                                            [type]: { ...config, price: parseFloat(e.target.value) || 0 }
                                                                        }
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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
                                        const config = formData.personalization.placements[placement]; // may be undefined
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
                                                                value={isNaN(config.max_width) ? '' : config.max_width}
                                                                onChange={(e) => updatePlacement(placement, 'max_width', parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Height (in)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900"
                                                                value={isNaN(config.max_height) ? '' : config.max_height}
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
                                                                    value={isNaN(config.price) ? '' : config.price}
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

                            {/* Global Limits */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-amber-500" />
                                    Global Image Rules
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Min DPI: <strong>300</strong> (Hard validation)</li>
                                    <li>Allowed Specs: <strong>PNG, JPG, PDF</strong> (Max 20MB)</li>
                                </ul>
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
                        Save Base Product
                    </button>
                </div>
            </form>
        </div>
    );
}
