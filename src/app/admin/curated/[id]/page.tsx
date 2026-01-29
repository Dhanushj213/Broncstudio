'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCuratedPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        category_slugs: '',
        price_max: '',
        display_order: 0,
        is_active: true
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('curated_sections')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                alert('Not found');
                router.push('/admin/curated');
                return;
            }

            setFormData({
                title: data.title,
                description: data.description || '',
                image_url: data.image_url,
                category_slugs: (data.category_slugs || []).join(', '),
                price_max: data.price_max ? data.price_max.toString() : '',
                display_order: data.display_order || 0,
                is_active: data.is_active
            });
            setFetching(false);
        };
        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category_slugs: formData.category_slugs.split(',').map(s => s.trim()).filter(Boolean),
            price_max: formData.price_max ? parseFloat(formData.price_max) : null,
            display_order: Number(formData.display_order),
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('curated_sections').update(payload).eq('id', id);

        if (error) {
            console.error('Error updating:', error);
            alert('Failed to update: ' + error.message);
        } else {
            router.push('/admin/curated');
            router.refresh();
        }
        setLoading(false);
    };

    if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <Link href="/admin/curated" className="text-gray-500 hover:text-navy-900 flex items-center gap-2 mb-6">
                <ArrowLeft size={18} /> Back to List
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-start mb-8">
                    <h1 className="text-2xl font-bold text-navy-900">Edit Collection</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image URL *</label>
                        <input
                            type="url"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
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
                                value={formData.price_max}
                                onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                />
                                <span className="font-bold text-navy-900">Active</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Target Slugs</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            rows={3}
                            value={formData.category_slugs}
                            onChange={(e) => setFormData({ ...formData, category_slugs: e.target.value })}
                        />
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
