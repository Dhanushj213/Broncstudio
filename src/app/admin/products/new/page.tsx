'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Upload, Save, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
}

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        category_id: '',
        images: [] as string[],
        is_featured: false,
        tags: '',

        // Dynamic Fields
        stock_status: 'in_stock',
        colors: [] as { name: string; code: string }[],
        sizes: '',
        highlights: '',
        material_care: '',
        shipping_returns: '',
        size_guide: '',

        // Recommendation Engine Meta
        is_pet: false,
        gender: 'unisex',
        gender_visibility: ['unisex'] as string[],
        product_type: '',
        fit: 'regular',
        style: 'minimal',
        primary_color: '',

        // Personalization Config
        personalization: {
            enabled: false,
            colors: [] as string[],
            sizes: [] as string[],
            placements: [] as string[],
            print_type: 'DTG',
            print_price: 199,
            image_requirements: {
                min_dpi: 300,
                max_size_mb: 20
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.name || !formData.price || !formData.category_id) {
            alert('Please fill in all required fields');
            setLoading(false);
            return;
        }

        // Duplicate Check
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('name', formData.name.trim())
            .single();

        if (existing) {
            alert('A product with this name already exists! Please use a different name.');
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

                // Metadata
                metadata: {
                    is_pet: formData.is_pet,
                    gender: formData.is_pet ? 'unisex' : formData.gender,
                    gender_visibility: formData.gender_visibility,
                    product_type: formData.product_type,
                    fit: formData.fit,
                    style: formData.style,
                    primary_color: formData.primary_color,
                    personalization: formData.personalization
                }
            });

        if (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        } else {
            router.push('/admin/products');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-6">
                <Link href="/admin/products" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4">
                    <ArrowLeft size={18} /> Back to Products
                </Link>
                <h1 className="text-2xl font-bold text-navy-900">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">General Information</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="e.g. Vintage Leather Jacket"
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

                {/* Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Pricing</h2>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Organization</h2>

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

                        {/* Gender Visibility */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Gender Visibility</label>
                            <div className="flex gap-4 flex-wrap">
                                {['men', 'women', 'unisex', 'kids'].map(g => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.gender_visibility?.includes(g)}
                                            onChange={(e) => {
                                                const current = formData.gender_visibility || [];
                                                const updated = e.target.checked
                                                    ? [...current, g]
                                                    : current.filter(x => x !== g);
                                                setFormData({ ...formData, gender_visibility: updated });
                                            }}
                                            className="rounded border-gray-300 text-navy-900"
                                        />
                                        <span className="capitalize">{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Product Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Type</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="e.g. Classic T-Shirt"
                                value={formData.product_type}
                                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                            />
                        </div>

                    </div>
                </div>

                {/* Personalization Configuration (New Panel) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900">Personalization Configuration 🎨</h2>
                        <label className="flex items-center gap-2 cursor-pointer bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.personalization.enabled}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    personalization: { ...formData.personalization, enabled: e.target.checked }
                                })}
                                className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                            />
                            <span className="text-sm font-bold text-navy-900">Enable Personalization</span>
                        </label>
                    </div>

                    {formData.personalization.enabled && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                            {/* Config Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Print Type & Price */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Print Type</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                            value={formData.personalization.print_type}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                personalization: { ...formData.personalization, print_type: e.target.value }
                                            })}
                                        >
                                            <option value="DTG">DTG Printing</option>
                                            <option value="Embroidery">Embroidery</option>
                                            <option value="Sublimation">Sublimation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Print Price (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                            value={formData.personalization.print_price}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                personalization: { ...formData.personalization, print_price: Number(e.target.value) }
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Placements */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Allowed Placements</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve'].map(placement => (
                                            <label key={placement} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.personalization.placements.includes(placement)}
                                                    onChange={(e) => {
                                                        const current = formData.personalization.placements;
                                                        const updated = e.target.checked
                                                            ? [...current, placement]
                                                            : current.filter(p => p !== placement);
                                                        setFormData({
                                                            ...formData,
                                                            personalization: { ...formData.personalization, placements: updated }
                                                        });
                                                    }}
                                                    className="rounded border-gray-300 text-navy-900"
                                                />
                                                <span className="text-sm">{placement}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Helper Text */}
                            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500">
                                <p className="font-bold mb-1">💡 Admin Note:</p>
                                <p>Only enabled options will be visible to the customer. Ensure you have selected at least one placement and configured pricing.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Media */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Media</h2>
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
                        <p className="text-xs text-gray-400 mt-1">Paste a direct link to an image.</p>
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

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link href="/admin/products">
                        <button type="button" className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}
