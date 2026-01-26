'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Loader2, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Address {
    id: string;
    label: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    pincode: string;
    isDefault?: boolean;
}

export default function AddressCard() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchAddresses = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Fetch addresses from orders (since we don't have a dedicated addresses table yet)
            // We'll extract unique addresses from order history
            const { data: orders } = await supabase
                .from('orders')
                .select('shipping_address')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (orders && orders.length > 0) {
                // Get unique addresses based on pincode
                const uniqueAddresses = new Map<string, Address>();
                orders.forEach((order, index) => {
                    const addr = order.shipping_address;
                    if (addr && addr.pincode && !uniqueAddresses.has(addr.pincode)) {
                        uniqueAddresses.set(addr.pincode, {
                            id: `addr-${index}`,
                            label: addr.label || 'Shipping Address',
                            firstName: addr.firstName || '',
                            lastName: addr.lastName || '',
                            addressLine1: addr.addressLine1 || '',
                            city: addr.city || '',
                            pincode: addr.pincode || '',
                            isDefault: index === 0
                        });
                    }
                });
                setAddresses(Array.from(uniqueAddresses.values()).slice(0, 2));
            }
            setLoading(false);
        };

        fetchAddresses();
    }, [supabase]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-6">
                <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-navy-900">Saved Addresses</h3>
                <Link href="/profile/addresses" className="text-sm font-bold text-coral-500 hover:underline">+ Add New</Link>
            </div>

            {addresses.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <MapPin className="mx-auto text-gray-300 mb-3" size={32} />
                    <p className="text-gray-400 text-sm mb-3">No saved addresses</p>
                    <Link
                        href="/profile/addresses"
                        className="inline-flex items-center gap-1 text-sm font-bold text-coral-500 hover:underline"
                    >
                        <Plus size={16} /> Add Address
                    </Link>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:flex-col md:overflow-visible md:gap-3">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`min-w-[280px] md:w-full border rounded-xl p-4 relative ${address.isDefault
                                    ? 'border-green-200 bg-green-50/30'
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    DEFAULT
                                </span>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className={address.isDefault ? 'text-navy-900' : 'text-gray-400'} />
                                <span className={`font-bold text-sm ${address.isDefault ? 'text-navy-900' : 'text-gray-500'}`}>
                                    {address.label}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                {address.firstName} {address.lastName}<br />
                                {address.addressLine1}<br />
                                {address.city} - {address.pincode}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
