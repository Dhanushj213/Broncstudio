'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, ChevronRight, Loader2, ShoppingBag, Clock, PackageCheck, Truck, XCircle } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { createClient } from '@/utils/supabase/client';
import { cancelOrder } from '@/actions/orderActions';

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    items?: any[];
}

export default function OrdersPage() {
    const { formatPrice } = useUI();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*, items:order_items(name, quantity, image_url)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(data);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [supabase, router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'processing': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
            default: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return PackageCheck;
            case 'shipped': return Truck;
            case 'cancelled': return XCircle;
            default: return Clock;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-navy-900 dark:text-white" size={32} />
            </main>
        );
    }

    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">My Orders</h1>
                </div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm text-center">
                        <ShoppingBag className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">No orders yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Start exploring our collection and place your first order!</p>
                        <Link
                            href="/shop"
                            className="inline-block bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-xl hover:bg-coral-500 dark:hover:bg-gray-200 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            const statusColor = getStatusColor(order.status);
                            const itemCount = order.items?.length || 0;
                            const firstItemName = order.items?.[0]?.name || 'Order';

                            return (
                                <Link
                                    key={order.id}
                                    href={`/profile/orders/${order.id}`}
                                    className="block bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColor}`}>
                                                <StatusIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-navy-900 dark:text-white">
                                                    {firstItemName}
                                                    {itemCount > 1 && (
                                                        <span className="text-gray-400 font-normal"> + {itemCount - 1} items</span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    #{order.id.slice(0, 8)} • {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColor}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/10">
                                        <div className="text-sm font-bold text-navy-900 dark:text-white">
                                            Total: {formatPrice(order.total_amount)}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {(() => {
                                                const created = new Date(order.created_at).getTime();
                                                const now = new Date().getTime();
                                                const diffHours = (now - created) / (1000 * 60 * 60);
                                                const isCancellable = diffHours < 6 && !['delivered', 'shipped', 'cancelled'].includes(order.status);

                                                if (isCancellable) {
                                                    return (
                                                        <button
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                if (confirm('Are you sure you want to cancel this order?')) {
                                                                    const res = await cancelOrder(order.id);
                                                                    if (res.success) {
                                                                        // Optimistic update
                                                                        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o));
                                                                        alert('Order cancelled successfully.');
                                                                    } else {
                                                                        alert(res.error || 'Failed to cancel order.');
                                                                    }
                                                                }
                                                            }}
                                                            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors z-10 relative"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })()}
                                            <div className="flex items-center gap-1 text-xs font-bold text-coral-500 group-hover:underline">
                                                View Details <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
