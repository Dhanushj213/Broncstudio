'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        email_orders: true,
        email_promos: false,
        sms_orders: true,
        push_all: true
    });

    const toggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="container-premium max-w-[800px] mx-auto px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-navy-900 border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
                        <p className="text-gray-500 text-sm">Manage how we communicate with you.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Orders */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Bell size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900">Order Updates</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-navy-900">Email Notifications</div>
                                    <div className="text-sm text-gray-500">Receive order confirmations and shipping updates via email.</div>
                                </div>
                                <button
                                    onClick={() => toggle('email_orders')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${preferences.email_orders ? 'bg-success-mint' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${preferences.email_orders ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-navy-900">SMS Notifications</div>
                                    <div className="text-sm text-gray-500">Get text updates for delivery tracking.</div>
                                </div>
                                <button
                                    onClick={() => toggle('sms_orders')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${preferences.sms_orders ? 'bg-success-mint' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${preferences.sms_orders ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Marketing */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Mail size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900">Marketing & Offers</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-navy-900">Promotional Emails</div>
                                <div className="text-sm text-gray-500">Be the first to know about sales, new drops, and exclusive offers.</div>
                            </div>
                            <button
                                onClick={() => toggle('email_promos')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.email_promos ? 'bg-success-mint' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${preferences.email_promos ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
