'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Address {
    id: string;
    type: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchAddresses = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch addresses from orders (extracting unique shipping addresses)
            const { data: orders } = await supabase
                .from('orders')
                .select('id, shipping_address')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (orders && orders.length > 0) {
                // Extract unique addresses based on pincode
                const uniqueAddresses = new Map<string, Address>();
                orders.forEach((order: any, index: number) => {
                    const addr = order.shipping_address;
                    if (addr && addr.pincode && !uniqueAddresses.has(addr.pincode)) {
                        uniqueAddresses.set(addr.pincode, {
                            id: order.id,
                            type: addr.label || 'Shipping Address',
                            name: `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Name not provided',
                            address: addr.addressLine1 || '',
                            city: `${addr.city || ''} - ${addr.pincode || ''}`,
                            phone: addr.phone || 'Not provided',
                            isDefault: index === 0
                        });
                    }
                });
                setAddresses(Array.from(uniqueAddresses.values()));
            }
            setLoading(false);
        };

        fetchAddresses();
    }, [supabase, router]);

    if (loading) {
        return (
            <main className="bg-[#FAF9F7] min-h-screen py-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-navy-900" size={32} />
            </main>
        );
    }

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
                </div>

                {/* Empty State */}
                {addresses.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-navy-900 mb-2">No saved addresses</h2>
                        <p className="text-gray-500 mb-6">
                            Your shipping addresses from orders will appear here.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block bg-navy-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-coral-500 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Address List */
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
                                            {addr.address}<br />
                                            {addr.city}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">Phone: {addr.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Addresses are automatically saved from your orders.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
