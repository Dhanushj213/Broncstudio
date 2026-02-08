'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, PackageCheck, Clock, Package, Loader2, ShoppingBag } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    items?: any[];
}

export default function OrderPreview() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (data) {
                setOrders(data);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [supabase]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return PackageCheck;
            case 'shipped': return Package;
            default: return Clock;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
            case 'shipped': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
            case 'cancelled': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            default: return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-navy-900 dark:text-white">Recent Orders</h3>
                <Link href="/profile/orders" className="text-sm font-bold text-coral-500 hover:underline">View All</Link>
            </div>

            {loading ? (
                <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-gray-400 dark:text-gray-500" size={24} />
                </div>
            ) : orders.length === 0 ? (
                <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={40} />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet</p>
                    <Link href="/shop" className="text-sm font-bold text-coral-500 hover:underline mt-2 inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        const statusColor = getStatusColor(order.status);
                        const itemCount = order.items?.length || 0;
                        const firstItemName = order.items?.[0]?.name || 'Order';
                        const displayName = itemCount > 1
                            ? `${firstItemName} + ${itemCount - 1} more`
                            : firstItemName;

                        return (
                            <Link
                                key={order.id}
                                href={`/profile/orders/${order.id}`}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${statusColor}`}>
                                    <StatusIcon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors">
                                            {displayName}
                                        </h4>
                                        <span className="text-sm font-bold text-navy-900 dark:text-white">
                                            ₹{order.total_amount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            #{order.id.slice(0, 8)} • {formatDate(order.created_at)}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColor}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-navy-900 dark:group-hover:text-white mt-2" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
