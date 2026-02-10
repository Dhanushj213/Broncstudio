'use client';

import React from 'react';
import { ShieldCheck, RotateCcw, Headphones, CheckCircle, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MiniTrustStrip() {
    const features = [
        {
            icon: ShieldCheck,
            text: "Secure Payments",
            subtext: "100% Encrypted"
        },
        {
            icon: Headphones,
            text: "24/7 Support",
            subtext: "Always Online"
        },
        {
            icon: CheckCircle,
            text: "Quality Assured",
            subtext: "Boutique Grade"
        },
        {
            icon: Truck,
            text: "Fast Delivery",
            subtext: "Priority Shipping"
        }
    ];

    return (
        <div className="w-full bg-surface-1 dark:bg-black border-y border-subtle py-8 md:py-12 mt-12 md:mt-24">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4 group"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-surface-2 dark:bg-white/5 border border-divider flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-accent-orange/30 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                <f.icon size={24} className="text-primary md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[13px] md:text-sm font-bold text-primary tracking-tight">
                                    {f.text}
                                </h3>
                                <p className="text-[11px] md:text-xs text-secondary opacity-70">
                                    {f.subtext}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
