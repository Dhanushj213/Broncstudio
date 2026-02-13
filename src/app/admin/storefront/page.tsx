'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Save, Loader2, Play, Image as ImageIcon, Plus, Trash2, LayoutTemplate } from 'lucide-react';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

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

type HeroContentType = 'video' | 'images';

interface HeroContent {
    type: HeroContentType;
    video_url: string;
    poster_url: string;
    images: string[];
    mobile_images: string[];
    heading: string;
    subheading: string;
    button_text: string;
    button_link: string;
}

interface LoginContent {
    visual_urls: string[];
    headline: string;
}

export default function StorefrontPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Hero Section State
    const [heroContent, setHeroContent] = useState<HeroContent>({
        type: 'video',
        video_url: '',
        poster_url: '',
        images: [''],
        mobile_images: [''],
        heading: 'Summer Luxe',
        subheading: 'New Collection',
        button_text: 'Shop Now',
        button_link: '/shop/new-arrivals'
    });

    // Login Page State
    const [loginContent, setLoginContent] = useState<LoginContent>({
        visual_urls: ['', '', ''],
        headline: 'Capturing Moments,<br />Creating Memories'
    });

    const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        // Fetch Hero
        const { data: heroData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'hero_main')
            .single();

        if (heroData && heroData.content) {
            setHeroContent(prev => ({
                ...prev,
                ...heroData.content,
                type: heroData.content.type || 'video',
                images: heroData.content.images || prev.images,
                mobile_images: heroData.content.mobile_images || heroData.content.images || prev.mobile_images
            }));
        }

        // Fetch Login
        const { data: loginData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'login_page')
            .single();

        if (loginData && loginData.content) {
            setLoginContent(prev => ({
                ...prev,
                ...loginData.content,
                visual_urls: loginData.content.visual_urls || (loginData.content.visual_url ? [loginData.content.visual_url, '', ''] : ['', '', ''])
            }));
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const heroPayload = {
            section_id: 'hero_main',
            content: heroContent,
            updated_at: new Date().toISOString()
        };

        const loginPayload = {
            section_id: 'login_page',
            content: loginContent,
            updated_at: new Date().toISOString()
        };

        const { error: heroErr } = await supabase
            .from('content_blocks')
            .upsert(heroPayload, { onConflict: 'section_id' });

        const { error: loginErr } = await supabase
            .from('content_blocks')
            .upsert(loginPayload, { onConflict: 'section_id' });

        if (heroErr || loginErr) {
            console.error(heroErr || loginErr);
            alert('Failed to save changes!');
        } else {
            alert('Storefront updated successfully!');
        }
        setSaving(false);
    };

    const handleImageChange = (index: number, value: string) => {
        const key = activeTab === 'desktop' ? 'images' : 'mobile_images';
        const newImages = [...heroContent[key]];
        newImages[index] = value;
        setHeroContent({ ...heroContent, [key]: newImages });
    };

    const addImage = () => {
        const key = activeTab === 'desktop' ? 'images' : 'mobile_images';
        setHeroContent({ ...heroContent, [key]: [...heroContent[key], ''] });
    };

    const removeImage = (index: number) => {
        const key = activeTab === 'desktop' ? 'images' : 'mobile_images';
        const newImages = heroContent[key].filter((_, i) => i !== index);
        // Ensure at least one image field exists
        if (newImages.length === 0) {
            setHeroContent({ ...heroContent, [key]: [''] });
        } else {
            setHeroContent({ ...heroContent, [key]: newImages });
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading storefront settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Storefront Customization</h1>
                <p className="text-gray-500">Manage the look and feel of your homepage headers and banners.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <LayoutTemplate size={20} className="text-coral-500" />
                            Hero Section
                        </h2>
                        <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
                    </div>

                    <div className="p-6 grid grid-cols-1 gap-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Content Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setHeroContent({ ...heroContent, type: 'video' })}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${heroContent.type === 'video' ? 'border-coral-500 bg-coral-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <Play size={20} />
                                    <span className="font-bold">Video Background</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHeroContent({ ...heroContent, type: 'images' })}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${heroContent.type === 'images' ? 'border-coral-500 bg-coral-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <ImageIcon size={20} />
                                    <span className="font-bold">Rolling Images</span>
                                </button>
                            </div>
                        </div>

                        {/* Video Configuration */}
                        {heroContent.type === 'video' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
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
                                            className="w-full pl-10 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Direct link to .mp4 file.</p>
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
                                            className="w-full pl-10 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Shown while video loads or on mobile.</p>
                                </div>
                            </div>
                        )}

                        {/* Images Configuration */}
                        {heroContent.type === 'images' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                {/* Device Tabs */}
                                <div className="flex border-b border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('desktop')}
                                        className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'desktop' ? 'border-coral-500 text-coral-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Desktop View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('mobile')}
                                        className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'mobile' ? 'border-coral-500 text-coral-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Mobile / App View
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-bold text-gray-700">
                                        {activeTab === 'desktop' ? 'Desktop' : 'Mobile'} Scrolling Images
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-lg shadow-coral-500/20 active:scale-95"
                                    >
                                        <Plus size={18} />
                                        Add {activeTab === 'desktop' ? 'Desktop' : 'Mobile'} Image
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(activeTab === 'desktop' ? heroContent.images : heroContent.mobile_images).map((url, index) => (
                                        <div key={index} className="flex gap-2 items-center group">
                                            <span className="w-6 text-sm font-bold text-gray-400 text-right">{index + 1}.</span>
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <ImageIcon size={16} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={e => handleImageChange(index, e.target.value)}
                                                    className="w-full pl-10 pr-10 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                                                    placeholder={`${activeTab === 'desktop' ? 'Desktop' : 'Mobile'} Image URL #${index + 1}`}
                                                />
                                                {(activeTab === 'desktop' ? heroContent.images : heroContent.mobile_images).length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="border-gray-100" />

                        {/* Text Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
                                <input
                                    type="text"
                                    value={heroContent.heading}
                                    onChange={e => setHeroContent({ ...heroContent, heading: e.target.value })}
                                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subheading</label>
                                <input
                                    type="text"
                                    value={heroContent.subheading}
                                    onChange={e => setHeroContent({ ...heroContent, subheading: e.target.value })}
                                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={heroContent.button_text}
                                    onChange={e => setHeroContent({ ...heroContent, button_text: e.target.value })}
                                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Button Link</label>
                                <input
                                    type="text"
                                    value={heroContent.button_link}
                                    onChange={e => setHeroContent({ ...heroContent, button_link: e.target.value })}
                                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview (Mini) */}
                    <div className="bg-gray-900 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-48">
                        <div className="absolute inset-0 opacity-40">
                            {heroContent.type === 'video' ? (
                                heroContent.video_url ? (
                                    <video src={getGoogleDriveDirectLink(heroContent.video_url)} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                ) : (
                                    <img src={getGoogleDriveDirectLink(heroContent.poster_url)} className="w-full h-full object-cover" alt="Preview" />
                                )
                            ) : (
                                <div className="w-full h-full flex overflow-hidden">
                                    {/* Simple preview for images - just show first one */}
                                    {heroContent.images[0] && (
                                        <img src={getGoogleDriveDirectLink(heroContent.images[0])} className="w-full h-full object-cover" alt="Preview" />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative z-10 text-white">
                            <p className="text-xs font-bold tracking-widest uppercase mb-2">{heroContent.subheading}</p>
                            <h3 className="text-2xl font-serif italic mb-4">{heroContent.heading}</h3>
                            <span className="bg-white text-navy-900 px-4 py-2 rounded-full text-xs font-bold uppercase">{heroContent.button_text}</span>
                        </div>
                    </div>
                </div>

                {/* Login Page Customization */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ImageIcon size={20} className="text-indigo-500" />
                            Login Page Settings
                        </h2>
                        <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded">Portal</span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">
                                    Visual Images (up to 3 for carousel)
                                </label>
                                {[0, 1, 2].map(idx => (
                                    <div key={idx} className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ImageIcon size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={loginContent.visual_urls[idx] || ''}
                                            onChange={e => {
                                                const newUrls = [...loginContent.visual_urls];
                                                newUrls[idx] = e.target.value;
                                                setLoginContent({ ...loginContent, visual_urls: newUrls });
                                            }}
                                            className="w-full pl-10 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                            placeholder={`Image URL #${idx + 1}`}
                                        />
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 mt-1">Images will auto-scroll on the login page.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Narrative Headline (HTML supported)
                                </label>
                                <textarea
                                    value={loginContent.headline}
                                    onChange={e => setLoginContent({ ...loginContent, headline: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="Capturing Moments,<br />Creating Memories"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use &lt;br /&gt; for line breaks.</p>
                            </div>
                        </div>

                        {/* Login Preview */}
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Preview: Login Panel
                            </div>
                            <div className="relative h-48 bg-[#1a1a24] flex items-center justify-center p-8 overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    {loginContent.visual_urls.find(url => url !== '') && (
                                        <img src={getGoogleDriveDirectLink(loginContent.visual_urls.find(url => url !== '') || '')} className="w-full h-full object-cover" alt="Preview" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                </div>
                                <div className="relative z-10 w-full">
                                    <h4 className="text-white text-lg font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: loginContent.headline }} />
                                </div>
                            </div>
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
