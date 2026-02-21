'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

export default function NewCollectionPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        is_active: true,
        display_order: 0
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simple validation
        if (!formData.title) {
            addToast('Title is required', 'error');
            setSubmitting(false);
            return;
        }

        const { data, error } = await supabase
            .from('curated_sections')
            .insert(formData)
            .select() // Select to get ID
            .single();

        if (error) {
            console.error('Error creating collection:', error);
            addToast(`Error: ${error.message}`, 'error');
            setSubmitting(false);
        } else {
            addToast('Collection created! Redirecting...', 'success');
            // Redirect to edit page to add products immediately
            router.push(`/admin/curated/${data.id}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/curated">
                    <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Collection</h1>
                    <p className="text-gray-500 text-sm">Define your new curated showcase.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Collection Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Summer Vibes"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 transition-colors font-medium"
                            required
                        />
                    </div>

                    {/* Subtitle / Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Subtitle / Tagline</label>
                        <input
                            type="text"
                            placeholder="e.g. Fun in the sun."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 transition-colors font-medium"
                        />
                        <p className="text-xs text-gray-400 mt-1">Short text that appears below the title on cards.</p>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Cover Image URL</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 transition-colors text-sm"
                                    />
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 relative">
                                {formData.image_url ? (
                                    <Image src={getGoogleDriveDirectLink(formData.image_url)} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Simple Options */}
                    <div className="flex gap-8 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-5 h-5 text-coral-500 rounded focus:ring-coral-500 border-gray-300"
                            />
                            <span className="text-sm font-bold text-gray-900">Active (Visible)</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">Order:</span>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                className="w-20 px-2 py-1 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Create & Add Products
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
