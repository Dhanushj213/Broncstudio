'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams(); // Get [id] from URL
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        category_id: '',
        image_url: '',
        is_featured: false,

        tags: '',
        // Dynamic Fields
        stock_status: 'in_stock',
        colors: [] as { name: string; code: string }[],
        sizes: '',
        highlights: '',
        material_care: '',
        shipping_returns: '',
        size_guide: ''
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const init = async () => {
            await fetchCategories();
            if (id) await fetchProduct(id);
        };
        init();
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    };

    const fetchProduct = async (productId: string) => {
        setFetching(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error || !data) {
            console.error('Error fetching product:', error);
            alert('Product not found or error loading data.');
            router.push('/admin/products');
            return;
        }

        const meta = data.metadata || {};

        setFormData({
            name: data.name,
            description: data.description || '',
            price: data.price.toString(),
            compare_at_price: data.compare_at_price ? data.compare_at_price.toString() : '',
            category_id: data.category_id,
            image_url: data.images?.[0] || '',
            is_featured: meta.is_featured || false,
            tags: meta.tags?.join(', ') || '',
            // Load Dynamic Fields
            stock_status: meta.stock_status || 'in_stock',
            colors: meta.colors || [],
            sizes: meta.sizes?.join(', ') || '',
            highlights: meta.highlights?.join('\n') || '',
            material_care: meta.material_care || '',
            shipping_returns: meta.shipping_returns || '',
            size_guide: meta.size_guide || ''
        });
        setFetching(false);
    };

    const handleAddColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: 'New Color', code: '#000000' }]
        });
    };

    const handleColorChange = (index: number, field: 'name' | 'code', value: string) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData({ ...formData, colors: newColors });
    };

    const handleRemoveColor = (index: number) => {
        const newColors = [...formData.colors];
        newColors.splice(index, 1);
        setFormData({ ...formData, colors: newColors });
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

        const metadata = {
            is_featured: formData.is_featured,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            // Save Dynamic Fields
            stock_status: formData.stock_status,
            colors: formData.colors,
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            highlights: formData.highlights.split('\n').filter(Boolean),
            material_care: formData.material_care,
            shipping_returns: formData.shipping_returns,
            size_guide: formData.size_guide
        };

        const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                category_id: formData.category_id,
                images: formData.image_url ? [formData.image_url] : [],
                metadata: metadata
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product: ' + error.message);
        } else {
            router.push('/admin/products');
            router.refresh();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
        setLoading(true);

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            console.error('Delete Error:', error);
            alert(`Failed to delete: ${error.message} (Code: ${error.code})`);
            setLoading(false);
        } else {
            router.push('/admin/products');
            router.refresh();
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-navy-900" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/admin/products" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4">
                        <ArrowLeft size={18} /> Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900">Edit Product</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors"
                >
                    <Trash2 size={18} /> Delete Product
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900">General Information</h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                            />
                            <span className="text-sm font-bold text-navy-900">Featured Product</span>
                        </label>
                    </div>

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

                {/* Variants (Colors & Sizes) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Variants</h2>

                    {/* Colors */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-700">Colors</label>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="text-xs bg-navy-50 text-navy-900 px-3 py-1 rounded-full font-bold hover:bg-navy-100"
                            >
                                + Add Color
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.colors.map((color, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                        value={color.code}
                                        onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                                        placeholder="Color Name (e.g. Navy Blue)"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveColor(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {formData.colors.length === 0 && <p className="text-sm text-gray-400 italic">No colors added.</p>}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sizes (Comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="e.g. S, M, L, XL or 2-3Y, 3-4Y"
                            value={formData.sizes}
                            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Product Details</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Highlights (One per line)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors font-mono text-sm"
                            placeholder="100% Cotton&#10;Breathable&#10;Machine Wash"
                            value={formData.highlights}
                            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Material & Care</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="Details about material and care instructions..."
                            value={formData.material_care}
                            onChange={(e) => setFormData({ ...formData, material_care: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Shipping & Returns</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="Shipping policy details..."
                            value={formData.shipping_returns}
                            onChange={(e) => setFormData({ ...formData, shipping_returns: e.target.value })}
                        />
                    </div>
                </div>

                {/* Pricing & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Pricing & Organization</h2>
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
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Compare at Price (₹)</label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="0.00"
                                value={formData.compare_at_price}
                                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                            />
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
                        {/* Status Field */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Availability</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                value={formData.stock_status}
                                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Only Few Left (Low Stock)</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Media & Tags</h2>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="https://..."
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>

                        {formData.image_url && (
                            <div className="w-full h-32 relative rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={formData.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="e.g. new-arrival, summer, curated"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-gray-100 -mx-4 md:mx-0">
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
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
