'use client';

import React from 'react';
import Link from 'next/link';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import QuickActions from '@/components/Profile/QuickActions';
import OrderPreview from '@/components/Profile/OrderPreview';
import AddressCard from '@/components/Profile/AddressCard';
import { Bell, Shield, LogOut, FileText, ChevronRight, Globe } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function ProfilePage() {
    const { currency, setCurrency } = useUI();
    const settings = [
        { icon: Bell, label: 'Notifications & Preferences', desc: 'Order updates, offers', href: '/profile/notifications' },
        { icon: Shield, label: 'Login & Security', desc: 'Password, 2FA', href: '/profile/security' },
        { icon: FileText, label: 'Legal & Policies', desc: 'Privacy, Terms, Returns', href: '/profile/legal' },
    ];

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="container-premium max-w-[1000px] mx-auto px-4 md:px-0">
                {/* Header Section */}
                <ProfileHeader />

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
                            </div>
                        </div>

                        {/* Logout */}
                        <Link href="/" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                            <LogOut size={18} /> Log Out
                        </Link>

                        <div className="text-center text-xs text-gray-400 mt-4">
                            App Version 2.0.1 • Broncstudio
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
