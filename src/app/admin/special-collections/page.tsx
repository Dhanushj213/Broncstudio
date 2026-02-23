'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import { SpecialCollection } from '@/types/shop';

export default function SpecialCollectionsList() {
    const [collections, setCollections] = useState<SpecialCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('special_collections')
            .select('*')
            .order('sort_order', { ascending: true });

        if (!error && data) {
            setCollections(data);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection? This action cannot be undone.')) return;

        const { error } = await supabase
            .from('special_collections')
            .delete()
            .eq('id', id);

        if (!error) {
            setCollections(prev => prev.filter(c => c.id !== id));
        } else {
            alert('Failed to delete collection');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-navy-900 mb-2">Special Collections</h1>
                    <p className="text-gray-500">Manage curated collections for the /special hub.</p>
                </div>
                <Link
                    href="/admin/special-collections/new"
                    className="inline-flex items-center gap-2 bg-coral-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-coral-600 transition-colors"
                >
                    <Plus size={20} />
                    Create New
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
                </div>
            ) : collections.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-4">No special collections created yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Thumbnail</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {collections.map((coll) => (
                                <tr key={coll.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {coll.thumbnail_image ? (
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                <Image
                                                    src={getGoogleDriveDirectLink(coll.thumbnail_image)}
                                                    alt={coll.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-navy-900">{coll.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">/special/{coll.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${coll.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {coll.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/special-collections/${coll.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coll.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
