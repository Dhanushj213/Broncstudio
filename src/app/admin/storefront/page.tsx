'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
    Save,
    Loader2,
    Play,
    Image as ImageIcon,
    Plus,
    Trash2,
    LayoutTemplate,
    Sparkles,
    MousePointer2,
    Globe,
    Leaf,
    Newspaper,
    Smartphone,
    ExternalLink,
    Grid,
    ShoppingBag,
    UserCircle,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import { CATEGORY_TAXONOMY } from '@/data/categories';


/* 
 * NOTE: This page relies on a 'content_blocks' table in Supabase.
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

interface BentoTile {
    title: string;
    subtitle: string;
    href: string;
    image: string;
    colSpan: string;
    rowSpan: string;
    color: string;
    textColor: string;
}

interface BentoContent {
    tiles: BentoTile[];
}

interface ShopCollection {
    id: string;
    name: string;
    image: string;
    slug: string;
    description: string;
}

interface ShopCollectionsContent {
    collections: ShopCollection[];
}

interface LoginContent {
    visual_urls: string[];
    headline: string;
}

interface SocialLinksContent {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
    gmail: string;
    phone: string;
    secondaryPhone: string;
    address: string;
}

interface SustainabilityContent {
    proudly_indian_image: string;
    title: string;
    text: string;
}

interface PressItem {
    id: string;
    name: string;
    logo: string;
    quote: string;
    date: string;
}

interface LookbookItem {
    id: string;
    image: string;
    user: string;
}

export default function StorefrontPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

    // Bento Grid State
    const [bentoContent, setBentoContent] = useState<BentoContent>({
        tiles: []
    });

    // Shop Page Collections State
    const [shopCollections, setShopCollections] = useState<ShopCollectionsContent>({
        collections: []
    });

    // Login Page State
    const [loginContent, setLoginContent] = useState<LoginContent>({
        visual_urls: ['', '', ''],
        headline: 'Capturing Moments,<br />Creating Memories'
    });

    const [shopHeroImages, setShopHeroImages] = useState<Record<string, string>>({});

    // Social Links State
    const [socialLinks, setSocialLinks] = useState<SocialLinksContent>({
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: '',
        gmail: '',
        phone: '',
        secondaryPhone: '',
        address: ''
    });

    // Sustainability Content State
    const [sustainabilityContent, setSustainabilityContent] = useState<SustainabilityContent>({
        proudly_indian_image: '',
        title: 'Proudly Indian.',
        text: 'Every thread tells a story of Indian heritage. By choosing Broncstudio, you\'re supporting local textile communities in Tamil Nadu and Karnataka.'
    });

    // Press Content State
    const [pressItems, setPressItems] = useState<PressItem[]>([]);

    // Lookbook Content State
    const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>([]);


    const [activeHeroTab, setActiveHeroTab] = useState<'desktop' | 'mobile'>('desktop');
    const [activeSection, setActiveSection] = useState('hero');

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

        // Fetch Bento Grid
        const { data: bentoData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'bento_grid')
            .single();

        if (bentoData && bentoData.content) {
            setBentoContent(bentoData.content);
        } else {
            setBentoContent({
                tiles: [
                    { title: 'Clothing', subtitle: 'Trending', href: '/shop/clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-green-100', textColor: 'text-green-900' },
                    { title: 'Women', subtitle: 'For Her', href: '/shop/clothing/women', image: 'https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=600&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-2', color: 'bg-orange-50', textColor: 'text-orange-900' },
                    { title: 'Stationery & Play', subtitle: 'Curiosity', href: '/shop/kids', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-blue-50', textColor: 'text-blue-900' },
                    { title: 'Accessories', subtitle: 'Extras', href: '/shop/accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-purple-100', textColor: 'text-purple-900' },
                    { title: 'Men', subtitle: 'Menswear', href: '/shop/clothing/men', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-stone-100', textColor: 'text-stone-900' },
                    { title: 'Pets', subtitle: 'Furry Friends', href: '/shop/pets', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-amber-100', textColor: 'text-amber-900' },
                    { title: 'Lifestyle', subtitle: 'Small Joys', href: '/shop/lifestyle', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80', colSpan: 'col-span-6 md:col-span-3', rowSpan: 'row-span-1', color: 'bg-rose-50', textColor: 'text-rose-900' },
                    { title: 'Home', subtitle: 'Decor', href: '/shop/home', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80', colSpan: 'col-span-12', rowSpan: 'row-span-1', color: 'bg-indigo-100', textColor: 'text-indigo-900' }
                ]
            });
        }

        // Fetch Shop Collections
        const { data: shopData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'shop_page_collections')
            .single();

        if (shopData && shopData.content) {
            setShopCollections({ collections: shopData.content });
        } else {
            setShopCollections({
                collections: [
                    { id: 'kids', name: 'Stationery & Play', slug: 'kids', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', description: 'Curiosity & Play.' },
                    { id: 'clothing', name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80', description: 'Fashion for Everyone.' },
                    { id: 'lifestyle', name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80', description: 'Small Joys & Gifting.' },
                    { id: 'home', name: 'Home & Tech', slug: 'home', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80', description: 'Decor & Comfort.' },
                    { id: 'accessories', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80', description: 'Style Extras.' },
                    { id: 'pets', name: 'Pets', slug: 'pets', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80', description: 'Furry Friends.' }
                ]
            });
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

        // Fetch Shop Hero Images
        const { data: shopHeroData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'shop_hero_images')
            .single();

        if (shopHeroData && shopHeroData.content) {
            setShopHeroImages(shopHeroData.content);
        }

        // Fetch Social Links
        const { data: socialData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'global_social_links')
            .single();
        if (socialData && socialData.content) setSocialLinks(socialData.content);

        // Fetch Sustainability Content
        const { data: sustData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'sustainability_content')
            .single();
        if (sustData && sustData.content) setSustainabilityContent(sustData.content);

        // Fetch Press Content
        const { data: pressData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'press_content')
            .single();
        if (pressData && pressData.content) setPressItems(pressData.content);

        // Fetch Lookbook Content
        const { data: lookbookData } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('section_id', 'lookbook_content')
            .single();
        if (lookbookData && lookbookData.content) setLookbookItems(lookbookData.content);

        setLoading(false);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSaveStatus('idle');

        const heroPayload = {
            section_id: 'hero_main',
            content: heroContent,
            updated_at: new Date().toISOString()
        };

        const bentoPayload = {
            section_id: 'bento_grid',
            content: bentoContent,
            updated_at: new Date().toISOString()
        };

        const shopPayload = {
            section_id: 'shop_page_collections',
            content: shopCollections.collections,
            updated_at: new Date().toISOString()
        };

        const loginPayload = {
            section_id: 'login_page',
            content: loginContent,
            updated_at: new Date().toISOString()
        };

        const shopHeroPayload = {
            section_id: 'shop_hero_images',
            content: shopHeroImages,
            updated_at: new Date().toISOString()
        };

        const socialPayload = {
            section_id: 'global_social_links',
            content: socialLinks,
            updated_at: new Date().toISOString()
        };

        const sustPayload = {
            section_id: 'sustainability_content',
            content: sustainabilityContent,
            updated_at: new Date().toISOString()
        };

        const pressPayload = {
            section_id: 'press_content',
            content: pressItems,
            updated_at: new Date().toISOString()
        };

        const lookbookPayload = {
            section_id: 'lookbook_content',
            content: lookbookItems,
            updated_at: new Date().toISOString()
        };


        const { error: heroErr } = await supabase
            .from('content_blocks')
            .upsert(heroPayload, { onConflict: 'section_id' });

        const { error: bentoErr } = await supabase
            .from('content_blocks')
            .upsert(bentoPayload, { onConflict: 'section_id' });

        const { error: shopErr } = await supabase
            .from('content_blocks')
            .upsert(shopPayload, { onConflict: 'section_id' });

        const { error: loginErr } = await supabase
            .from('content_blocks')
            .upsert(loginPayload, { onConflict: 'section_id' });

        const { error: shopHeroErr } = await supabase
            .from('content_blocks')
            .upsert(shopHeroPayload, { onConflict: 'section_id' });

        const { error: socialErr } = await supabase.from('content_blocks').upsert(socialPayload, { onConflict: 'section_id' });
        const { error: sustErr } = await supabase.from('content_blocks').upsert(sustPayload, { onConflict: 'section_id' });
        const { error: pressErr } = await supabase.from('content_blocks').upsert(pressPayload, { onConflict: 'section_id' });
        const { error: lookbookErr } = await supabase.from('content_blocks').upsert(lookbookPayload, { onConflict: 'section_id' });

        if (heroErr || bentoErr || shopErr || loginErr || shopHeroErr || socialErr || sustErr || pressErr || lookbookErr) {
            console.error(heroErr || bentoErr || shopErr || loginErr || shopHeroErr || socialErr || sustErr || pressErr || lookbookErr);

            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
        setSaving(false);
    };

    const handleHeroImageChange = (index: number, value: string) => {
        const key = activeHeroTab === 'desktop' ? 'images' : 'mobile_images';
        const newImages = [...heroContent[key]];
        newImages[index] = value;
        setHeroContent({ ...heroContent, [key]: newImages });
    };

    const addHeroImage = () => {
        const key = activeHeroTab === 'desktop' ? 'images' : 'mobile_images';
        setHeroContent({ ...heroContent, [key]: [...heroContent[key], ''] });
    };

    const removeHeroImage = (index: number) => {
        const key = activeHeroTab === 'desktop' ? 'images' : 'mobile_images';
        const newImages = heroContent[key].filter((_, i) => i !== index);
        if (newImages.length === 0) {
            setHeroContent({ ...heroContent, [key]: [''] });
        } else {
            setHeroContent({ ...heroContent, [key]: newImages });
        }
    };

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
            <Loader2 size={32} className="animate-spin mb-4" />
            <p className="font-medium">Loading Storefront Settings...</p>
        </div>
    );

    const NAVIGATION = [
        { id: 'hero', label: 'Hero Section', icon: <Sparkles size={18} /> },
        { id: 'shop_heroes', label: 'Shop Hero Banners', icon: <ImageIcon size={18} /> },
        { id: 'bento', label: 'Department Bento', icon: <Grid size={18} /> },
        { id: 'shop', label: 'Shop Collections', icon: <ShoppingBag size={18} /> },
        { id: 'special_heroes', label: 'Special Pages', icon: <Sparkles size={18} /> },
        { id: 'social_links', label: 'Social & Contact', icon: <Globe size={18} /> },
        { id: 'sustainability', label: 'Sustainability', icon: <Leaf size={18} /> },
        { id: 'press', label: 'Press', icon: <Newspaper size={18} /> },
        { id: 'lookbook', label: 'Lookbook', icon: <ShoppingBag size={18} /> },
        { id: 'login', label: 'Login Overlay', icon: <UserCircle size={18} /> },

    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-32 max-w-[1400px] mx-auto relative px-4 sm:px-6">

            {/* Left Sidebar Navigation - Sticky */}
            <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 p-2 shadow-sm">
                        {NAVIGATION.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === item.id
                                    ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/20 scale-[1.02]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-white/5 hover:text-navy-900 dark:hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                                {activeSection === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                            </button>
                        ))}
                    </div>

                    <div className="bg-navy-50 dark:bg-white/5 rounded-2xl p-6 border border-navy-100 dark:border-white/10">
                        <h4 className="text-navy-900 dark:text-white font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Globe size={14} className="text-navy-500" />
                            Live Shop
                        </h4>
                        <p className="text-navy-700 dark:text-gray-400 text-xs mb-4">View your changes on the live site.</p>
                        <a
                            href="/shop"
                            target="_blank"
                            className="flex items-center gap-2 text-navy-900 dark:text-white font-bold text-sm group"
                        >
                            Open Storefront
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-12">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                            <span>Admin Dashboard</span>
                            <ChevronRight size={12} />
                            <span className="text-navy-900 dark:text-white">Storefront</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">Customization</h1>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        {saveStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-bold animate-in fade-in slide-in-from-right-4 transition-all scale-100 opacity-100">
                                <CheckCircle2 size={16} />
                                Changes Saved!
                            </div>
                        )}
                        <button
                            onClick={() => handleSave()}
                            disabled={saving}
                            className="bg-navy-900 text-white font-black py-4 px-10 rounded-2xl flex items-center gap-3 shadow-2xl shadow-navy-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            SAVE CHANGES
                        </button>
                    </div>
                </header>

                <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>

                    {/* HERO SECTION */}
                    <section id="hero" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-navy-900 dark:border-white/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-navy-900 dark:bg-white/10 flex items-center justify-center text-white shadow-xl">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Hero Section</h2>
                                <p className="text-[10px] font-black text-navy-500 dark:text-gray-400 uppercase tracking-[0.2em]">Homepage Header & Branding</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden group transition-all hover:border-navy-100 dark:hover:border-white/20">
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Side: Config */}
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                            <MousePointer2 size={14} className="text-navy-400 dark:text-gray-500" />
                                            Content Format
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setHeroContent({ ...heroContent, type: 'video' })}
                                                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${heroContent.type === 'video' ? 'border-navy-900 bg-navy-900 dark:bg-coral-500 dark:border-coral-500 text-white shadow-2xl shadow-navy-900/20' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-400 dark:text-gray-500 hover:border-navy-200 dark:hover:border-white/20 hover:bg-navy-50/50 dark:hover:bg-white/5'}`}
                                            >
                                                <Play size={28} />
                                                <span className="font-bold text-sm tracking-tight">Video Loop</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHeroContent({ ...heroContent, type: 'images' })}
                                                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${heroContent.type === 'images' ? 'border-navy-900 bg-navy-900 dark:bg-coral-500 dark:border-coral-500 text-white shadow-2xl shadow-navy-900/20' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-400 dark:text-gray-500 hover:border-navy-200 dark:hover:border-white/20 hover:bg-navy-50/50 dark:hover:bg-white/5'}`}
                                            >
                                                <ImageIcon size={28} />
                                                <span className="font-bold text-sm tracking-tight">Image Slider</span>
                                            </button>
                                        </div>
                                    </div>

                                    {heroContent.type === 'video' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-navy-900 uppercase tracking-widest">Video Source (MP4)</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="url"
                                                        value={heroContent.video_url}
                                                        onChange={e => setHeroContent({ ...heroContent, video_url: e.target.value })}
                                                        className="w-full pl-4 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-navy-900 dark:focus:border-coral-500 rounded-2xl transition-all text-navy-900 dark:text-white text-sm font-bold outline-none shadow-sm"
                                                        placeholder="Paste Drive Link..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-navy-900 uppercase tracking-widest">Fallback Poster</label>
                                                <input
                                                    type="url"
                                                    value={heroContent.poster_url}
                                                    onChange={e => setHeroContent({ ...heroContent, poster_url: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-navy-900 dark:focus:border-coral-500 rounded-2xl transition-all text-navy-900 dark:text-white text-sm font-bold outline-none shadow-sm"
                                                    placeholder="Fallback image link..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveHeroTab('desktop')}
                                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeHeroTab === 'desktop' ? 'bg-white text-navy-900 shadow-xl' : 'text-gray-500 hover:text-navy-700'}`}
                                                >
                                                    <Globe size={14} /> Desktop View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveHeroTab('mobile')}
                                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeHeroTab === 'mobile' ? 'bg-white text-navy-900 shadow-xl' : 'text-gray-500 hover:text-navy-700'}`}
                                                >
                                                    <Smartphone size={14} /> Mobile View
                                                </button>
                                            </div>

                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(activeHeroTab === 'desktop' ? heroContent.images : heroContent.mobile_images).map((url, idx) => (
                                                    <div key={idx} className="flex gap-3 items-center group/url">
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="url"
                                                                value={url}
                                                                onChange={e => handleHeroImageChange(idx, e.target.value)}
                                                                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-navy-900 dark:focus:border-coral-500 rounded-2xl transition-all text-navy-900 dark:text-white text-sm font-bold outline-none shadow-sm"
                                                                placeholder={`Gallery Image #${idx + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeHeroImage(idx)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addHeroImage}
                                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={18} /> Add Another Image
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Primary Heading</label>
                                            <input
                                                type="text"
                                                value={heroContent.heading}
                                                onChange={e => setHeroContent({ ...heroContent, heading: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent dark:border-white/5 focus:border-navy-900 dark:focus:border-coral-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl outline-none font-bold text-navy-900 dark:text-white placeholder:text-gray-300"
                                                placeholder="Enter Primary Heading"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Subheading Label</label>
                                            <input
                                                type="text"
                                                value={heroContent.subheading}
                                                onChange={e => setHeroContent({ ...heroContent, subheading: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-navy-900 dark:focus:border-coral-500 rounded-2xl outline-none font-bold text-navy-900 dark:text-white placeholder:text-gray-300 shadow-sm"
                                                placeholder="Enter Subheading"
                                            />
                                        </div>
                                        <div className="space-y-2 text-gray-900 ">
                                            <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">CTA Button Text</label>
                                            <input
                                                type="text"
                                                value={heroContent.button_text}
                                                onChange={e => setHeroContent({ ...heroContent, button_text: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent dark:border-white/5 focus:border-navy-900 dark:focus:border-coral-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl outline-none font-bold tracking-tight text-navy-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2 text-gray-900 ">
                                            <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Button Destination</label>
                                            <input
                                                type="text"
                                                value={heroContent.button_link}
                                                onChange={e => setHeroContent({ ...heroContent, button_link: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-navy-900 dark:focus:border-coral-500 rounded-2xl outline-none font-bold text-navy-900 dark:text-white shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visual Preview */}
                                <div className="lg:col-span-5 flex flex-col gap-4">
                                    <label className="text-xs font-black text-navy-900 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={14} className="text-navy-400" />
                                        Interactive Preview
                                    </label>
                                    <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-navy-900 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-navy-950 dark:border-white/5 group/preview">
                                        {/* Background Visual */}
                                        <div className="absolute inset-0 z-0">
                                            {heroContent.type === 'video' ? (
                                                heroContent.video_url ? (
                                                    <video
                                                        src={getGoogleDriveDirectLink(heroContent.video_url)}
                                                        className="w-full h-full object-cover"
                                                        muted loop autoPlay playsInline
                                                    />
                                                ) : (
                                                    getGoogleDriveDirectLink(heroContent.poster_url) && (
                                                        <img src={getGoogleDriveDirectLink(heroContent.poster_url)} className="w-full h-full object-cover opacity-50" alt="" />
                                                    )
                                                )
                                            ) : (
                                                <div className="w-full h-full overflow-hidden bg-navy-800">
                                                    {heroContent.images[0] && getGoogleDriveDirectLink(heroContent.images[0]) && (
                                                        <img src={getGoogleDriveDirectLink(heroContent.images[0])} className="w-full h-full object-cover" alt="" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 z-10 p-8 flex flex-col items-center justify-center text-center text-white space-y-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                {heroContent.subheading?.replace(/No video configured/gi, '').replace(/No images configured/gi, '').trim()}
                                            </span>
                                            <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                                {heroContent.heading?.replace(/No video configured/gi, '').replace(/No images configured/gi, '').trim()}
                                            </h3>
                                            <div className="pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                                <span className="px-8 py-3 bg-white text-navy-900 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                                                    {heroContent.button_text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Device Mockup Decor */}
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-navy-950 rounded-full z-20 shadow-inner" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Mobile Aspect Ratio Preview</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SPECIAL PAGES HERO BANNERS SECTION */}
                    <section id="special_heroes" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-emerald-500 dark:border-emerald-500/50 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Special Pages</h2>
                                <p className="text-[10px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-[0.2em]">Heroes for New Arrivals, Bestsellers & Sustainability</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 shadow-xl space-y-8">
                            {/* New Arrivals */}
                            <div className="space-y-4 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-navy-900 dark:text-white uppercase">New Arrivals</h3>
                                        <p className="text-xs text-gray-400 font-bold">Hero Image for /shop/new-arrivals</p>
                                    </div>
                                    <div className="w-32 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/10">
                                        {getGoogleDriveDirectLink(shopHeroImages['new-arrivals'] || '') && (
                                            <img src={getGoogleDriveDirectLink(shopHeroImages['new-arrivals'] || '')} className="w-full h-full object-cover" alt="" />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    value={shopHeroImages['new-arrivals'] || ''}
                                    onChange={e => setShopHeroImages({ ...shopHeroImages, 'new-arrivals': e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm shadow-sm transition-all"
                                    placeholder="Paste New Arrivals Hero Link..."
                                />
                            </div>

                            {/* Bestsellers */}
                            <div className="space-y-4 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-navy-900 dark:text-white uppercase">Bestsellers</h3>
                                        <p className="text-xs text-gray-400 font-bold">Hero Image for /shop/bestsellers</p>
                                    </div>
                                    <div className="w-32 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/10">
                                        {getGoogleDriveDirectLink(shopHeroImages['bestsellers'] || '') && (
                                            <img src={getGoogleDriveDirectLink(shopHeroImages['bestsellers'] || '')} className="w-full h-full object-cover" alt="" />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    value={shopHeroImages['bestsellers'] || ''}
                                    onChange={e => setShopHeroImages({ ...shopHeroImages, 'bestsellers': e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm shadow-sm transition-all"
                                    placeholder="Paste Bestsellers Hero Link..."
                                />
                            </div>

                            {/* Sustainability */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-navy-900 dark:text-white uppercase">Sustainability</h3>
                                        <p className="text-xs text-gray-400 font-bold">Hero Image for /sustainability</p>
                                    </div>
                                    <div className="w-32 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/10">
                                        {getGoogleDriveDirectLink(shopHeroImages['sustainability'] || '') && (
                                            <img src={getGoogleDriveDirectLink(shopHeroImages['sustainability'] || '')} className="w-full h-full object-cover" alt="" />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    value={shopHeroImages['sustainability'] || ''}
                                    onChange={e => setShopHeroImages({ ...shopHeroImages, 'sustainability': e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm shadow-sm transition-all"
                                    placeholder="Paste Sustainability Hero Link..."
                                />
                            </div>
                        </div>
                    </section>
                    {/* SHOP HERO BANNERS SECTION */}
                    <section id="shop_heroes" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-cyan-500 dark:border-cyan-500/50 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-xl">
                                <ImageIcon size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Shop Hero Banners</h2>
                                <p className="text-[10px] font-black text-cyan-600/70 dark:text-cyan-400/70 uppercase tracking-[0.2em]">Hero Images for Shop levels</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 shadow-xl space-y-8">
                            {/* Root Shop Hero */}
                            <div className="space-y-4 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-navy-900 dark:text-white uppercase">Main Shop Hero</h3>
                                        <p className="text-xs text-gray-400 font-bold">Image for the root /shop page</p>
                                    </div>
                                    <div className="w-32 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/10">
                                        {getGoogleDriveDirectLink(shopHeroImages['root'] || '') && (
                                            <img src={getGoogleDriveDirectLink(shopHeroImages['root'] || '')} className="w-full h-full object-cover" alt="" />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    value={shopHeroImages['root'] || ''}
                                    onChange={e => setShopHeroImages({ ...shopHeroImages, root: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-cyan-500 rounded-2xl outline-none font-bold text-sm shadow-sm transition-all"
                                    placeholder="Paste Main Shop Hero Link..."
                                />
                            </div>

                            {/* Category Heroes */}
                            <div className="space-y-10">
                                {Object.values(CATEGORY_TAXONOMY).map(cat => (
                                    <div key={cat.slug} className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                Category: {cat.name}
                                            </div>
                                            <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Category Level Image */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <label className="text-[10px] font-black text-navy-900 dark:text-white uppercase tracking-widest">
                                                        {cat.name} Hero Banner
                                                    </label>
                                                    <div className="w-20 h-10 rounded-lg bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/5">
                                                        {getGoogleDriveDirectLink(shopHeroImages[cat.slug] || '') && (
                                                            <img src={getGoogleDriveDirectLink(shopHeroImages[cat.slug] || '')} className="w-full h-full object-cover" alt="" />
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={shopHeroImages[cat.slug] || ''}
                                                    onChange={e => setShopHeroImages({ ...shopHeroImages, [cat.slug]: e.target.value })}
                                                    className="w-full text-navy-900 dark:text-white px-3 py-2 bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-cyan-500 rounded-xl outline-none text-xs font-bold shadow-sm transition-all"
                                                    placeholder={`${cat.name} image link...`}
                                                />
                                            </div>

                                            {/* Subcategories (If any) */}
                                            {cat.subcategories && cat.subcategories.map((sub: any) => (
                                                <div key={sub.slug} className="space-y-3">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            Sub: {sub.name} <ChevronRight size={10} /> Hero
                                                        </label>
                                                        <div className="w-16 h-8 rounded bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/5">
                                                            {getGoogleDriveDirectLink(shopHeroImages[`${cat.slug}/${sub.slug}`] || '') && (
                                                                <img src={getGoogleDriveDirectLink(shopHeroImages[`${cat.slug}/${sub.slug}`] || '')} className="w-full h-full object-cover" alt="" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="url"
                                                        value={shopHeroImages[`${cat.slug}/${sub.slug}`] || ''}
                                                        onChange={e => setShopHeroImages({ ...shopHeroImages, [`${cat.slug}/${sub.slug}`]: e.target.value })}
                                                        className="w-full text-navy-900 dark:text-white px-3 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 focus:border-cyan-500 rounded-lg outline-none text-[10px] font-bold shadow-sm transition-all"
                                                        placeholder={`${sub.name} sub-hero link...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* BENTO GRID SECTION */}
                    <section id="bento" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-orange-500 dark:border-orange-500/50 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl">
                                <Grid size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Department Bento</h2>
                                <p className="text-[10px] font-black text-orange-600/70 dark:text-orange-400/70 uppercase tracking-[0.2em]">Homepage Category Grid</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bentoContent.tiles.map((tile, idx) => (
                                <div key={idx} className="bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 shadow-xl dark:shadow-none hover:shadow-2xl hover:border-orange-100 dark:hover:border-white/20 transition-all group/card">
                                    <div className="flex gap-6">
                                        {/* Image Preview */}
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                            {getGoogleDriveDirectLink(tile.image) && (
                                                <img
                                                    src={getGoogleDriveDirectLink(tile.image)}
                                                    className="w-full h-full object-cover transition-transform group-hover/card:scale-110 duration-700"
                                                    alt=""
                                                />
                                            )}
                                        </div>

                                        {/* Inputs Grouped */}
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tile Label</label>
                                                    <input
                                                        type="text"
                                                        value={tile.title}
                                                        onChange={e => {
                                                            const newTiles = [...bentoContent.tiles];
                                                            newTiles[idx] = { ...newTiles[idx], title: e.target.value };
                                                            setBentoContent({ tiles: newTiles });
                                                        }}
                                                        className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accent Text</label>
                                                    <input
                                                        type="text"
                                                        value={tile.subtitle}
                                                        onChange={e => {
                                                            const newTiles = [...bentoContent.tiles];
                                                            newTiles[idx] = { ...newTiles[idx], subtitle: e.target.value };
                                                            setBentoContent({ tiles: newTiles });
                                                        }}
                                                        className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-orange-500 rounded-xl outline-none text-xs font-bold transition-all shadow-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image Asset URL</label>
                                                <input
                                                    type="url"
                                                    value={tile.image}
                                                    onChange={e => {
                                                        const newTiles = [...bentoContent.tiles];
                                                        newTiles[idx] = { ...newTiles[idx], image: e.target.value };
                                                        setBentoContent({ tiles: newTiles });
                                                    }}
                                                    className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-orange-500 rounded-xl outline-none text-xs font-mono transition-all shadow-sm"
                                                    placeholder="Google Drive link..."
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Landing Page Slug</label>
                                                <input
                                                    type="text"
                                                    value={tile.href}
                                                    onChange={e => {
                                                        const newTiles = [...bentoContent.tiles];
                                                        newTiles[idx] = { ...newTiles[idx], href: e.target.value };
                                                        setBentoContent({ tiles: newTiles });
                                                    }}
                                                    className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-orange-500 rounded-xl outline-none text-xs font-bold transition-all shadow-sm"
                                                    placeholder="/shop/..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SHOP COLLECTIONS SECTION */}
                    <section id="shop" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-blue-600 dark:border-blue-600/50 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                                <ShoppingBag size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Shop Collections</h2>
                                <p className="text-[10px] font-black text-blue-600/70 dark:text-blue-400/70 uppercase tracking-[0.2em]">Main Shop Gallery Cards</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shopCollections.collections.map((col, idx) => (
                                <div key={idx} className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-lg dark:shadow-none hover:shadow-2xl hover:border-blue-100 dark:hover:border-white/20 transition-all group/shopcard">
                                    <div className="h-40 relative bg-gray-900 overflow-hidden">
                                        <img
                                            src={getGoogleDriveDirectLink(col.image)}
                                            className="w-full h-full object-cover opacity-60 transition-transform group-hover/shopcard:scale-110 duration-1000"
                                            alt=""
                                        />
                                        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                            <span className="text-white text-lg font-black tracking-tight leading-none px-2">{col.name}</span>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Collection Image Link</label>
                                            <input
                                                type="url"
                                                value={col.image}
                                                onChange={e => {
                                                    const newCols = [...shopCollections.collections];
                                                    newCols[idx] = { ...newCols[idx], image: e.target.value };
                                                    setShopCollections({ collections: newCols });
                                                }}
                                                className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-blue-600 rounded-xl outline-none text-xs truncate transition-all shadow-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={col.name}
                                                    onChange={e => {
                                                        const newCols = [...shopCollections.collections];
                                                        newCols[idx] = { ...newCols[idx], name: e.target.value };
                                                        setShopCollections({ collections: newCols });
                                                    }}
                                                    className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-blue-600 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Catalog ID</label>
                                                <input
                                                    type="text"
                                                    value={col.slug}
                                                    onChange={e => {
                                                        const newCols = [...shopCollections.collections];
                                                        newCols[idx] = { ...newCols[idx], slug: e.target.value };
                                                        setShopCollections({ collections: newCols });
                                                    }}
                                                    className="w-full text-gray-900 dark:text-gray-500 px-3 py-2 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none text-xs font-mono transition-all opacity-50 select-none pointer-events-none bg-gray-100 dark:bg-slate-900"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Gallery Description</label>
                                            <input
                                                type="text"
                                                value={col.description}
                                                onChange={e => {
                                                    const newCols = [...shopCollections.collections];
                                                    newCols[idx] = { ...newCols[idx], description: e.target.value };
                                                    setShopCollections({ collections: newCols });
                                                }}
                                                className="w-full text-navy-900 dark:text-white px-3 py-2 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-blue-600 rounded-xl outline-none text-xs font-bold transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* LOGIN PANEL SECTION */}
                    <section id="login" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-indigo-500 dark:border-indigo-500/50 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl">
                                <UserCircle size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Login Page</h2>
                                <p className="text-[10px] font-black text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-[0.2em]">Authentication Experience</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl dark:shadow-none overflow-hidden p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-6 space-y-10">
                                    <div className="space-y-6">
                                        <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest block">Carousel Imagery (Min 1, Max 3)</label>
                                        <div className="space-y-3">
                                            {loginContent.visual_urls.map((url, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="relative flex-1">
                                                        <input
                                                            type="url"
                                                            value={url}
                                                            onChange={e => {
                                                                const newUrls = [...loginContent.visual_urls];
                                                                newUrls[idx] = e.target.value;
                                                                setLoginContent({ ...loginContent, visual_urls: newUrls });
                                                            }}
                                                            className="w-full text-navy-900 dark:text-white pl-4 pr-10 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl outline-none font-bold text-sm transition-all shadow-sm"
                                                            placeholder={`Image URL #${idx + 1}`}
                                                        />
                                                        {url && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                                                                {getGoogleDriveDirectLink(url) && (
                                                                    <img src={getGoogleDriveDirectLink(url)} className="w-full h-full object-cover" alt="" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-navy-900 uppercase tracking-widest block">Narrative Headline</label>
                                        <textarea
                                            value={loginContent.headline}
                                            onChange={e => setLoginContent({ ...loginContent, headline: e.target.value })}
                                            rows={4}
                                            className="w-full text-navy-900 dark:text-white px-6 py-4 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg leading-relaxed shadow-sm focus:bg-white dark:focus:bg-slate-950 transition-all"
                                            placeholder="Introduce the brand vibe..."
                                        />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">HTML supported. Use \u003cbr /\u003e for line breaks.</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 flex flex-col gap-4">
                                    <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <Smartphone size={14} className="text-navy-400" />
                                        Visual Mockup
                                    </label>
                                    <div className="relative aspect-video lg:aspect-auto lg:h-[450px] bg-[#1a1a24] dark:bg-slate-950 rounded-[3rem] overflow-hidden border-[12px] border-black dark:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] group">
                                        {/* Background Carousel (Preview first active) */}
                                        <div className="absolute inset-0 z-0">
                                            {loginContent.visual_urls.find(url => url !== '') ? (
                                                <img
                                                    src={getGoogleDriveDirectLink(loginContent.visual_urls.find(url => url !== '') || '')}
                                                    className="w-full h-full object-cover opacity-60"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-navy-900/50" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                        </div>

                                        {/* Brand Elements Mockup */}
                                        <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
                                            <div className="w-12 h-12 bg-white rounded-2xl mb-6 shadow-2xl flex items-center justify-center p-2 opacity-50">
                                                <div className="w-full h-full bg-navy-900 rounded-lg" />
                                            </div>
                                            <div className="max-w-xs space-y-4">
                                                <h4 className="text-white text-3xl font-black leading-[1.1] tracking-tight transition-all duration-700 hover:scale-105 origin-left" dangerouslySetInnerHTML={{ __html: loginContent.headline }} />
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Auth Form Hint */}
                                        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-64 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 hidden md:block shadow-2xl p-6 space-y-3">
                                            <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                                            <div className="h-8 w-full bg-white/5 rounded-xl" />
                                            <div className="h-8 w-full bg-white/5 rounded-xl" />
                                            <div className="h-10 w-full bg-red-600/40 rounded-xl" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Authentication Overlay Pattern</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* SOCIAL LINKS SECTION */}
                    <section id="social_links" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-navy-900 dark:border-white/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-navy-900 dark:bg-white/10 flex items-center justify-center text-white shadow-xl">
                                <Globe size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Social Media</h2>
                                <p className="text-[10px] font-black text-navy-500 dark:text-gray-400 uppercase tracking-[0.2em]">Contact & Socials</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['instagram', 'facebook', 'youtube', 'twitter', 'gmail'] as const).map(platform => (
                                <div key={platform} className="space-y-2">
                                    <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">{platform}</label>
                                    <input
                                        type="text"
                                        value={socialLinks[platform]}
                                        onChange={e => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                                        className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                        placeholder={`Enter ${platform} URL`}
                                    />
                                </div>
                            ))}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="text"
                                    value={socialLinks.phone}
                                    onChange={e => setSocialLinks({ ...socialLinks, phone: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                    placeholder="e.g. +91 9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Secondary Phone</label>
                                <input
                                    type="text"
                                    value={socialLinks.secondaryPhone}
                                    onChange={e => setSocialLinks({ ...socialLinks, secondaryPhone: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Office Address</label>
                                <textarea
                                    value={socialLinks.address || ''}
                                    onChange={e => setSocialLinks({ ...socialLinks, address: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all min-h-[100px]"
                                    placeholder="Enter full office address..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* SUSTAINABILITY SECTION */}
                    <section id="sustainability" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-navy-900 dark:border-white/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-navy-900 dark:bg-white/10 flex items-center justify-center text-white shadow-xl">
                                <Leaf size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Sustainability</h2>
                                <p className="text-[10px] font-black text-navy-500 dark:text-gray-400 uppercase tracking-[0.2em]">Proudly Indian Content</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Proudly Indian Image</label>
                                <input
                                    type="text"
                                    value={sustainabilityContent.proudly_indian_image}
                                    onChange={e => setSustainabilityContent({ ...sustainabilityContent, proudly_indian_image: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                    placeholder="Image URL"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    value={sustainabilityContent.title}
                                    onChange={e => setSustainabilityContent({ ...sustainabilityContent, title: e.target.value })}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-widest">Text</label>
                                <textarea
                                    value={sustainabilityContent.text}
                                    onChange={e => setSustainabilityContent({ ...sustainabilityContent, text: e.target.value })}
                                    rows={4}
                                    className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-white/10 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* PRESS SECTION */}
                    <section id="press" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-navy-900 dark:border-white/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-navy-900 dark:bg-white/10 flex items-center justify-center text-white shadow-xl">
                                <Newspaper size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Press</h2>
                                <p className="text-[10px] font-black text-navy-500 dark:text-gray-400 uppercase tracking-[0.2em]">Media Mentions</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 space-y-6">
                            {pressItems.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-navy-900 dark:text-white">Press Item #{idx + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => setPressItems(pressItems.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:text-red-600 font-bold text-xs uppercase"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Publication Name"
                                            value={item.name}
                                            onChange={e => {
                                                const newItems = [...pressItems];
                                                newItems[idx].name = e.target.value;
                                                setPressItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Logo URL"
                                            value={item.logo}
                                            onChange={e => {
                                                const newItems = [...pressItems];
                                                newItems[idx].logo = e.target.value;
                                                setPressItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Date"
                                            value={item.date}
                                            onChange={e => {
                                                const newItems = [...pressItems];
                                                newItems[idx].date = e.target.value;
                                                setPressItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl"
                                        />
                                        <textarea
                                            placeholder="Quote"
                                            value={item.quote}
                                            onChange={e => {
                                                const newItems = [...pressItems];
                                                newItems[idx].quote = e.target.value;
                                                setPressItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl md:col-span-2"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPressItems([...pressItems, { id: Date.now().toString(), name: '', logo: '', quote: '', date: '' }])}
                                className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-400 font-bold hover:border-navy-500 hover:text-navy-500 transition-colors"
                            >
                                + Add Press Item
                            </button>
                        </div>
                    </section>

                    {/* LOOKBOOK SECTION */}
                    <section id="lookbook" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-navy-900 dark:border-white/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-navy-900 dark:bg-white/10 flex items-center justify-center text-white shadow-xl">
                                <ShoppingBag size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Lookbook</h2>
                                <p className="text-[10px] font-black text-navy-500 dark:text-gray-400 uppercase tracking-[0.2em]">Customer Styles</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 space-y-6">
                            {lookbookItems.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                                        {item.image && <img src={getGoogleDriveDirectLink(item.image)} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL"
                                            value={item.image}
                                            onChange={e => {
                                                const newItems = [...lookbookItems];
                                                newItems[idx].image = e.target.value;
                                                setLookbookItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl"
                                        />
                                        <input
                                            type="text"
                                            placeholder="User Handle"
                                            value={item.user}
                                            onChange={e => {
                                                const newItems = [...lookbookItems];
                                                newItems[idx].user = e.target.value;
                                                setLookbookItems(newItems);
                                            }}
                                            className="w-full text-navy-900 dark:text-white px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setLookbookItems(lookbookItems.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:text-red-600 p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setLookbookItems([...lookbookItems, { id: Date.now().toString(), image: '', user: '' }])}
                                className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-400 font-bold hover:border-navy-500 hover:text-navy-500 transition-colors"
                            >
                                + Add Lookbook Item
                            </button>
                        </div>
                    </section>
                </form >
            </div >

            {/* Floating Mobile/Tablet Save Prompt */}
            < div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-100 dark:border-white/10 flex items-center justify-between lg:hidden z-[100] shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.1)]" >
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Global Status</span>
                    <span className="text-xs font-black text-navy-900 dark:text-white mt-1 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full shadow-sm ${saving ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                        {saving ? 'Syncing Customizations...' : 'Cloud Synced'}
                    </span>
                </div>
                <button
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="bg-navy-900 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all text-sm tracking-widest"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    SYNC NOW
                </button>
            </div >

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slide-in-from-bottom {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes slide-in-from-right {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>

        </div >
    );
}
