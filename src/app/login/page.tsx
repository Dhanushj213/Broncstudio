'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Github } from 'lucide-react';
import AmbientBackground from '@/components/UI/AmbientBackground';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-[#FAF9F7] grid grid-cols-1 md:grid-cols-2">
            <AmbientBackground />

            {/* Left: Brand Visual (Visible on Desktop) */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-navy-900 relative overflow-hidden text-white">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <img src="/BroncStudio-Light.png" alt="Broncstudio" className="h-8 w-auto brightness-0 invert" />
                        <span className="font-heading font-bold text-xl">Broncstudio.</span>
                    </Link>
                    <h1 className="text-5xl font-heading font-bold leading-tight mb-6">
                        {isLogin ? "Welcome back, Legend." : "Join the Adventure."}
                    </h1>
                    <p className="text-white/70 max-w-md text-lg">
                        {isLogin
                            ? "Sign in to track your orders, manage your wishlist, and access exclusive drops."
                            : "Create an account to start your journey with Broncstudio. Rewards await!"}
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex -space-x-4 mb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-navy-900 bg-gray-200 overflow-hidden">
                                <img src={`https://source.unsplash.com/random/100x100?face,child,${i}`} alt="User" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-navy-900 bg-coral-500 text-white flex items-center justify-center text-xs font-bold">+2k</div>
                    </div>
                    <p className="text-sm text-white/60">Join 2,000+ parents crafting memories.</p>
                </div>

                {/* Abstract Circles */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Right: Form */}
            <div className="flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="md:hidden flex items-center gap-2 mb-8 justify-center">
                        <span className="font-heading font-bold text-2xl text-navy-900">Broncstudio.</span>
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-navy-900 mb-2">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin ? "New here? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-coral-500 font-bold hover:underline"
                            >
                                {isLogin ? "Create an account" : "Log in"}
                            </button>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all"
                            />
                        </div>

                        {isLogin && (
                            <div className="text-right">
                                <a href="#" className="text-sm text-gray-500 hover:text-navy-900">Forgot Password?</a>
                            </div>
                        )}

                        <Link href="/profile" className="block w-full">
                            <button className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} />
                            </button>
                        </Link>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#FAF9F7] text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-white transition-all bg-white/50">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="font-bold text-navy-900 text-sm">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-white transition-all bg-white/50">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                            <span className="font-bold text-navy-900 text-sm">Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
