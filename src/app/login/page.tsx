'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Github, AlertCircle, CheckCircle, Loader2, Phone, KeyRound, Eye, EyeOff, Sparkles } from 'lucide-react';
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

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] text-white p-4">
            <AmbientBackground />

            {/* Vivid Cinematic Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-purple-900/20 to-coral-900/20 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-coral-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-700" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl relative z-10"
            >
                {/* Premium Wide Glass Card */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-[30px] border border-white/30 bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(255,255,255,0.15)] overflow-hidden">

                    {/* LEFT SIDE: Brand & Visuals */}
                    <div className="relative p-8 md:p-12 hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-800/20 md:min-h-[600px]">
                        {/* Decorative Background for Left Panel */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <Link href="/">
                                <div className="relative h-12 w-auto aspect-[4/1] mb-8 transition-transform hover:scale-105 duration-300 origin-left">
                                    <Image
                                        src="/broncnamey.png"
                                        alt="Broncstudio"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                    />
                                </div>
                            </Link>

                            <motion.div
                                key={isLogin ? 'login-text' : 'signup-text'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                                className="mt-8"
                            >
                                <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6">
                                    {isLogin ? (
                                        <>
                                            The Archive <br />
                                            <span className="text-coral-400">Awaits.</span>
                                        </>
                                    ) : (
                                        <>
                                            Don't Miss <br />
                                            <span className="text-cyan-400">the Drop.</span>
                                        </>
                                    )}
                                </h1>
                                <p className="text-lg text-white/70 max-w-sm leading-relaxed">
                                    {isLogin
                                        ? 'Sign in to access your saved styles and exclusive drops. High-demand items are moving fast—secure yours now.'
                                        : 'Join the inner circle for priority access. Our limited collections sell out in minutes—be the first to shop.'}
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Form */}
                    <div className="p-8 md:p-12 bg-black/20 flex flex-col justify-center">

                        <div className="text-center mb-8 md:hidden">
                            <Link href="/">
                                <div className="relative h-12 w-48 mx-auto mb-6">
                                    <Image
                                        src="/broncstudioyellowname.png"
                                        alt="Broncstudio"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </Link>
                            <h2 className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                        </div>

                        {/* Auth Method Selector (Glass Tabs) */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/5 relative">
                            <motion.div
                                className="absolute top-1 bottom-1 rounded-lg bg-indigo-500/40 border border-white/10 shadow-sm"
                                initial={false}
                                animate={{
                                    left: authMethod === 'email' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)',
                                    x: authMethod === 'email' ? 0 : 0
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />

                            <button
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${authMethod === 'email' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                onClick={() => { setAuthMethod('email'); setError(null); }}
                            >
                                Email
                            </button>
                            <button
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${authMethod === 'phone' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                onClick={() => { setAuthMethod('phone'); setError(null); }}
                            >
                                Phone
                            </button>
                        </div>

                        {/* Form Area */}
                        <form className="space-y-5" onSubmit={handleAuth}>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium overflow-hidden mb-4"
                                    >
                                        <AlertCircle size={14} className="shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium overflow-hidden mb-4"
                                    >
                                        <CheckCircle size={14} className="shrink-0" />
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email Auth Fields */}
                            {authMethod === 'email' && (
                                <div className="space-y-4">
                                    {!isLogin && (
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required={!isLogin}
                                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                                            />
                                        </div>
                                    )}
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Phone Auth Fields */}
                            {authMethod === 'phone' && (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number (e.g. +91 ...)"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            disabled={otpSent}
                                            className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm disabled:opacity-50"
                                        />
                                    </div>
                                    {otpSent && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <div className="relative group mt-4">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {isLogin && authMethod === 'email' && (
                                <div className="text-right">
                                    <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Forgot Password?</a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-coral-500 to-pink-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(255,100,100,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        {authMethod === 'phone'
                                            ? (otpSent ? 'Verify OTP' : 'Send Code')
                                            : (isLogin ? 'Sign In' : 'Get Started')
                                        }
                                        {!loading && <ArrowRight size={18} />}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative bg-transparent px-4">
                                <span className="text-xs text-white/30 bg-[#0A101D]/0 backdrop-blur-md px-2 rounded">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Auth */}
                        <button
                            onClick={() => handleOAuth('google')}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all bg-white/5 group"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity" alt="Google" />
                            <span className="font-bold text-white/90 text-sm group-hover:text-white">Google</span>
                        </button>

                        {/* Toggle Login/Signup */}
                        <div className="mt-6 text-center">
                            <p className="text-white/40 text-sm">
                                {isLogin ? "New to Broncstudio? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setMessage(null);
                                        setAuthMethod('email');
                                    }}
                                    className="text-white font-bold hover:underline hover:text-coral-400 transition-colors ml-1"
                                >
                                    {isLogin ? "Create Account" : "Sign In"}
                                </button>
                            </p>
                        </div>

                    </div>

                    {/* Decorative Bottom Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
                </div>

                {/* Copyright / Footer */}
                <p className="text-center text-white/20 text-xs mt-8">
                    &copy; {new Date().getFullYear()} Broncstudio. All rights reserved.
                </p>

            </motion.div>
        </div>
    );
}
