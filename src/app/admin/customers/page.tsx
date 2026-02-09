'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, ShoppingBag, Calendar, ArrowRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface CustomerMetrics {
    user_id: string;
    name: string;
    email: string;
    total_spent: number;
    orders_count: number;
    last_order_date: string;
    first_order_date: string;
}

import WalletAdjustmentModal from '@/components/admin/WalletAdjustmentModal';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerMetrics | null>(null);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);

        // Fetch all orders
        // In a real large-scale app, we would have a 'customers' table with aggregated stats updated via triggers.
        // For now, we aggregate in client (fine for < 1000 orders).
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
            return;
        }

        if (orders) {
            const customerMap = new Map<string, CustomerMetrics>();

            orders.forEach(order => {
                const userId = order.user_id || order.shipping_address?.email || 'guest';
                // Skip if really no ID
                if (!userId) return;

                const current = customerMap.get(userId) || {
                    user_id: userId,
                    name: `${order.shipping_address?.firstName || ''} ${order.shipping_address?.lastName || ''}`.trim() || 'Unknown',
                    email: order.shipping_address?.email || 'N/A',
                    total_spent: 0,
                    orders_count: 0,
                    last_order_date: order.created_at,
                    first_order_date: order.created_at
                };

                // Update Stats
                current.total_spent += order.total_amount;
                current.orders_count += 1;

                // Track Dates
                if (new Date(order.created_at) > new Date(current.last_order_date)) {
                    current.last_order_date = order.created_at;
                }
                if (new Date(order.created_at) < new Date(current.first_order_date)) {
                    current.first_order_date = order.created_at;
                }

                customerMap.set(userId, current);
            });

            setCustomers(Array.from(customerMap.values()));
        }
        setLoading(false);
    };

    const handleOpenWalletModal = (customer: CustomerMetrics) => {
        // Only allow wallet for registered users (checks if user_id satisfies UUID format roughly, or just not 'guest')
        // Actually, we need 'user_id' to match 'auth.users.id'. 
        // If 'guest' logic is used, we can't credit wallet.
        if (customer.user_id === 'guest' || !customer.user_id.includes('-')) {
            alert("This seems to be a guest user. Wallets are only for registered accounts.");
            return;
        }
        setSelectedCustomer(customer);
        setIsWalletModalOpen(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCustomers = [...filteredCustomers].sort((a, b) => b.total_spent - a.total_spent); // High value customers first

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User size={24} className="text-navy-900" />
                        Customer Insights
                    </h1>
                    <p className="text-gray-500 mt-1">Analyze customer value and purchase history.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search customers by name or email..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900/10 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-400">Loading customer data...</div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4">Total Spent</th>
                                    <th className="px-6 py-4">Last Order</th>
                                    <th className="px-6 py-4">First Seen</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedCustomers.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-400">No customers found.</td></tr>
                                ) : (
                                    sortedCustomers.map((customer, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                                                        {customer.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{customer.name}</p>
                                                        <p className="text-xs text-gray-500">{customer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                                    <ShoppingBag size={14} className="text-gray-400" />
                                                    {customer.orders_count}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                ₹{customer.total_spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {format(new Date(customer.last_order_date), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {format(new Date(customer.first_order_date), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenWalletModal(customer)}
                                                    className="text-navy-900 hover:text-navy-700 font-medium text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                                >
                                                    Manage Wallet
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <WalletAdjustmentModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                customer={selectedCustomer}
                onSuccess={() => {
                    // Refresh if needed, but here we just made a wallet adjustment which doesn't affect the order stats explicitly displayed here immediately unless we fetch balances.
                    // But good for UX
                }}
            />
        </div>
    );
}

