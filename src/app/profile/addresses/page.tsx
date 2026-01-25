'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'Dhanush J',
            address: 'Plot 123, Sunshine Apartments, MG Road, Indiranagar',
            city: 'Bangalore - 560038',
            phone: '+91 9876543210',
            isDefault: true
        },
        {
            id: 2,
            type: 'Work',
            name: 'Dhanush J',
            address: 'Broncstudio HQ, WeWork Galaxy, Residency Road',
            city: 'Bangalore - 560001',
            phone: '+91 9876543210',
            isDefault: false
        }
    ]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            setAddresses(addresses.filter(a => a.id !== id));
        }
    };

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                            <ArrowLeft size={20} className="text-navy-900" />
                        </Link>
                        <h1 className="text-2xl font-bold text-navy-900 font-heading">Addresses</h1>
                    </div>
                    <Link href="/profile/addresses/new" className="bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-coral-500 transition-colors shadow-lg shadow-navy-900/10">
                        <Plus size={16} /> Add New
                    </Link>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                            {addr.isDefault && (
                                <span className="absolute top-4 right-4 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                    Default
                                </span>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-navy-900 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-navy-900 text-lg mb-1">{addr.type}</h3>
                                    <p className="text-sm text-gray-900 font-medium mb-1">{addr.name}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                        {addr.address}, <br />
                                        {addr.city}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">Phone: {addr.phone}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-3 justify-end">
                                <Link href={`/profile/addresses/edit/${addr.id}`} className="text-xs font-bold text-navy-900 flex items-center gap-1 hover:text-coral-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                                    <Edit2 size={14} /> Edit
                                </Link>
                                <button onClick={() => handleDelete(addr.id)} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
