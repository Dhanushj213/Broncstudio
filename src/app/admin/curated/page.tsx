'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Edit, Trash2, ExternalLink, Loader2, Sparkles, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import GlassCard from '@/components/UI/GlassCard';

interface CuratedSection {
    id: string;
    title: string;
    description: string;
    image_url: string;
    is_active: boolean;
    display_order: number;
}

export default function AdminCuratedPage() {
    const [sections, setSections] = useState<CuratedSection[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('curated_sections')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching sections:', error);
            addToast('Failed to load collections', 'error');
        } else {
            setSections(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        const { error } = await supabase.from('curated_sections').delete().eq('id', id);

        if (error) {
            addToast(`Failed to delete: ${error.message}`, 'error');
        } else {
            setSections(sections.filter(s => s.id !== id));
            addToast('Collection deleted', 'success');
        }
    };

    const handleToggleActive = async (section: CuratedSection) => {
        const { error } = await supabase
            .from('curated_sections')
            .update({ is_active: !section.is_active })
            .eq('id', section.id);

        if (error) {
            addToast('Failed to update status', 'error');
        } else {
            setSections(sections.map(s => s.id === section.id ? { ...s, is_active: !s.is_active } : s));
            addToast(`Collection ${!section.is_active ? 'Activated' : 'Deactivated'}`, 'success');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Curated Collections</h1>
                    <p className="text-gray-500">Manage your special product showcases.</p>
                </div>
                <Link href="/admin/curated/new">
                    <button className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-coral-500/20 transition-all">
                        <Plus size={20} />
                        Create Collection
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-navy-900" size={40} />
                </div>
            ) : sections.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No collections yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">Create themed collections like "Summer Vibes" or "Gift Guide" to showcase products on the homepage.</p>
                    <Link href="/admin/curated/new">
                        <button className="text-coral-500 font-bold hover:underline">Create your first collection</button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <div key={section.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Card Image Header */}
                            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                {section.image_url ? (
                                    <Image
                                        src={section.image_url}
                                        alt={section.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <LayoutGrid size={32} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${section.is_active
                                        ? 'bg-green-500/90 text-white'
                                        : 'bg-gray-500/90 text-white'
                                        }`}>
                                        {section.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                    {section.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/curated/${section.id}`}>
                                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 font-bold text-xs transition-colors">
                                                <Edit size={16} />
                                                Manage
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleActive(section)}
                                            className={`p-2 rounded-lg transition-colors ${section.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                            title="Toggle Visibility"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${section.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(section.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
