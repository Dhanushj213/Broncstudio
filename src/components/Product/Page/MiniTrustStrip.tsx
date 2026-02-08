'use client';

import React from 'react';
import { ShieldCheck, RotateCcw, Headphones, CheckCircle } from 'lucide-react';

export default function MiniTrustStrip() {
    const features = [
        { icon: ShieldCheck, text: "100% Secure Payments" },
        { icon: RotateCcw, text: "Easy 7-Day Returns" },
        { icon: Headphones, text: "24/7 Support" },
        { icon: CheckCircle, text: "Quality Assured" },
    ];

    return (
        <div className="border-t border-b border-subtle bg-surface-2/50 py-6 mt-16">
            <div className="container-premium flex flex-wrap justify-between items-center gap-4 px-6 md:px-0">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 w-[45%] md:w-auto">
                        <div className="bg-white dark:bg-black p-2 rounded-full shadow-sm text-primary">
                            <f.icon size={20} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-medium text-primary">{f.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
