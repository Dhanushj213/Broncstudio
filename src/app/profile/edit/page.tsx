'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProfilePage() {
    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[600px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 font-heading">Edit Profile</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Full Name</label>
                        <input type="text" defaultValue="Dhanush J" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Email</label>
                        <input type="email" defaultValue="dhanush@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                    </div>

                    <button className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-coral-500 transition-colors mt-4">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </main>
    );
}
