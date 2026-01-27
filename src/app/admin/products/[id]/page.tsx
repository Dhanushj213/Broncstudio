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
        category_id: '',
        image_url: ''
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

        setFormData({
            name: data.name,
            description: data.description || '',
            price: data.price.toString(),
            category_id: data.category_id,
            image_url: data.image_url || ''
        });
        setFetching(false);
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

        const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                image_url: formData.image_url || 'https://placehold.co/600x400/png'
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
        setLoading(true); // show loading state

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
        <div className="max-w-3xl mx-auto pb-20">
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

                {/* Pricing & Category */}
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
                    </div>
                </div>

                {/* Media (URL only for now) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Media</h2>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="https://..."
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Paste a direct link to an image.</p>
                    </div>

                    {formData.image_url && (
                        <div className="mt-4 w-40 h-40 relative rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                src={formData.image_url}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
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
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
