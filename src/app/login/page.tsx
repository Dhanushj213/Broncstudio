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
        visual_url: '/Users/dhanushj/.gemini/antigravity/brain/b811564d-9b17-4d46-a976-b5e4a4c7d8d4/login_visual_desert_twilight_final_1770993851502.png',
        headline: 'Capturing Moments,<br />Creating Memories'
    });

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
                    ...data.content
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
        <div className="min-h-screen w-full flex items-center justify-center bg-[#13131a] text-white p-4 md:p-8 font-sans selection:bg-indigo-500/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-6xl relative z-10 grid grid-cols-1 md:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5"
            >
                {/* LEFT PANEL: Cinematic Visual */}
                <div className="relative hidden md:flex flex-col justify-between p-12 min-h-[700px]">
                    {/* Background Visual */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={getGoogleDriveDirectLink(loginConfig.visual_url)}
                            alt="Visual"
                            fill
                            className="object-cover"
                            priority
                            unoptimized={loginConfig.visual_url.startsWith('http')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                    </div>

                    {/* Left Header */}
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative h-6 w-24">
                                <Image src="/broncnamey.png" alt="Bronc" fill className="object-contain object-left" />
                            </div>
                        </div>
                        <Link href="/" className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                            Back to website <ArrowRight size={12} />
                        </Link>
                    </div>

                    {/* Narrative Text */}
                    <div className="relative z-10 max-w-sm">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-semibold leading-tight mb-8 tracking-[-0.02em]"
                            dangerouslySetInnerHTML={{ __html: loginConfig.headline }}
                        />

                        {/* Carousel Indicators (Static Mock) */}
                        <div className="flex gap-2">
                            <div className="h-[2px] w-6 bg-white/40 rounded-full" />
                            <div className="h-[2px] w-6 bg-white/40 rounded-full" />
                            <div className="h-[2px] w-12 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Form */}
                <div className="p-8 md:p-16 lg:p-20 bg-[#1a1a24] flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <header className="mb-10">
                            <h1 className="text-4xl font-semibold mb-3 tracking-tight">
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
                                    className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline underline-offset-4"
                                >
                                    {isLogin ? 'Join The Archive' : 'Log in'}
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
                        <form className="space-y-5" onSubmit={handleAuth}>
                            {!isLogin && authMethod === 'email' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            value={fullName.split(' ')[0] || ''}
                                            onChange={(e) => setFullName(`${e.target.value} ${fullName.split(' ')[1] || ''}`)}
                                            required={!isLogin}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            value={fullName.split(' ')[1] || ''}
                                            onChange={(e) => setFullName(`${fullName.split(' ')[0] || ''} ${e.target.value}`)}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm font-medium"
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
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm font-medium"
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
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {!isLogin && (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" required className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all" />
                                        <CheckCircle size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                        I agree to the <Link href="/terms" className="underline underline-offset-2 hover:text-white">Terms & Conditions</Link>
                                    </span>
                                </label>
                            )}

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                    <>{isLogin ? 'Log in' : 'Create account'}</>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-10 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-white/20">
                                <span className="bg-[#1a1a24] px-4">Or register with</span>
                            </div>
                        </div>

                        {/* Side-by-side Social */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-xs font-bold text-white group-hover:text-white transition-colors">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert opacity-80 group-hover:opacity-100" alt="Apple" />
                                <span className="text-xs font-bold text-white group-hover:text-white transition-colors">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Global Footer (Subtle) */}
            <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between items-center text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] px-12 pointer-events-none">
                <span className="pointer-events-auto">© {new Date().getFullYear()} Broncstudio Archive</span>
                <div className="flex gap-10 pointer-events-auto">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}
