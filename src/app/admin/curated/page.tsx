'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Edit, Trash2, ExternalLink, Loader2, Sparkles, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import GlassCard from '@/components/UI/GlassCard';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

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
    const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
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

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSectionToDelete(id);
    };

    const confirmDelete = async () => {
        if (!sectionToDelete) return;

        const id = sectionToDelete;
        setLoading(true);
        const { error } = await supabase.from('curated_sections').delete().eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            addToast(`Failed to delete: ${error.message}`, 'error');
        } else {
            setSections(sections.filter(s => s.id !== id));
            addToast('Collection deleted', 'success');
        }
        setLoading(false);
        setSectionToDelete(null);
    };

    const handleToggleActive = async (e: React.MouseEvent, section: CuratedSection) => {
        e.preventDefault();
        e.stopPropagation();

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
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Curated Collections</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your special product showcases.</p>
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
                    <Loader2 className="animate-spin text-navy-900 dark:text-white" size={40} />
                </div>
            ) : sections.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-400">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No collections yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">Create themed collections like "Summer Vibes" or "Gift Guide" to showcase products on the homepage.</p>
                    <Link href="/admin/curated/new">
                        <button className="text-coral-500 font-bold hover:underline">Create your first collection</button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <div key={section.id} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Card Image Header */}
                            <div className="relative h-48 w-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                {section.image_url ? (
                                    <Image
                                        src={getGoogleDriveDirectLink(section.image_url)}
                                        alt={section.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
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
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{section.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                    {section.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/curated/${section.id}`}>
                                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 font-bold text-xs transition-colors">
                                                <Edit size={16} />
                                                Manage
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleToggleActive(e, section)}
                                            className={`p-2 rounded-lg transition-colors ${section.is_active ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            title="Toggle Visibility"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${section.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, section.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

            <ConfirmationModal
                isOpen={!!sectionToDelete}
                onClose={() => setSectionToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Collection"
                message="Are you sure you want to delete this collection? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
