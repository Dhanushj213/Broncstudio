'use client';

import React, { useEffect, useState, use } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SpecialCollection } from '@/types/shop';

export default function EditSpecialCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const isNew = resolvedParams.id === 'new';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<SpecialCollection>>({
        name: '',
        slug: '',
        description: '',
        banner_image: '',
        thumbnail_image: '',
        is_active: false,
        sort_order: 0,
        seo_title: '',
        seo_description: ''
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (!isNew) {
            fetchCollection();
        }
    }, [isNew, resolvedParams.id]);

    const fetchCollection = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('special_collections')
            .select('*')
            .eq('id', resolvedParams.id)
            .single();

        if (!error && data) {
            setFormData(data);
        } else {
            alert('Collection not found');
            router.push('/admin/special-collections');
        }
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-generate slug from name if not manually edited yet (only for new)
            if (isNew && name === 'name' && !formData.slug) {
                setFormData(prev => ({
                    ...prev,
                    slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (isNew) {
                const { error } = await supabase
                    .from('special_collections')
                    .insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('special_collections')
                    .update(formData)
                    .eq('id', resolvedParams.id);
                if (error) throw error;
            }
            router.push('/admin/special-collections');
        } catch (error: any) {
            console.error('Save error:', error);
            alert(`Failed to save: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/special-collections"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Collections
                </Link>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-navy-900">
                    {isNew ? 'Create Special Collection' : 'Edit Special Collection'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h2 className="text-xl font-bold text-navy-900 border-b border-gray-100 pb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                                placeholder="e.g. Summer Co-ords"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Slug (/special/&lt;slug&gt;)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all font-mono"
                                placeholder="summer-coords"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                            placeholder="Describe this special collection..."
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h2 className="text-xl font-bold text-navy-900 border-b border-gray-100 pb-4">Media (Google Drive IDs or URLs)</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Banner Image</label>
                            <input
                                type="text"
                                name="banner_image"
                                value={formData.banner_image || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                                placeholder="Used on the specific collection page hero header"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Thumbnail Image</label>
                            <input
                                type="text"
                                name="thumbnail_image"
                                value={formData.thumbnail_image || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                                placeholder="Used in grids and carousels representing this collection"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h2 className="text-xl font-bold text-navy-900 border-b border-gray-100 pb-4">SEO & Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">SEO Title</label>
                            <input
                                type="text"
                                name="seo_title"
                                value={formData.seo_title || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Sort Order</label>
                            <input
                                type="number"
                                name="sort_order"
                                value={formData.sort_order || 0}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">SEO Description</label>
                        <textarea
                            name="seo_description"
                            value={formData.seo_description || ''}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active || false}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 text-coral-500 focus:ring-coral-500"
                        />
                        <label htmlFor="is_active" className="font-bold text-navy-900 cursor-pointer">
                            Collection is Active (Visible on public site)
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 bg-navy-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-navy-800 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                        {isSaving ? 'Saving...' : 'Save Collection'}
                    </button>
                </div>
            </form>
        </div>
    );
}
