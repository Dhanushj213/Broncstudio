'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { Settings, ShieldCheck, Cpu, ArrowRight, Instagram, Facebook, Youtube, Twitter, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function ConstructionPage() {
    const [message, setMessage] = useState('We’re Crafting Something Powerful.');
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: '',
        gmail: '',
        phone: '',
        secondaryPhone: ''
    });

    // Camera Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Transforms
    const panelX = useTransform(springX, (t: number) => t * -0.015);
    const panelY = useTransform(springY, (t: number) => t * -0.015);
    const sculptureRotateX = useTransform(springY, (t: number) => t * -0.04);
    const sculptureRotateY = useTransform(springX, (t: number) => t * 0.04);
    const cursorLightX = useTransform(springX, (t: number) => t + (typeof window !== 'undefined' ? window.innerWidth / 2 : 0));
    const cursorLightY = useTransform(springY, (t: number) => t + (typeof window !== 'undefined' ? window.innerHeight / 2 : 0));

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase
                .from('site_settings')
                .select('maintenance_message')
                .single();
            if (data?.maintenance_message) {
                setMessage(data.maintenance_message);
            }

            const { data: socialData } = await supabase
                .from('content_blocks')
                .select('*')
                .eq('section_id', 'global_social_links')
                .single();
            if (socialData && socialData.content) {
                setSocialLinks(socialData.content);
            }

            setLoading(false);
        }
        fetchSettings();

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (loading) return null;

    return (
        <motion.div
            initial={{ filter: 'blur(30px) brightness(0.5)', opacity: 0 }}
            animate={{ filter: 'blur(0px) brightness(1)', opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-[100dvh] w-full bg-[#070709] flex relative overflow-hidden font-sans cursor-default"
        >
            {/* SVG Filter for Liquid Gooeiness */}
            <svg width="0" height="0" className="absolute hidden pointer-events-none">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 45 -20" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Ambient Background & Cursor Light */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-30">
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dlbvga8v6/image/upload/v1615701800/noise_pc0ooy.png')] opacity-[0.04] mix-blend-overlay" />
                <motion.div
                    className="absolute w-[60vw] h-[60vw] rounded-full bg-coral-500/5 blur-[120px] mix-blend-screen"
                    style={{ x: cursorLightX, y: cursorLightY, translateX: '-50%', translateY: '-50%' }}
                />
            </div>

            {/* 🔲 LEFT: GLASS INFORMATION PANEL */}
            <div className="absolute lg:relative inset-0 w-full lg:w-[45%] flex flex-col justify-center p-6 sm:p-10 md:p-14 z-20 bg-black/40 lg:bg-gradient-to-r from-black/80 to-transparent backdrop-blur-md lg:backdrop-blur-[2px]">
                <motion.div
                    style={{ x: panelX, y: panelY }}
                    className="w-full max-w-[540px] mx-auto lg:mx-0 flex flex-col justify-center"
                >
                    <div className="mb-6 lg:mb-8 shrink-0">
                        <Image
                            src="/whitelogo.png"
                            alt="Bronc Studio"
                            width={120}
                            height={34}
                            className="opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                        />
                    </div>

                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-black/40 border border-white/[0.08] rounded-full mb-4 lg:mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md shrink-0 self-start">
                        <span className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                        <span className="text-[9px] font-black tracking-[0.25em] text-[#CFCFD3] uppercase">Precision Calibration Active</span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl xl:text-[3rem] font-bold text-white mb-3 lg:mb-4 tracking-[-0.02em] leading-[1.05] hmc-text-glow shrink-0">
                        {message}
                    </h1>

                    <p className="text-[#8A8F98] text-sm lg:text-base font-light leading-[1.5] mb-6 lg:mb-8 tracking-wide max-w-md shrink-0">
                        Our foundational architecture is undergoing severe modifications. Site access is deliberately restricted during this phase of elite engineering.
                    </p>

                    {/* 🛠 SKEUOMORPHIC LIVING SCALER */}
                    <div className="mb-6 lg:mb-8 shrink-0">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#8A8F98]">Network Resonance</span>
                            <span className="text-white font-bold text-[10px] tracking-widest uppercase">Stabilizing</span>
                        </div>

                        <div className="h-4 w-full bg-[#040405] rounded-full p-[2px] shadow-[inset_0_2px_8px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.04] relative group overflow-hidden">
                            {/* Liquid Energy Track */}
                            <motion.div
                                animate={{
                                    width: ['30%', '80%', '45%', '90%', '60%'],
                                    backgroundColor: ['#1E3A8A', '#3C82F6', '#EF4444', '#3C82F6', '#1E3A8A']
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                                className="h-full rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(60,130,246,0.6)]"
                            >
                                <motion.div
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-6 lg:pt-8 border-t border-white/[0.06] mb-6 lg:mb-8 shrink-0">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.1] to-black flex items-center justify-center border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.6)] shrink-0">
                                <ShieldCheck size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            </div>
                            <div>
                                <h4 className="text-white text-[10px] lg:text-[11px] font-black tracking-widest uppercase mb-1">Fortified Cipher</h4>
                                <p className="text-[#8A8F98] text-[11px] lg:text-xs font-medium leading-snug">Multi-layer encryption sequences active.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.1] to-black flex items-center justify-center border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.6)] shrink-0">
                                <Cpu size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            </div>
                            <div>
                                <h4 className="text-white text-[10px] lg:text-[11px] font-black tracking-widest uppercase mb-1">Logic Array</h4>
                                <p className="text-[#8A8F98] text-[11px] lg:text-xs font-medium leading-snug">Rerouting cognitive pathways.</p>
                            </div>
                        </div>
                    </div>

                    {/* EMAIL NOTIFICATION / QUERY FIELD */}
                    <div className="relative z-10 w-full shrink-0">
                        <AnimatePresence mode="wait">
                            {!isSubscribed ? (
                                <motion.form
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}
                                    className="flex flex-col sm:flex-row gap-3 w-full"
                                >
                                    <div className="relative group/input flex-1">
                                        <input
                                            type="email"
                                            placeholder="Leave a query or notify me..."
                                            className="w-full h-full bg-black/30 border border-white/10 rounded-xl py-3.5 px-6 outline-none text-white focus:border-[#3C82F6]/40 transition-all font-light placeholder:text-[#8A8F98] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] text-sm"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-8 bg-[#3C82F6] text-white font-semibold text-sm py-4 sm:py-0 rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_4px_14px_rgba(60,130,246,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] active:translate-y-[2px] active:shadow-[0_1px_2px_rgba(60,130,246,0.25),inset_0_2px_4px_rgba(0,0,0,0.2)] flex justify-center items-center gap-2 overflow-hidden group/btn relative"
                                    >
                                        <span className="relative z-10 whitespace-nowrap">SEND</span>
                                        <ArrowRight size={14} className="relative z-10 transition-transform group-hover/btn:translate-x-1" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center sm:text-left flex items-center gap-4 py-4 px-6 bg-[#3C82F6]/10 border border-[#3C82F6]/30 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#3C82F6] flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[#3C82F6] font-bold text-xs uppercase tracking-widest mb-0.5">Transmission Received</div>
                                        <p className="text-[#CFCFD3] text-xs">Your inquiry has been logged securely. We will respond shortly.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* SOCIAL LINKS (BOTTOM CORNER / UNDER FORM) */}
                    <div className="mt-8 lg:mt-12 hidden">
                        {/* REPLACED BY FIXED CONTAINER BELOW */}
                    </div>
                </motion.div>
            </div>

            {/* Fixed Social Links */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="fixed bottom-6 lg:bottom-1/2 lg:translate-y-1/2 left-1/2 lg:left-auto lg:right-8 -translate-x-1/2 lg:translate-x-0 flex lg:flex-col gap-4 lg:gap-5 z-50 items-center pointer-events-auto"
            >
                {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 lg:bg-transparent p-2.5 lg:p-0 rounded-full lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-none flex items-center justify-center">
                        <Instagram size={18} />
                    </a>
                )}
                {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 lg:bg-transparent p-2.5 lg:p-0 rounded-full lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-none flex items-center justify-center">
                        <Facebook size={18} />
                    </a>
                )}
                {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 lg:bg-transparent p-2.5 lg:p-0 rounded-full lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-none flex items-center justify-center">
                        <Youtube size={18} />
                    </a>
                )}
                {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 lg:bg-transparent p-2.5 lg:p-0 rounded-full lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-none flex items-center justify-center">
                        <Twitter size={18} />
                    </a>
                )}
                {socialLinks.gmail && (
                    <a href={`mailto:${socialLinks.gmail}`} className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 lg:bg-transparent p-2.5 lg:p-0 rounded-full lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-none flex items-center justify-center">
                        <Mail size={18} />
                    </a>
                )}
            </motion.div>

            {/* 💎 RIGHT: ARTISTIC LIQUID CHROME GOO */}
            <div className="absolute lg:relative inset-0 w-full lg:w-[55%] h-[100dvh] flex items-center justify-center bg-[#070709] overflow-hidden lg:shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-10 lg:border-l border-white/[0.03]">

                {/* 3D Model Lighting Setup */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(60,130,246,0.15)_0%,transparent_50%)] mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(239,68,68,0.1)_0%,transparent_50%)] mix-blend-screen pointer-events-none" />

                <motion.div
                    style={{
                        rotateX: sculptureRotateX,
                        rotateY: sculptureRotateY,
                        z: 100
                    }}
                    className="relative w-[400px] h-[400px] md:w-[600px] md:h-[600px] perspective-1000 flex items-center justify-center"
                >
                    {/* Shadow underneath the sculpture */}
                    <div className="absolute bottom-[10%] w-[50%] h-10 bg-black blur-xl rounded-[100%] scale-y-50 shadow-[0_0_50px_rgba(0,0,0,1)] z-0" />

                    {/* ACTUAL SVG GOOEY CONTAINER (The Artistic Magic) */}
                    <motion.div
                        style={{ filter: "url(#goo)" }}
                        className="relative w-full h-full flex items-center justify-center z-10 opacity-90"
                    >
                        {/* Central Hub */}
                        <div className="absolute w-[30%] h-[30%] bg-gradient-to-tr from-[#111] to-[#333] rounded-[45%] shadow-[inset_20px_20px_40px_rgba(255,255,255,0.1),inset_-20px_-20px_40px_rgba(0,0,0,0.8)] z-20 flex items-center justify-center">
                            <Settings size={60} strokeWidth={1} className="text-white/20 animate-spin-slow" />
                        </div>

                        {/* Orbiting Goo Blob 1 */}
                        <motion.div
                            animate={{
                                x: [100, -100, -150, 150, 100],
                                y: [-150, -100, 150, 100, -150],
                                scale: [1, 1.5, 0.8, 1.2, 1]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[25%] h-[25%] bg-gradient-to-tr from-[#000] to-coral-900 rounded-full shadow-[inset_10px_10px_20px_rgba(255,255,255,0.2)]"
                        />
                        {/* Orbiting Goo Blob 2 */}
                        <motion.div
                            animate={{
                                x: [-120, 150, 100, -100, -120],
                                y: [100, 150, -100, -150, 100],
                                scale: [1.2, 0.8, 1.5, 1, 1.2]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[20%] h-[20%] bg-gradient-to-bl from-navy-800 to-[#111] rounded-full shadow-[inset_10px_10px_20px_rgba(255,255,255,0.2)]"
                        />
                        {/* Orbiting Goo Blob 3 */}
                        <motion.div
                            animate={{
                                x: [0, -180, 0, 180, 0],
                                y: [180, 0, -180, 0, 180],
                                scale: [0.9, 1.3, 0.9, 1.3, 0.9]
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[30%] h-[30%] bg-gradient-to-br from-[#222] to-[#000] rounded-full shadow-[inset_15px_15px_30px_rgba(255,255,255,0.1)]"
                        />
                    </motion.div>

                    {/* Glass Refraction Shell over the Goo */}
                    <motion.div
                        animate={{ rotateZ: -360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[15%] rounded-[45%] border border-white/[0.08] shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_0_60px_rgba(0,0,0,0.8)] pointer-events-none z-30 mix-blend-screen"
                    >
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rounded-[40%] border border-white/[0.04] scale-110" />

                        {/* Chrome Specular Highlights */}
                        <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 blur-[10px] rounded-full mix-blend-overlay rotate-45" />
                        <div className="absolute bottom-16 right-16 w-32 h-32 bg-[#3C82F6]/20 blur-[20px] rounded-full mix-blend-overlay" />
                    </motion.div>
                </motion.div>

                {/* Tracking Data */}
                <div className="absolute bottom-10 right-10 text-right hidden lg:block">
                    <div className="text-[#8A8F98] text-[9px] uppercase tracking-[0.5em] font-bold mb-2">Systems Array Offline</div>
                    <div className="flex justify-end gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                                transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                                className="w-1 bg-[#E6C78B] opacity-40 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hmc-text-glow {
                    text-shadow: 0 4px 30px rgba(255,255,255,0.15);
                }
                .animate-spin-slow {
                    animation: spin 30s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
}
