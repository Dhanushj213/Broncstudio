'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, Trash2, Plus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
}

const PREDEFINED_COLORS = ['White', 'Black', 'Navy', 'Olive', 'Grey', 'Red', 'Blue', 'Yellow', 'Pink'];
const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Standard'];
const PLACEMENTS = ['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve'];
const PRINT_TYPES = ['DTG', 'Embroidery', 'Sublimation'];

export default function AddPersonalizationProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '', // Base Product Price
        category_id: '',
        images: [] as string[],

        // Taxonomy
        gender_supported: [] as string[], // ['men', 'women', 'unisex', 'kids']

        // Personalization Engine Config
        personalization: {
            enabled: true,
            colors: [] as string[],
            sizes: [] as string[],
            print_types: [] as string[],
            placements: [] as string[],
            print_prices: {} as Record<string, number>, // { "Front": 199, "Back": 249 }
            image_requirements: {
                min_dpi: 300,
                max_size_mb: 20,
                allowed_formats: ['png', 'jpg', 'pdf']
            }
        }
    });

    const [imageInput, setImageInput] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    };

    const handleAddImage = () => {
        if (!imageInput.trim()) return;
        setFormData({
            ...formData,
            images: [...formData.images, imageInput.trim()]
        });
        setImageInput('');
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    // Helper to toggle array items
    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item)
            ? array.filter(i => i !== item)
            : [...array, item];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.name || !formData.price || !formData.category_id) {
            alert('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (formData.gender_supported.length === 0) {
            alert('Please select at least one Gender Visibility option.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('products')
            .insert({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                images: formData.images.length > 0 ? formData.images : ['https://placehold.co/600x400/png'],

                // Metadata Schema for Personalization
                metadata: {
                    type: 'personalization_base', // Distinguished type
                    gender_supported: formData.gender_supported, // Master Taxonomy
                    personalization: formData.personalization
                }
            });

        if (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        } else {
            router.push('/admin/personalization');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-6">
                <Link href="/admin/personalization" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4">
                    <ArrowLeft size={18} /> Back to Personalization Bases
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900">Add New Base Product</h1>
                        <p className="text-gray-500 text-sm">Create a customizable base product for the personalization engine.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN - MAIN INFO */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">General Information</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name In Admin *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="e.g. Heavyweight Unisex Hoodie (Base)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="Product description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* PERSONALIZATION CONFIGURATION */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                            🎨 Personalization Configuration
                        </h2>

                        {/* Colors */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 block">1. Available Colors</h3>
                            <div className="flex flex-wrap gap-3">
                                {PREDEFINED_COLORS.map(color => (
                                    <label key={color} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all ${formData.personalization.colors.includes(color)
                                            ? 'bg-navy-900 text-white border-navy-900'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.personalization.colors.includes(color)}
                                            onChange={() => setFormData({
                                                ...formData,
                                                personalization: {
                                                    ...formData.personalization,
                                                    colors: toggleArrayItem(formData.personalization.colors, color)
                                                }
                                            })}
                                        />
                                        {color}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 block">2. Available Sizes</h3>
                            <div className="flex flex-wrap gap-2">
                                {PREDEFINED_SIZES.map(size => (
                                    <label key={size} className={`cursor-pointer w-12 h-10 flex items-center justify-center rounded-lg border transition-all text-sm font-medium ${formData.personalization.sizes.includes(size)
                                            ? 'bg-navy-900 text-white border-navy-900'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.personalization.sizes.includes(size)}
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
                                ))}
                            </div>
                        </div>

                        {/* Print Types */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 block">3. Supported Print Methods</h3>
                            <div className="flex gap-4">
                                {PRINT_TYPES.map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.personalization.print_types.includes(type)}
                                            onChange={() => setFormData({
                                                ...formData,
                                                personalization: {
                                                    ...formData.personalization,
                                                    print_types: toggleArrayItem(formData.personalization.print_types, type)
                                                }
                                            })}
                                            className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                        />
                                        <span className="font-medium text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Placements & Pricing */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 block">4. Placements & Pricing Rules</h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {PLACEMENTS.map(placement => {
                                    const isSelected = formData.personalization.placements.includes(placement);
                                    return (
                                        <div key={placement} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'bg-white border-blue-200 shadow-sm' : 'border-transparent opacity-70'}`}>
                                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        const newPlacements = toggleArrayItem(formData.personalization.placements, placement);
                                                        // Toggle pricing entry cleanly
                                                        const newPrices = { ...formData.personalization.print_prices };
                                                        if (!newPlacements.includes(placement)) {
                                                            delete newPrices[placement];
                                                        } else {
                                                            newPrices[placement] = 199; // Default price
                                                        }

                                                        setFormData({
                                                            ...formData,
                                                            personalization: {
                                                                ...formData.personalization,
                                                                placements: newPlacements,
                                                                print_prices: newPrices
                                                            }
                                                        });
                                                    }}
                                                    className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                                />
                                                <span className={`font-bold ${isSelected ? 'text-navy-900' : 'text-gray-500'}`}>{placement}</span>
                                            </label>

                                            {isSelected && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 font-bold uppercase">Print Cost (₹)</span>
                                                    <input
                                                        type="number"
                                                        value={formData.personalization.print_prices[placement] || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            personalization: {
                                                                ...formData.personalization,
                                                                print_prices: {
                                                                    ...formData.personalization.print_prices,
                                                                    [placement]: parseFloat(e.target.value) || 0
                                                                }
                                                            }
                                                        })}
                                                        className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-right"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Media */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Product Images</h2>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Add Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                    placeholder="https://..."
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddImage();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-4 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image
                                            src={img}
                                            alt={`Image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">MAIN</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - SIDEBAR */}
                <div className="space-y-6">

                    {/* Publishing & Visibility */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Visibility Rule 🚦</h2>
                        <p className="text-xs text-gray-500">
                            Select all genders this product applies to. It will appear in all selected categories automatically.
                        </p>
                        <div className="space-y-3">
                            {['men', 'women', 'unisex', 'kids'].map(g => (
                                <label key={g} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.gender_supported.includes(g)}
                                        onChange={() => setFormData({
                                            ...formData,
                                            gender_supported: toggleArrayItem(formData.gender_supported, g)
                                        })}
                                        className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                    />
                                    <span className="capitalize font-bold text-gray-800">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Organization</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Base Price (₹) *</label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                className="w-full px-4 py-2 border border-blue-200 bg-blue-50/50 rounded-lg focus:outline-none focus:border-navy-900 transition-colors font-bold text-navy-900"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Cost of the blank product (without print).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="sticky top-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-navy-900 text-white hover:bg-navy-800 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-navy-900/20 transition-all disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                            Save Base Product
                        </button>
                    </div>

                </div>

            </form>
        </div>
    );
}
