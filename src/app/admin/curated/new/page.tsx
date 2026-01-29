'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewCuratedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        category_slugs: '', // Comma separated
        price_max: '',
        display_order: 0,
        is_active: true
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.title || !formData.image_url) {
            alert('Title and Image are required');
            setLoading(false);
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category_slugs: formData.category_slugs.split(',').map(s => s.trim()).filter(Boolean),
            price_max: formData.price_max ? parseFloat(formData.price_max) : null,
            display_order: Number(formData.display_order),
            is_active: formData.is_active
        };

        const { error } = await supabase.from('curated_sections').insert(payload);

        if (error) {
            console.error('Error creating section:', error);
            alert('Failed to create: ' + error.message);
        } else {
            router.push('/admin/curated');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <Link href="/admin/curated" className="text-gray-500 hover:text-navy-900 flex items-center gap-2 mb-6">
                <ArrowLeft size={18} /> Back to List
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-navy-900 mb-8">New Collection</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            placeholder="e.g. Winter Essentials"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            placeholder="Short tagline..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image URL *</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                placeholder="https://..."
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                        {formData.image_url && (
                            <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Max Price Filter</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                placeholder="Optional"
                                value={formData.price_max}
                                onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Target Slugs (Comma separated)</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            placeholder="hoodies, men-shirts, new-arrivals..."
                            rows={3}
                            value={formData.category_slugs}
                            onChange={(e) => setFormData({ ...formData, category_slugs: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Products matching any of these slugs (category or tags) will be shown.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                        <Link href="/admin/curated">
                            <button type="button" className="px-6 py-2 font-bold text-gray-500 hover:bg-gray-50 rounded-lg">Cancel</button>
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-navy-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            Create Collection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
