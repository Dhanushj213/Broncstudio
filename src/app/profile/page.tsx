'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import QuickActions from '@/components/Profile/QuickActions';
import OrderPreview from '@/components/Profile/OrderPreview';
import AddressCard from '@/components/Profile/AddressCard';
import { Bell, Shield, LogOut, FileText, ChevronRight, Globe, Loader2 } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage() {
    const { currency, setCurrency } = useUI();
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                router.push('/login');
                return;
            }

            // Fetch additional profile data from 'profiles' table locally if needed,
            // or rely on metadata/defaults for this initial integration.
            // For now, let's use user metadata + email
            const profileData = {
                email: user.email,
                full_name: user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url
            };

            setUser(profileData);
            setLoading(false);
        };
        getUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const settings = [
        { icon: Bell, label: 'Notifications & Preferences', desc: 'Order updates, offers', href: '/profile/notifications' },
        { icon: Shield, label: 'Login & Security', desc: 'Password, 2FA', href: '/profile/security' },
        { icon: FileText, label: 'Legal & Policies', desc: 'Privacy, Terms, Returns', href: '/profile/legal' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
                <Loader2 className="animate-spin text-navy-900" size={32} />
            </div>
        );
    }

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="container-premium max-w-[1000px] mx-auto px-4 md:px-0">
                {/* Header Section */}
                <ProfileHeader user={user} />

                {/* Quick Actions Grid */}
                <QuickActions />

                {/* Main Content Grid (Desktop: 2 Col, Mobile: Stack) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left/Top Column: Core Data */}
                    <div className="md:col-span-2 space-y-6">
                        <OrderPreview />
                        <AddressCard />
                    </div>

                    {/* Right/Bottom Column: Settings & Support */}
                    <div className="space-y-6">
                        {/* Settings Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-navy-900 mb-4">Settings</h3>
                            <div className="space-y-1">
                                <button onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                        <Globe size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-navy-900">Currency</div>
                                        <div className="text-xs text-gray-500">Currently: {currency}</div>
                                    </div>
                                    <div className="text-xs font-bold text-coral-500 bg-coral-50 px-2 py-1 rounded-md uppercase">
                                        {currency}
                                    </div>
                                </button>
                                {settings.map((item, i) => (
                                    <Link key={i} href={item.href} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                            <item.icon size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-navy-900">{item.label}</div>
                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </Link>
                                ))}

                                {/* Admin Link (Temporary for Demo/Owner) */}
                                <Link href="/admin" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-navy-50 transition-colors text-left group border-t border-dashed border-gray-200 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                        <Shield size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-navy-900">Admin Dashboard</div>
                                        <div className="text-xs text-gray-500">Manage store & orders</div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </Link>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={18} /> Log Out
                        </button>

                        <div className="text-center text-xs text-gray-400 mt-4">
                            App Version 2.0.1 • Broncstudio
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
