'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Search, Loader2, Users, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Customer {
    id: string; // user_id or unique identifier
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        // Since we don't have a public profiles table, we aggregate from orders
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*');

        if (error) {
            console.error('Error fetching customers:', error);
        } else if (orders) {
            // Aggregate unique customers based on user_id (or shipping details if user_id is null/guest)
            const customerMap = new Map<string, Customer>();

            orders.forEach(order => {
                const userId = order.user_id || `guest-${order.shipping_address?.firstName}`; // Fallback for Guests

                if (!customerMap.has(userId)) {
                    customerMap.set(userId, {
                        id: userId,
                        name: `${order.shipping_address?.firstName} ${order.shipping_address?.lastName}`,
                        phone: order.shipping_address?.phone,
                        location: order.shipping_address?.city,
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: order.created_at
                    });
                }

                const customer = customerMap.get(userId)!;
                customer.totalOrders += 1;
                customer.totalSpent += order.total_amount;
                if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.created_at;
                }
            });

            setCustomers(Array.from(customerMap.values()));
        }
        setLoading(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Customers</h1>
                    <p className="text-gray-500 text-sm">View your customer base</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-navy-900" />
                        <p>Loading customers...</p>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No customers found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Total Orders</th>
                                    <th className="px-6 py-4">Total Spent</th>
                                    <th className="px-6 py-4">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center font-bold">
                                                    {customer.name[0]}
                                                </div>
                                                <div>
                                                    <Link href={`/admin/customers/${customer.id}`} className="font-bold text-navy-900 hover:text-blue-600 hover:underline">
                                                        {customer.name}
                                                    </Link>
                                                    <div className="text-gray-400 text-xs flex items-center gap-1">
                                                        <MapPin size={10} /> {customer.location || 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                {customer.phone && <span className="flex items-center gap-1"><Phone size={12} /> {customer.phone}</span>}
                                                {/* Email would go here if we had it */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-navy-900">
                                            {customer.totalOrders}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-700">
                                            {formatCurrency(customer.totalSpent)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(customer.lastOrderDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
