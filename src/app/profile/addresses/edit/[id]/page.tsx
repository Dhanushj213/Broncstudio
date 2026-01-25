'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditAddressPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Address updated successfully!');
        router.push('/profile/addresses');
    };

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[600px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile/addresses" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 font-heading">Edit Address</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-1">Address Type</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors">
                                <option>Home</option>
                                <option>Work</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-1">Full Name</label>
                            <input required type="text" defaultValue="Dhanush J" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Street Address</label>
                        <input required type="text" defaultValue="Plot 123, Sunshine Apartments, MG Road" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-1">City</label>
                            <input required type="text" defaultValue="Bangalore" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-1">Pincode</label>
                            <input required type="text" defaultValue="560038" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Phone Number</label>
                        <input required type="tel" defaultValue="+91 9876543210" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors" />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="default" defaultChecked className="w-4 h-4 text-navy-900 rounded focus:ring-navy-900 border-gray-300" />
                        <label htmlFor="default" className="text-sm text-navy-900">Make this my default address</label>
                    </div>

                    <button type="submit" className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-coral-500 transition-colors mt-4">
                        <Save size={18} /> Update Address
                    </button>
                </form>
            </div>
        </main>
    );
}
