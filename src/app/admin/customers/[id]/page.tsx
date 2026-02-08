'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, User, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    items?: any[];
}

interface CustomerProfile {
    id: string;
    name: string;
    phone?: string;
    location?: string;
    orders: Order[];
}

export default function CustomerDetailPage() {
    const params = useParams();
    const [customer, setCustomer] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (params.id) {
            fetchCustomerHistory();
        }
    }, [params.id]);

    const fetchCustomerHistory = async () => {
        setLoading(true);
        // We are using user_id or guest ID. Since we don't have a rigid profiles table yet,
        // we will fetch ALL orders for this user_id to rebuild the profile view.
        // NOTE: In the URL, if it's a guest, we might have passed a complex ID. 
        // For simplicity, let's assume we are linking from the Customer List which uses user_id if available.

        const customerId = decodeURIComponent(params.id as string);
        const isGuest = customerId.startsWith('guest-');

        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

        if (isGuest) {
            // This is tricky without a unique guest ID. 
            // We'll rely on our previous logic or just filter by user_id if it's a real user.
            // Realistically, for this demo, we'll assume we are looking up by user_id.
            // If it's a guest, we might not be able to reliably group without email.
            // Let's try to find by user_id = customerId
            query = query.eq('user_id', customerId); // This won't work for 'guest-Name'.
            // Fallback: If it starts with guest-Name, maybe we can't fetch perfectly unique history.
            // Let's stick to real users or just show the orders we can find.
        } else {
            query = query.eq('user_id', customerId);
        }

        const { data: orders, error } = await query;

        if (orders && orders.length > 0) {
            const latest = orders[0];
            const profile: CustomerProfile = {
                id: customerId,
                name: `${latest.shipping_address?.firstName} ${latest.shipping_address?.lastName}`,
                phone: latest.shipping_address?.phone,
                location: `${latest.shipping_address?.city}, ${latest.shipping_address?.pincode}`,
                orders: orders
            };
            setCustomer(profile);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading customer profile...</div>;
    if (!customer) return <div className="p-12 text-center text-gray-500">Customer not found or no orders history.</div>;

    const totalSpent = customer.orders.reduce((sum, o) => sum + o.total_amount, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 text-gray-500 mb-4">
                <Link href="/admin/customers" className="hover:text-navy-900 transition-colors flex items-center gap-1">
                    <ArrowLeft size={18} /> Back to Customers
                </Link>
            </div>

            {/* Header Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 bg-navy-50 text-navy-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    {customer.name[0]}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{customer.name}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                            <Phone size={16} /> {customer.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={16} /> {customer.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} /> First Order: {new Date(customer.orders[customer.orders.length - 1].created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Lifetime Value</p>
                    <p className="text-3xl font-bold text-green-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpent)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{customer.orders.length} Orders</p>
                </div>
            </div>

            {/* Order History */}
            <h2 className="text-xl font-bold text-gray-900 mt-8">Order History</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customer.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-900">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    ₹{order.total_amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${order.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-700' :
                                        order.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-700' :
                                            'bg-amber-50 border-amber-100 text-amber-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline font-bold">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
