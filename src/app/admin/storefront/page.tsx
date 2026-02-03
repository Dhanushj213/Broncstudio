'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Save, Loader2, Play, Image as ImageIcon, ExternalLink, Type } from 'lucide-react';

/* 
 * NOTE: This page relies on a 'content_blocks' table in Supabase.
 * SQL to create:
 * 
 * create table if not exists content_blocks (
 *   id uuid default gen_random_uuid() primary key,
 *   section_id text not null unique,
 *   content jsonb not null default '{}'::jsonb,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * alter table content_blocks enable row level security;
 * create policy "Public read access" on content_blocks for select using (true);
 * create policy "Admin full access" on content_blocks for all using (auth.role() = 'authenticated');
 */

export default function StorefrontPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Hero Section State
    const [heroContent, setHeroContent] = useState({
        video_url: 'https://videos.pexels.com/video-files/5668471/5668471-uhd_2560_1440_30fps.mp4',
        poster_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        heading: 'Summer Luxe',
        subheading: 'New Collection',
        button_text: 'Shop Now',
        button_link: '/shop/new-arrivals'
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'hero_main')
            .single();

        if (data && data.content) {
            setHeroContent(prev => ({ ...prev, ...data.content }));
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            section_id: 'hero_main',
            content: heroContent,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('content_blocks')
            .upsert(payload, { onConflict: 'section_id' });

        if (error) {
            console.error(error);
            alert('Failed to save changes: ' + error.message);
        } else {
            alert('Storefront updated successfully!');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading storefront settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-navy-900">Storefront Customization</h1>
                <p className="text-gray-500">Manage the look and feel of your homepage headers and banners.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                            <Play size={20} className="text-coral-500" />
                            Hero Section (Video/Image)
                        </h2>
                        <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
                    </div>

                    <div className="p-6 grid grid-cols-1 gap-6">
                        {/* Media Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Video URL (MP4)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Play size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        value={heroContent.video_url}
                                        onChange={e => setHeroContent({ ...heroContent, video_url: e.target.value })}
                                        className="w-full pl-10 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Direct link to .mp4 file. Leave empty for image only.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Poster / Fallback Image URL
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ImageIcon size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        value={heroContent.poster_url}
                                        onChange={e => setHeroContent({ ...heroContent, poster_url: e.target.value })}
                                        className="w-full pl-10 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Shown while video loads or on mobile.</p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Text Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
                                <input
                                    type="text"
                                    value={heroContent.heading}
                                    onChange={e => setHeroContent({ ...heroContent, heading: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subheading</label>
                                <input
                                    type="text"
                                    value={heroContent.subheading}
                                    onChange={e => setHeroContent({ ...heroContent, subheading: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={heroContent.button_text}
                                    onChange={e => setHeroContent({ ...heroContent, button_text: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Button Link</label>
                                <input
                                    type="text"
                                    value={heroContent.button_link}
                                    onChange={e => setHeroContent({ ...heroContent, button_link: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview (Mini) */}
                    <div className="bg-gray-900 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-48">
                        {/* We can't actually render the full video component here easily without context, but we can fake it */}
                        <div className="absolute inset-0 opacity-40">
                            {heroContent.video_url ? (
                                <video src={heroContent.video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            ) : (
                                <img src={heroContent.poster_url} className="w-full h-full object-cover" alt="Preview" />
                            )}
                        </div>
                        <div className="relative z-10 text-white">
                            <p className="text-xs font-bold tracking-widest uppercase mb-2">{heroContent.subheading}</p>
                            <h3 className="text-2xl font-serif italic mb-4">{heroContent.heading}</h3>
                            <span className="bg-white text-navy-900 px-4 py-2 rounded-full text-xs font-bold uppercase">{heroContent.button_text}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end sticky bottom-6 z-20">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-4 px-8 rounded-xl flex items-center gap-2 shadow-2xl shadow-navy-900/30 transition-all disabled:opacity-70 transform hover:scale-105"
                    >
                        {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
