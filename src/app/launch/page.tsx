'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowRight, ChevronRight, ChevronLeft, Instagram, Facebook, Youtube, Twitter, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LaunchPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [launchDateTime, setLaunchDateTime] = useState<string | null>(null);
    const [headline, setHeadline] = useState('Something Extraordinary Is Launching.');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchHeroVideo, setLaunchHeroVideo] = useState<string | null>(null);
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: '',
        gmail: '',
        phone: '',
        secondaryPhone: ''
    });

    // Slider State
    const [activeTab, setActiveTab] = useState<'countdown' | 'media'>('countdown');
    const [direction, setDirection] = useState(1);

    // Subscription State
    const [email, setEmail] = useState('');
    const [subscribeLoading, setSubscribeLoading] = useState(false);
    const [subscribeError, setSubscribeError] = useState<string | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribeLoading(true);
        setSubscribeError(null);

        try {
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email }]);

            if (error) throw error;
            setIsSubscribed(true);
        } catch (error: any) {
            console.error('Subscription error:', error);
            setSubscribeError(error.message || 'Failed to subscribe. Please try again.');
        } finally {
            setSubscribeLoading(false);
        }
    };

    // Cursor tracking for lighting/parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Parallax Transforms
    const cardRotateX = useTransform(springY, (t: number) => t * -0.015);
    const cardRotateY = useTransform(springX, (t: number) => t * 0.015);
    const backgroundX = useTransform(springX, (t: number) => t * -0.03);
    const backgroundY = useTransform(springY, (t: number) => t * -0.03);

    useEffect(() => {
        async function fetchLaunchSettings() {
            const { data } = await supabase
                .from('site_settings')
                .select('launch_datetime, launch_message, launch_hero_video')
                .single();

            if (data) {
                setLaunchDateTime(data.launch_datetime);
                setHeadline(data.launch_message || 'Something Extraordinary Is Launching.');
                setLaunchHeroVideo(data.launch_hero_video || null);
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
        fetchLaunchSettings();

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const [preLaunchFired, setPreLaunchFired] = useState(false);

    useEffect(() => {
        if (!launchDateTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const launchDate = new Date(launchDateTime).getTime();
            const distance = launchDate - now;

            // Trigger Epic 10-second warning fireworks
            if (distance <= 10000 && distance > 0 && !preLaunchFired) {
                setPreLaunchFired(true);
                fireGrandConfetti(6000, 1.5); // 6 seconds of medium fireworks
            }

            if (distance <= 0) {
                clearInterval(timer);
                handleLaunchSequence();
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [launchDateTime, preLaunchFired]);

    const fireGrandConfetti = (duration: number, intensity: number = 1) => {
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * intensity * (timeLeft / duration);

            // Vibrant, rich color palette for maximum "Wow"
            const colors = ['#ffffff', '#E6C78B', '#3C82F6', '#8B5CF6', '#F43F5E', '#10B981', '#F59E0B'];

            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: colors
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: colors
            });
            // Add central bursts for extra grandeur
            if (intensity > 1.5) {
                confetti({
                    ...defaults, particleCount: particleCount / 2,
                    origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 },
                    colors: colors,
                    startVelocity: 45
                });
            }
        }, 250);
    };

    const handleLaunchSequence = () => {
        setIsLaunching(true);

        // --- 💥 MASSIVE FINAL LAUNCH CELEBRATION ---
        const duration = 6000;
        fireGrandConfetti(duration, 3.0); // 3x intensity for the grand finale

        // Giant center explosion instantly
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#E6C78B', '#3C82F6', '#8B5CF6', '#F43F5E', '#10B981', '#F59E0B'],
            zIndex: 9999,
            startVelocity: 60
        });

        setTimeout(() => {
            router.push('/');
        }, duration); // Redirect immediately after the confetti duration finishes
    };

    if (loading) return null;

    // Variants for the horizontal slider
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
            filter: 'blur(15px)',
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 300 : -300,
            opacity: 0,
            filter: 'blur(15px)',
            scale: 0.95
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans cursor-default"
        >
            {/* SVG Filter for Liquid Gooeiness */}
            <svg width="0" height="0" className="absolute hidden pointer-events-none">
                <defs>
                    <filter id="launchGoo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 70 -30" result="launchGoo" />
                        <feComposite in="SourceGraphic" in2="launchGoo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* 🌟 GRAND LIQUID BACKGROUND */}
            <motion.div
                style={{ x: backgroundX, y: backgroundY }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
                {/* Granular Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dlbvga8v6/image/upload/v1615701800/noise_pc0ooy.png')] opacity-[0.06] mix-blend-overlay z-10" />

                {/* True Liquid Gooey Orbs */}
                <motion.div
                    style={{ filter: "url(#launchGoo)" }}
                    className="relative w-full h-full flex items-center justify-center mix-blend-screen opacity-50"
                >
                    <motion.div
                        animate={{
                            x: [0, 200, -150, 0],
                            y: [0, -200, 150, 0],
                            scale: [1, 1.4, 0.8, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[40vw] h-[40vw] min-w-[500px] min-h-[500px] bg-gradient-to-tr from-[#3C82F6] to-[#1E3A8A] rounded-full"
                    />
                    <motion.div
                        animate={{
                            x: [0, -250, 150, 0],
                            y: [0, 250, -150, 0],
                            scale: [1, 0.9, 1.5, 1],
                            rotate: [0, -180, -360]
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[35vw] h-[35vw] min-w-[400px] min-h-[400px] bg-gradient-to-bl from-[#8B5CF6] to-[#4C1D95] rounded-full"
                    />
                    <motion.div
                        animate={{
                            x: [0, 150, -250, 0],
                            y: [0, 100, 200, 0],
                            scale: [1, 1.6, 0.9, 1]
                        }}
                        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[45vw] h-[45vw] min-w-[600px] min-h-[600px] bg-gradient-to-tr from-[#E6C78B]/80 to-[#D97706]/80 rounded-full"
                    />
                </motion.div>
            </motion.div>

            {/* 💥 GRAND LAUNCH TRANSITION BLOOM & TEXT SEQUENCE */}
            <AnimatePresence>
                {isLaunching && (
                    <>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 150, opacity: 1 }}
                            transition={{ duration: 2.5, ease: [0.8, 0, 0.2, 1] }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-white rounded-full blur-[2px] z-[100] pointer-events-none shadow-[0_0_100px_50px_rgba(255,255,255,1)]"
                        />

                        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
                                animate={{ opacity: [0, 1, 0], y: [20, 0, -20], filter: ["blur(10px)", "blur(0px)", "blur(10px)"], scale: [0.9, 1, 1.1] }}
                                transition={{ duration: 1.5, delay: 0.8, times: [0, 0.4, 1], ease: "easeInOut" }}
                                className="absolute text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter uppercase text-center"
                            >
                                Hand Crafted Designs
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
                                animate={{ opacity: [0, 1, 0], y: [20, 0, -20], filter: ["blur(10px)", "blur(0px)", "blur(10px)"], scale: [0.9, 1, 1.1] }}
                                transition={{ duration: 1.5, delay: 2.4, times: [0, 0.4, 1], ease: "easeInOut" }}
                                className="absolute text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter uppercase text-center"
                            >
                                Handpicked Quality
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
                                animate={{ opacity: [0, 1, 1], y: [20, 0, 0], filter: ["blur(10px)", "blur(0px)", "blur(0px)"], scale: [0.9, 1, 1] }}
                                transition={{ duration: 1.5, delay: 4.0, times: [0, 0.4, 1], ease: "easeInOut" }}
                                className="absolute text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter uppercase text-center"
                            >
                                Secure Payment
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* 🧊 ULTRA-PREMIUM MAIN GLASS CONTENT PANEL (WITH SLIDER) */}
            <AnimatePresence custom={direction} mode="wait">
                {!isLaunching && activeTab === 'countdown' && (
                    <motion.div
                        key="countdown"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            rotateX: cardRotateX,
                            rotateY: cardRotateY,
                            z: 100
                        }}
                        className="w-full max-w-[700px] px-4 perspective-1000 z-20 absolute"
                    >
                        {/* Slide Navigation - Right Arrow (Placed OUTSIDE the overflow-hidden card) */}
                        {launchHeroVideo && (
                            <button
                                onClick={() => { setDirection(1); setActiveTab('media'); }}
                                className="absolute right-6 top-6 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 transition-all hover:scale-110 active:scale-95 group/arrow shadow-lg shadow-black/50 backdrop-blur-md flex translate-x-0 sm:translate-x-1/2"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/arrow:translate-x-0.5 transition-transform" />
                            </button>
                        )}

                        <div className="relative backdrop-blur-[50px] bg-white/[0.02] border border-white/[0.1] rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(255,255,255,0.02)] overflow-hidden group">

                            {/* Inner Glass Highlights */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/20 to-transparent" />
                            <div className="absolute top-0 -inset-x-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] group-hover:translate-x-[400%] transition-transform duration-[2.5s] ease-in-out pointer-events-none" />

                            {/* Logo & Brand Name */}
                            <div className="flex flex-col items-center mb-6 sm:mb-10 relative z-10">
                                <motion.div
                                    animate={{ filter: ['drop-shadow(0 0 0px rgba(255,255,255,0))', 'drop-shadow(0 0 20px rgba(255,255,255,0.25))', 'drop-shadow(0 0 0px rgba(255,255,255,0))'] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Image
                                        src="/whitelogo.png"
                                        alt="Brand Logo"
                                        width={160}
                                        height={45}
                                        className="opacity-100"
                                        priority
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, letterSpacing: "0.1em" }}
                                    animate={{ opacity: 1, letterSpacing: "0.3em" }}
                                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                                    className="mt-5 text-sm sm:text-base font-bold text-white/90 uppercase"
                                    style={{ textShadow: "0 2px 10px rgba(255,255,255,0.4)" }}
                                >
                                    Broncstudio
                                </motion.div>
                            </div>

                            {/* Headline & Subtext */}
                            <div className="text-center mb-8 sm:mb-12 relative z-10">
                                <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight text-white leading-[1.05] mb-3 sm:mb-5 hmc-text-glow">
                                    {headline.split(' ').map((word, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                            className="inline-block mr-[0.25em]"
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                    className="text-[#CFCFD3] text-sm sm:text-base font-light tracking-[0.2em] uppercase"
                                >
                                    The new standard is arriving.
                                </motion.p>
                            </div>

                            {/* 🕒 LIQUID GLASS SKEUOMORPHIC COUNTDOWN */}
                            <div className="flex justify-center gap-2 sm:gap-4 md:gap-5 mb-8 sm:mb-12 relative z-10 w-full shrink-0">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Mins', value: timeLeft.minutes },
                                    { label: 'Secs', value: timeLeft.seconds },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 + idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="flex-1 max-w-[110px]"
                                    >
                                        <div className="bg-white/[0.03] backdrop-blur-[20px] rounded-[1.5rem] p-3 sm:p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.5)] border border-white/[0.08] relative overflow-hidden flex flex-col items-center">
                                            {/* Micro-light at top */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                            <motion.div
                                                key={item.value}
                                                initial={{ rotateX: 90, opacity: 0 }}
                                                animate={{ rotateX: 0, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className="text-2xl sm:text-4xl md:text-5xl font-medium text-white tabular-nums tracking-tighter mb-1 sm:mb-1.5 drop-shadow-[0_4px_10px_rgba(255,255,255,0.1)]"
                                                style={{ textShadow: "0 1px 2px rgba(255,255,255,0.2), 0 0 10px rgba(255,255,255,0.1)" }}
                                            >
                                                {String(item.value).padStart(2, '0')}
                                            </motion.div>

                                            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8F98]">
                                                {item.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ACTIVATE BUTTON / INPUT */}
                            <div className="relative z-10 w-full max-w-sm mx-auto">
                                <AnimatePresence mode="wait">
                                    {!isSubscribed ? (
                                        <motion.form
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onSubmit={handleSubscribe}
                                            className="flex flex-col gap-3 sm:gap-4"
                                        >
                                            <div className="relative group/input">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3C82F6]/30 via-[#8B5CF6]/30 to-[#E6C78B]/30 rounded-[12px] blur opacity-0 group-focus-within/input:opacity-100 transition duration-500"></div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={subscribeLoading}
                                                    placeholder="Enter email for priority access"
                                                    className="relative w-full bg-black/40 border border-white/10 rounded-lg py-4 px-6 outline-none text-white focus:border-white/30 transition-all font-light placeholder:text-[#8A8F98] shadow-[inset_0_2px_10px_rgba(0,0,0,1)] text-center text-sm sm:text-base backdrop-blur-md disabled:opacity-50"
                                                    required
                                                />
                                            </div>
                                            {subscribeError && (
                                                <div className="text-red-400 text-xs text-center px-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                                    {subscribeError}
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={subscribeLoading}
                                                className="w-full bg-gradient-to-r from-white to-[#E6C78B] text-black font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-lg hover:shadow-[0_0_30px_rgba(230,199,139,0.4)] transition-all flex justify-center items-center gap-3 overflow-hidden group/btn relative active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="relative z-10 uppercase tracking-widest whitespace-nowrap">
                                                    {subscribeLoading ? 'Confirming...' : 'Notify Me'}
                                                </span>
                                                {!subscribeLoading && <ArrowRight size={18} className="relative z-10 transition-transform group-hover/btn:translate-x-1.5" />}
                                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-50 transition-opacity duration-300" />
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-6 px-6 bg-white/[0.05] border border-white/10 rounded-xl backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                        >
                                            <div className="text-[#E6C78B] font-bold text-sm uppercase tracking-widest mb-1.5 drop-shadow-[0_0_10px_rgba(230,199,139,0.3)]">Priority Confirmed</div>
                                            <p className="text-[#8A8F98] text-xs sm:text-sm">You will be notified moments before the public reveal.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isLaunching && activeTab === 'media' && launchHeroVideo && (
                    <motion.div
                        key="media"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            rotateX: cardRotateX,
                            rotateY: cardRotateY,
                            z: 100
                        }}
                        className="w-full max-w-[800px] px-4 perspective-1000 z-20 absolute"
                    >
                        {/* Slide Navigation - Left Arrow */}
                        <button
                            onClick={() => { setDirection(-1); setActiveTab('countdown'); }}
                            className="absolute left-6 top-6 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 transition-all hover:scale-110 active:scale-95 group/arrow shadow-lg shadow-black/50 backdrop-blur-md flex shadow-xl translate-x-0 sm:-translate-x-1/2"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover/arrow:-translate-x-0.5 transition-transform" />
                        </button>

                        <div className="relative backdrop-blur-[50px] bg-white/[0.02] border border-white/[0.1] rounded-[2.5rem] p-4 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(255,255,255,0.02)] overflow-hidden group flex flex-col items-center">

                            {/* Inner Glass Highlights */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                            <div className="relative w-full aspect-[16/9] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-black/50">
                                {launchHeroVideo.includes('youtube.com') || launchHeroVideo.includes('youtu.be') ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={
                                            launchHeroVideo.includes('youtube.com/watch?v=')
                                                ? launchHeroVideo.replace('watch?v=', 'embed/') + '?autoplay=1&loop=1&controls=0'
                                                : launchHeroVideo.includes('youtu.be/')
                                                    ? launchHeroVideo.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1&loop=1&controls=0'
                                                    : launchHeroVideo
                                        }
                                        title="Launch Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video
                                        src={(() => {
                                            if (!launchHeroVideo) return '';

                                            // Handling direct drive links if they manage to grab a raw stream link
                                            let finalUrl = launchHeroVideo;
                                            const match = launchHeroVideo.match(/(?:d\/|id=)([a-zA-Z0-9_-]+)/);
                                            if (match && match[1]) {
                                                finalUrl = `https://drive.google.com/uc?id=${match[1]}&export=download`;
                                            }

                                            return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
                                        })()}
                                        autoPlay
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                                        onError={(e) => {
                                            console.error("Video failed to play");
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Footer Corner */}
            <AnimatePresence>
                {
                    !isLaunching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 2 }}
                            className="fixed bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-between items-end z-50 pointer-events-none"
                        >
                            <div className="text-[#8A8F98] text-[9px] uppercase tracking-[0.3em] font-medium hidden sm:block whitespace-nowrap">
                                Confidential / Bronc Studio 2026
                            </div>

                            <div className="flex gap-2 hidden sm:flex pointer-events-auto">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3], height: [6, 12, 6] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1 bg-white rounded-full"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Fixed Social Links */}
            <AnimatePresence>
                {
                    !isLaunching && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 2.2 }}
                            className="fixed bottom-6 w-full flex justify-center sm:w-auto sm:justify-start sm:bottom-1/2 sm:translate-y-1/2 sm:right-8 sm:left-auto sm:-translate-x-0 flex-row sm:flex-col gap-4 sm:gap-6 z-50 pointer-events-auto items-center"
                        >
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 shadow-lg flex items-center justify-center">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 shadow-lg flex items-center justify-center">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {socialLinks.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 shadow-lg flex items-center justify-center">
                                    <Youtube size={20} />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 shadow-lg flex items-center justify-center">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {socialLinks.gmail && (
                                <a href={`mailto:${socialLinks.gmail}`} className="text-[#8A8F98] hover:text-white transition-all hover:scale-110 active:scale-95 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-white/20 shadow-lg flex items-center justify-center">
                                    <Mail size={20} />
                                </a>
                            )}
                        </motion.div>
                    )
                }
            </AnimatePresence >

            <style jsx global>{`
                .hmc-text-glow {
                    text-shadow: 0 4px 30px rgba(255,255,255,0.2);
                }
            `}</style>
        </motion.div >
    );
}
