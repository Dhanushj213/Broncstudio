'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface CuratedSection {
    id: string;
    title: string;
    description: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

export default function CuratedSectionsPage() {
    const [sections, setSections] = useState<CuratedSection[]>([]);
    const [loading, setLoading] = useState(true);

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
        } else {
            setSections(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        const { error } = await supabase.from('curated_sections').delete().eq('id', id);
        if (error) {
            alert('Failed to delete');
        } else {
            fetchSections();
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('curated_sections')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (!error) {
            setSections(sections.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
        }
    };

    const handleSeed = async () => {
        setLoading(true);
        const defaults = [
            { title: 'Gifts Under ₹499', description: 'Small joys, big smiles.', image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80', display_order: 1, category_slugs: ['keychains', 'badges', 'accessories'] },
            { title: 'Study Time', description: 'Fun meets focus.', image_url: 'https://images.unsplash.com/photo-1456735190827-d1261f7add50?w=600&q=80', display_order: 2, category_slugs: ['notebooks', 'stationery'] },
            { title: 'Desk Therapy', description: 'Workspaces that feel like you.', image_url: 'https://images.unsplash.com/photo-1497215842964-222b430dc0a8?w=600&q=80', display_order: 3, category_slugs: ['mouse-pads', 'coasters'] },
            { title: 'Weekend Fits', description: 'Relaxed. Easy. Effortless.', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', display_order: 4, category_slugs: ['men-hoodies', 'clothing'] },
            { title: 'Mini Home Makeover', description: 'Small changes, big vibe.', image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', display_order: 5, category_slugs: ['posters', 'home-decor'] },
            { title: 'Everyday Carry', description: 'What you reach for daily.', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', display_order: 6, category_slugs: ['bags', 'wallets'] },
        ];

        const { error } = await supabase.from('curated_sections').insert(defaults);
        if (error) {
            alert('Error seeding: ' + error.message);
        } else {
            fetchSections();
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Curated Collections</h1>
                    <p className="text-gray-500">Manage 'Curated For You' sections on desktop and mobile.</p>
                </div>
                <Link href="/admin/curated/new">
                    <button className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-navy-800 transition-colors">
                        <Plus size={20} />
                        Add New Selection
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading selections...</div>
            ) : sections.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No selections found</h3>
                    <p className="text-gray-500 mb-6">Create your first curated collection to get started.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/admin/curated/new">
                            <button className="px-6 py-2 bg-coral-500 text-white rounded-lg font-bold">Create Selection</button>
                        </Link>
                        <button onClick={handleSeed} className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold">
                            Seed Defaults
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <div key={section.id} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group ${!section.is_active ? 'opacity-75' : ''}`}>
                            <div className="relative aspect-[4/3] bg-gray-100">
                                <img src={section.image_url} alt={section.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => toggleStatus(section.id, section.is_active)}
                                        className="bg-white/90 p-2 rounded-lg text-gray-700 hover:text-navy-900 shadow-sm backdrop-blur-sm"
                                        title={section.is_active ? "Hide" : "Show"}
                                    >
                                        {section.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-mono">
                                    Order: {section.display_order}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-navy-900 truncate">{section.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1 mb-4">{section.description || 'No description'}</p>

                                <div className="flex gap-2">
                                    <Link href={`/admin/curated/${section.id}`} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-navy-900 text-sm font-bold rounded-lg transition-colors">
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(section.id)}
                                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
