'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, MoreVertical } from 'lucide-react';

export default function AddressCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-navy-900">Saved Addresses</h3>
                <Link href="/profile/addresses" className="text-sm font-bold text-coral-500 hover:underline">+ Add New</Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:flex-col md:overflow-visible md:gap-3">
                {/* Address 1 */}
                <div className="min-w-[280px] md:w-full border border-green-200 bg-green-50/30 rounded-xl p-4 relative">
                    <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">DEFAULT</span>
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-navy-900" />
                        <span className="font-bold text-navy-900 text-sm">Home</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        Plot 123, Sunshine Apartments, <br />
                        MG Road, Indiranagar, <br />
                        Bangalore - 560038
                    </p>
                    <div className="flex gap-3 mt-2">
                        <Link href="/profile/addresses" className="text-xs font-bold text-navy-900 hover:text-coral-500">Edit</Link>
                        <button className="text-xs font-bold text-red-500 hover:text-red-600">Delete</button>
                    </div>
                </div>

                {/* Address 2 */}
                <div className="min-w-[280px] md:w-full border border-gray-100 rounded-xl p-4 hover:border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="font-bold text-gray-500 text-sm">Work</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        Broncstudio HQ, WeWork Galaxy, <br />
                        Residency Road, <br />
                        Bangalore - 560001
                    </p>
                    <div className="flex gap-3 mt-2">
                        <Link href="/profile/addresses" className="text-xs font-bold text-navy-900 hover:text-coral-500">Edit</Link>
                        <button className="text-xs font-bold text-red-500 hover:text-red-600">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
