'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle, Loader2, Phone, KeyRound, Eye, EyeOff, Sparkles, ChevronLeft } from 'lucide-react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { createClient } from '@/utils/supabase/client';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

type AuthMethod = 'email' | 'phone';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');

    // Phone Auth State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Login Content Config
    const [loginConfig, setLoginConfig] = useState({
        visual_urls: [
            'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'
        ],
        headline: 'Capturing Moments,<br />Creating Memories'
    });

    const [currentIndex, setCurrentIndex] = useState(0);

    // Carousel Logic
    useEffect(() => {
        const validUrls = loginConfig.visual_urls.filter(url => url !== '');
        if (validUrls.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % validUrls.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [loginConfig.visual_urls]);

    // Check if user is already logged in & Fetch Config
    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                window.location.href = '/?login=success';
            } else {
                setCheckingAuth(false);
            }
        };

        const fetchLoginConfig = async () => {
            const { data } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'login_page')
                .single();

            if (data && data.content) {
                setLoginConfig(prev => ({
                    ...prev,
                    ...data.content,
                    visual_urls: data.content.visual_urls || (data.content.visual_url ? [data.content.visual_url, '', ''] : prev.visual_urls)
                }));
            }
        };

        checkExistingSession();
        fetchLoginConfig();
    }, [supabase]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (authMethod === 'phone') {
                if (!otpSent) {
                    const { error } = await supabase.auth.signInWithOtp({
                        phone: phone,
                    });
                    if (error) throw error;
                    setOtpSent(true);
                    setMessage('OTP sent! Please check your mobile.');
                } else {
                    const { error } = await supabase.auth.verifyOtp({
                        phone: phone,
                        token: otp,
                        type: 'sms',
                    });
                    if (error) throw error;
                    window.location.href = '/?login=success';
                }
            } else {
                if (isLogin) {
                    const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (error) throw error;
                    window.location.href = '/?login=success';
                } else {
                    const { error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName,
                                avatar_url: `https://api.dicebear.com/7.x/micah/svg?seed=${fullName}`,
                            },
                        },
                    });
                    if (error) throw error;
                    setMessage('Check your email for the confirmation link!');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google') => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#020617]">
                <Loader2 className="animate-spin text-coral-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] w-full flex items-center justify-center bg-black text-white p-4 md:p-8 font-sans selection:bg-red-500/30 overflow-x-hidden relative">
            {/* Cinematic Red & Black Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Primary Radial Glow */}
                <div
                    className="absolute inset-0 opacity-80"
                    style={{
                        background: 'radial-gradient(circle at 35% 50%, rgba(185, 28, 28, 0.25) 0%, rgba(127, 29, 29, 0.1) 40%, rgba(0, 0, 0, 1) 100%)'
                    }}
                />

                {/* Top-Right Secondary Glow */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(circle at 85% 15%, rgba(185, 28, 28, 0.15) 0%, transparent 50%)'
                    }}
                />

                {/* Micro-Texture Overlay (Low-opacity grain) */}
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl relative z-10 grid grid-cols-1 md:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 font-sans md:h-[min(750px,80vh)]"
            >
                {/* LEFT PANEL: Cinematic Visual */}
                <div className="relative hidden md:flex flex-col justify-between p-12 order-1 h-full">
                    {/* Background Visual Carousel */}
                    <div className="absolute inset-0 z-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={getGoogleDriveDirectLink(loginConfig.visual_urls.filter(url => url !== '')[currentIndex] || loginConfig.visual_urls[0]) || '/images/placeholder.jpg'}
                                    alt="Visual"
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized={loginConfig.visual_urls[currentIndex]?.startsWith('http')}
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-end">
                        <Link href="/" className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                            Back to website <ArrowRight size={12} />
                        </Link>
                    </div>

                    {/* Narrative Text - Removed Headline as requested */}
                    <div className="relative z-10 max-w-sm">
                        {/* Carousel Indicators */}
                        <div className="flex gap-2">
                            {loginConfig.visual_urls.filter(url => url !== '').map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`h-[2px] rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-white' : 'w-6 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Form */}
                <div className="p-8 md:p-12 lg:p-16 bg-[#0c0c0e] flex flex-col justify-center order-2 h-full overflow-y-auto">
                    <div className="max-w-md mx-auto w-full py-4">
                        <header className="mb-6 md:mb-10">
                            <h1 className="text-3xl md:text-5xl font-semibold mb-3 md:mb-4 tracking-tight">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h1>
                            <p className="text-white/40 text-sm font-medium">
                                {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="ml-2 text-red-600 hover:text-red-500 font-bold transition-colors underline underline-offset-4"
                                >
                                    {isLogin ? 'Create new account' : 'Log in'}
                                </button>
                            </p>
                        </header>

                        {/* Notifications */}
                        <AnimatePresence mode="wait">
                            {(error || message) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`mb-8 p-4 rounded-xl border flex items-start gap-4 text-xs font-bold ${error
                                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                        : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                        }`}
                                >
                                    {error ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle size={16} className="shrink-0" />}
                                    <p className="leading-relaxed">{error || message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Auth Form */}
                        <form className="space-y-6" onSubmit={handleAuth}>
                            {!isLogin && authMethod === 'email' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            value={fullName.split(' ')[0] || ''}
                                            onChange={(e) => setFullName(`${e.target.value} ${fullName.split(' ')[1] || ''}`)}
                                            required={!isLogin}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-red-600/50 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            value={fullName.split(' ')[1] || ''}
                                            onChange={(e) => setFullName(`${fullName.split(' ')[0] || ''} ${e.target.value}`)}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-red-600/50 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-red-600/50 transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-red-600/50 transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-[18px] bg-red-700 hover:bg-red-800 text-white font-bold text-base rounded-[14px] transition-all shadow-lg shadow-red-500/10 disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                {loading ? <Loader2 size={22} className="animate-spin" /> : (
                                    <>{isLogin ? 'Log in' : 'Create account'}</>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-12 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-white/20">
                                <span className="bg-[#0c0c0e] px-4">Or register with</span>
                            </div>
                        </div>

                        {/* Side-by-side Social */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-2 py-[18px] bg-transparent border border-white/10 rounded-[14px] hover:bg-white/5 transition-all group"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-sm font-semibold text-white">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 py-[18px] bg-transparent border border-white/10 rounded-[14px] hover:bg-white/5 transition-all group"
                            >
                                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert opacity-100" alt="Apple" />
                                <span className="text-sm font-semibold text-white">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
