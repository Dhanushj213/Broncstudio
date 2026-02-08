'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function AnnouncementBar() {
    const [text, setText] = useState('Free Shipping on all orders above ₹999 • New Collection Dropped');
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('store_settings')
                .select('announcement_text, announcement_link, announcement_active')
                .single();

            if (data) {
                if (data.announcement_text) setText(data.announcement_text);
                if (data.announcement_link) setLink(data.announcement_link);
                if (data.announcement_active !== undefined) setIsActive(data.announcement_active);
            }
            setLoading(false);
        };

        fetchSettings();
    }, []);

    if (!isActive) return null;

    const Content = () => (
        <div className="flex container-premium items-center justify-center">
            <span dangerouslySetInnerHTML={{ __html: text.replace(/•/g, '<span class="mx-2 opacity-50">•</span>') }}></span>
        </div>
    );

    return (
        <div className="bg-red-600 text-white text-[10px] md:text-xs font-medium tracking-wide py-2 text-center relative z-[101]">
            {link ? (
                <Link href={link} className="hover:opacity-80 transition-opacity block w-full">
                    <Content />
                </Link>
            ) : (
                <Content />
            )}
        </div>
    );
}
