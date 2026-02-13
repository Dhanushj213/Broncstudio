'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle, Loader2, Phone, KeyRound, Eye, EyeOff, Sparkles, ChevronLeft } from 'lucide-react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { createClient } from '@/utils/supabase/client';

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

    // Check if user is already logged in
    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                window.location.href = '/?login=success';
            } else {
                setCheckingAuth(false);
            }
        };
        checkExistingSession();
    }, [supabase.auth]);

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
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] text-white p-4 font-sans">
            {/* Elegant Background Mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-gradient-to-br from-indigo-900/30 to-transparent rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1.1, 1, 1.1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tl from-coral-900/20 to-transparent rounded-full blur-[140px]"
                />
            </div>

            {/* Subtle Back Button */}
            <Link href="/" className="absolute top-10 left-10 z-50 group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300">
                <div className="p-2.5 rounded-full bg-white/5 border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all">
                    <ChevronLeft size={18} />
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">Portal</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl relative z-10"
            >
                {/* Refined Main Card */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-[40px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden">

                    {/* LEFT PANEL: Narrative */}
                    <div className="relative p-12 lg:p-16 hidden md:flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            {/* FIXED LOGO CONTAINER */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative h-14 w-48 mb-16"
                            >
                                <Image
                                    src="/broncnamey.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isLogin ? 'login' : 'signup'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] mb-8 tracking-[-0.03em]">
                                        {isLogin ? (
                                            <>The Archive <br /><span className="text-coral-500">Awaits.</span></>
                                        ) : (
                                            <>Join The <br /><span className="text-cyan-400">Vanguard.</span></>
                                        )}
                                    </h1>
                                    <p className="text-base lg:text-lg text-white/40 max-w-sm leading-relaxed font-medium">
                                        {isLogin
                                            ? "Re-enter the studio to access your curated selections and personalized style profiles."
                                            : "Unlock priority access to our most sought-after drops and limited edition collections."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="relative z-10 flex items-center gap-6 text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">
                            <span className="flex items-center gap-2"><Sparkles size={12} /> Established MMXXIV</span>
                            <span className="w-px h-3 bg-white/10" />
                            <span>Bronc Studio Premium</span>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Authentication */}
                    <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-white/[0.01] border-l border-white/5 relative">

                        <div className="text-center mb-10 md:hidden">
                            <div className="relative h-8 w-32 mx-auto mb-8">
                                <Image src="/broncnamey.png" alt="Broncstudio" fill className="object-contain" priority />
                            </div>
                        </div>

                        {/* Modern Tab System */}
                        <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl mb-12 shadow-inner">
                            <button
                                type="button"
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${authMethod === 'email' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                onClick={() => { setAuthMethod('email'); setError(null); }}
                            >
                                Email
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${authMethod === 'phone' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                onClick={() => { setAuthMethod('phone'); setError(null); }}
                            >
                                Secure SMS
                            </button>
                        </div>

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

                        {/* Main Form */}
                        <form className="space-y-4" onSubmit={handleAuth}>
                            <AnimatePresence mode="wait">
                                {authMethod === 'email' ? (
                                    <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        {!isLogin && (
                                            <div className="group relative">
                                                <input
                                                    type="text"
                                                    placeholder="NAME"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required={!isLogin}
                                                    className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-coral-500/50 focus:bg-white/[0.05] transition-all font-bold text-xs tracking-widest"
                                                />
                                            </div>
                                        )}
                                        <div className="group relative">
                                            <input
                                                type="email"
                                                placeholder="EMAIL ADDRESS"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-coral-500/50 focus:bg-white/[0.05] transition-all font-bold text-xs tracking-widest"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="PASSWORD"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full pl-6 pr-14 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-coral-500/50 focus:bg-white/[0.05] transition-all font-bold text-xs tracking-widest"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <input
                                            type="tel"
                                            placeholder="+91 NUMBER"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            disabled={otpSent}
                                            className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-coral-500/50 transition-all font-bold text-xs tracking-widest disabled:opacity-40"
                                        />
                                        {otpSent && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <input
                                                    type="text"
                                                    placeholder="OTP CODE"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    required
                                                    className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-coral-500/50 transition-all font-bold text-xs tracking-widest"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isLogin && authMethod === 'email' && (
                                <div className="flex justify-end pt-1">
                                    <button type="button" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-coral-400 transition-colors">Forgot Credentials?</button>
                                </div>
                            )}

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl relative overflow-hidden group shadow-2xl disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {authMethod === 'phone' ? (otpSent ? 'Login' : 'Send OTP') : (isLogin ? 'Sign In' : 'Create')}
                                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-coral-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                        <div className="flex items-center gap-4">
                                            {authMethod === 'phone' ? (otpSent ? 'Login' : 'Send OTP') : (isLogin ? 'Sign In' : 'Create')}
                                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                                        </div>
                                    )}
                                </span>
                            </motion.button>
                        </form>

                        {/* Social / Footer */}
                        <div className="mt-12 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-full bg-white/5" />
                                <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] whitespace-nowrap">Secure Gateway</span>
                                <div className="h-px w-full bg-white/5" />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" alt="Google" />
                                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] transition-colors">Continue with Google</span>
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setMessage(null);
                                        setAuthMethod('email');
                                    }}
                                    className="group inline-flex flex-col items-center gap-2"
                                >
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] transition-colors group-hover:text-white/40">
                                        {isLogin ? "No account yet?" : "Already a member?"}
                                    </span>
                                    <span className="text-xs font-black text-white group-hover:text-coral-500 transition-colors uppercase tracking-[0.2em] border-b border-white/10 pb-1">
                                        {isLogin ? "Request Access" : "Secure Portal"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-between items-center text-[9px] font-black text-white/10 uppercase tracking-[0.4em] px-10">
                    <span>© {new Date().getFullYear()} Studio Bronc</span>
                    <div className="flex gap-10">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
