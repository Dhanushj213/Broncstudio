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
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] text-white p-4 font-sansSelection">
            {/* Dynamic Mesh Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        x: [0, -100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-coral-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, 50, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"
                />
            </div>

            <Link href="/" className="absolute top-8 left-8 z-50 group flex items-center gap-2 text-white/40 hover:text-white transition-all cursor-pointer">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase">Back</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl relative z-10"
            >
                {/* Main Card */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-[40px] border border-white/20 bg-black/40 backdrop-blur-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">

                    {/* LEFT PANEL */}
                    <div className="relative p-12 hidden md:flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />

                        {/* Animated Visual Element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20 pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full border-[1px] border-dashed border-white rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border-[1px] border-dashed border-coral-500 rounded-full"
                            />
                        </div>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="h-10 w-auto aspect-[4/1] mb-12"
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
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tighter">
                                        {isLogin ? (
                                            <>Experience <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-500">The Archive.</span></>
                                        ) : (
                                            <>Join The <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Vanguard.</span></>
                                        )}
                                    </h1>
                                    <p className="text-lg text-white/50 max-w-sm leading-relaxed font-medium">
                                        {isLogin
                                            ? "Access your curated collections and personalized drops. Exclusive gear is waiting for you."
                                            : "Elevate your journey with early access and member-only releases. The future of style starts here."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="relative z-10 flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Premium Craftsmanship</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>Worldwide Access</span>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="p-8 md:p-16 flex flex-col justify-center bg-white/[0.02] border-l border-white/5 relative overflow-hidden">

                        {/* Interactive Sparkle Decoration */}
                        <motion.div
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-10 right-10 text-coral-500/30"
                        >
                            <Sparkles size={40} />
                        </motion.div>

                        <div className="text-center mb-10 md:hidden">
                            <div className="relative h-10 w-40 mx-auto mb-6">
                                <Image src="/broncnamey.png" alt="Broncstudio" fill className="object-contain" priority />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        </div>

                        {/* Custom Tab Switcher */}
                        <div className="flex p-1.5 bg-white/5 rounded-2xl mb-10 border border-white/10 relative shadow-inner">
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-tr from-white/10 to-white/20 backdrop-blur-md border border-white/20 shadow-lg"
                                initial={false}
                                animate={{
                                    left: authMethod === 'email' ? '6px' : '50%',
                                    width: 'calc(50% - 6px)',
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <button
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-all duration-300 ${authMethod === 'email' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                                onClick={() => { setAuthMethod('email'); setError(null); }}
                            >
                                Email Access
                            </button>
                            <button
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-all duration-300 ${authMethod === 'phone' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                                onClick={() => { setAuthMethod('phone'); setError(null); }}
                            >
                                Secure SMS
                            </button>
                        </div>

                        {/* Error/Success Feedbacks */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs font-bold leading-relaxed"
                                >
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-start gap-3 text-xs font-bold leading-relaxed"
                                >
                                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleAuth}>
                            <AnimatePresence mode="wait">
                                {authMethod === 'email' ? (
                                    <motion.div
                                        key="email-form"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {!isLogin && (
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-coral-400 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="FULL NAME"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required={!isLogin}
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-coral-500/50 focus:bg-white/10 transition-all font-bold text-sm tracking-tight"
                                                />
                                            </div>
                                        )}
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-coral-400 transition-colors" size={18} />
                                            <input
                                                type="email"
                                                placeholder="EMAIL ADDRESS"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-coral-500/50 focus:bg-white/10 transition-all font-bold text-sm tracking-tight"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-coral-400 transition-colors" size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="PASSWORD"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-coral-500/50 focus:bg-white/10 transition-all font-bold text-sm tracking-tight"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="phone-form"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-coral-400 transition-colors" size={18} />
                                            <input
                                                type="tel"
                                                placeholder="+91 MOBILE NUMBER"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                disabled={otpSent}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-coral-500/50 focus:bg-white/10 transition-all font-bold text-sm tracking-tight disabled:opacity-50"
                                            />
                                        </div>
                                        {otpSent && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <div className="relative group">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-coral-400 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="VERIFICATION CODE"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-coral-500/50 focus:bg-white/10 transition-all font-bold text-sm tracking-tight"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isLogin && authMethod === 'email' && (
                                <div className="text-right">
                                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-coral-400 transition-colors">Recover Password</button>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full group relative overflow-hidden bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] disabled:opacity-50 mt-4"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            {authMethod === 'phone'
                                                ? (otpSent ? 'Authenticate' : 'Send Code')
                                                : (isLogin ? 'Sign In' : 'Initialize')
                                            }
                                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-coral-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    initial={false}
                                />
                                <span className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-300" />
                                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                        <div className="flex items-center gap-3">
                                            {authMethod === 'phone' ? (otpSent ? 'Authenticate' : 'Send Code') : (isLogin ? 'Sign In' : 'Initialize')}
                                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    )}
                                </span>
                            </motion.button>
                        </form>

                        {/* Social */}
                        <div className="mt-10 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center uppercase">
                                <span className="bg-[#020617]/0 px-4 text-[10px] font-black text-white/20 tracking-[0.3em] backdrop-blur-md">Secure Login</span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOAuth('google')}
                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs group"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-white/60 group-hover:text-white uppercase tracking-widest">Google</span>
                            </motion.button>
                        </div>

                        {/* Toggle */}
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                    setMessage(null);
                                    setAuthMethod('email');
                                }}
                                className="group inline-flex flex-col items-center"
                            >
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                                    {isLogin ? "Need an invitation?" : "Returning member?"}
                                </span>
                                <span className="text-sm font-black text-white group-hover:text-coral-400 transition-colors uppercase tracking-widest">
                                    {isLogin ? "Join The Archive" : "Secure Login"}
                                </span>
                                <div className="w-0 group-hover:w-full h-[2px] bg-coral-500 mt-1 transition-all duration-500" />
                            </button>
                        </div>

                    </div>
                </div>

                <div className="mt-12 flex justify-between items-center text-[10px] font-black text-white/10 uppercase tracking-[0.3em] px-8">
                    <span>© {new Date().getFullYear()} BRONC STUDIO</span>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
