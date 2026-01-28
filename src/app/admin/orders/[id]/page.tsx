'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, CheckCircle, XCircle, Truck, Package, CreditCard, User, MapPin, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateOrderStatus } from '@/actions/adminActions';

interface OrderItem {
    id: string;
    product_id: string; // ID only, we might need to fetch name if not joined, but let's assume simple fetch for now
    name: string; // We stored name in order_items for snapshot
    quantity: number;
    price: number;
    size?: string;
    image_url: string;
    metadata?: any;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    user_id: string;
    payment_status: string;
    payment_method: string;
    items?: OrderItem[]; // We'll fetch these manually
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (params.id) {
            fetchOrderDetails(params.id as string);
        }
    }, [params.id]);

    const fetchOrderDetails = async (orderId: string) => {
        setLoading(true);
        // 1. Fetch Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError) {
            console.error('Error fetching order:', orderError);
            setLoading(false);
            return;
        }

        setOrder(orderData);

        // 2. Fetch Items
        const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (itemsData) {
            setItems(itemsData);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!order) return;
        if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        const { success, error } = await updateOrderStatus(order.id, newStatus);

        if (!success) {
            alert('Failed to update status: ' + error);
        } else {
            // Refresh local state
            setOrder({ ...order, status: newStatus });
            alert(`Order ${newStatus} successfully!`);
            router.refresh(); // Refresh server state
        }
        setActionLoading(false);
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-12 text-center text-red-500">Order not found.</div>;
    }

    const isPending = order.status === 'pending';

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 text-gray-500 mb-4">
                <Link href="/admin/orders" className="hover:text-navy-900 transition-colors flex items-center gap-1">
                    <ArrowLeft size={18} /> Back to Orders
                </Link>
                <span>/</span>
                <span className="font-mono text-gray-900">#{order.id.slice(0, 8)}</span>
            </div>

            {/* Title & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-3">
                        Order #{order.id.slice(0, 8)}
                        <span className={`text-base px-3 py-1 rounded-full border uppercase tracking-wider ${order.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            order.status === 'processing' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                order.status === 'shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                    order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                        'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Clock size={16} /> Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                {isPending && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleUpdateStatus('cancelled')}
                            disabled={actionLoading}
                            className="bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                        >
                            <XCircle size={20} />
                            Reject Order
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('processing')}
                            disabled={actionLoading}
                            className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all"
                        >
                            <CheckCircle size={20} />
                            Accept Order
                        </button>
                    </div>
                )}

                {order.status === 'processing' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleUpdateStatus('shipped')}
                            disabled={actionLoading}
                            className="bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <Truck size={20} />
                            Mark as Shipped
                        </button>
                    </div>
                )}

                {order.status === 'shipped' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleUpdateStatus('delivered')}
                            disabled={actionLoading}
                            className="bg-green-600 text-white hover:bg-green-700 font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 transition-all"
                        >
                            <CheckCircle size={20} />
                            Mark as Delivered
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Package size={20} className="text-gray-400" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map((item, idx) => {
                                const meta = item.metadata as any;
                                return (
                                    <div key={idx} className="p-6 flex items-start gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative group">
                                            <img src={meta?.image_url || item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            {meta?.image_url && (
                                                <a
                                                    href={meta.image_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    download
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                                                >
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {item.name}
                                                {meta?.is_custom && (
                                                    <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                                        Custom
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="space-y-1 mt-1">
                                                <p className="text-sm text-gray-500">
                                                    Size: <span className="font-medium text-gray-700">{meta?.size || item.size || 'N/A'}</span>
                                                </p>

                                                {meta?.is_custom && (
                                                    <div className="text-sm bg-gray-50 p-2 rounded border border-gray-100 inline-block mt-1">
                                                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Print Details</p>
                                                        <p>Type: <span className="font-medium text-gray-900">{meta.print_type}</span></p>
                                                        <p>Placement: <span className="font-medium text-gray-900">{meta.placement}</span></p>
                                                        {meta.note && (
                                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                                <p className="text-xs text-gray-400">Customer Note:</p>
                                                                <p className="italic text-gray-700">"{meta.note}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                            <p className="text-xs text-gray-400">₹{item.price} each</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                            <span className="font-bold text-gray-500">Total Amount</span>
                            <span className="text-2xl font-bold text-navy-900">₹{order.total_amount}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <CreditCard size={20} className="text-gray-400" />
                            Payment Information
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                <p className="font-bold text-gray-900 capitalize">{order.payment_method?.replace(/_/g, ' ') || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${order.payment_status === 'paid' ? 'bg-green-100 border-green-200 text-green-700' :
                                    order.payment_status === 'failed' ? 'bg-red-100 border-red-200 text-red-700' :
                                        'bg-amber-100 border-amber-200 text-amber-700'
                                    }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                        {order.status === 'pending' && order.payment_status === 'pending' && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800 flex items-start gap-2">
                                <div className="min-w-[4px] h-[4px] bg-amber-500 rounded-full mt-2" />
                                <p>This order is waiting for admin approval. Since payment is pending (COD), verifying the customer via phone is recommended before accepting.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <User size={20} className="text-gray-400" />
                            Customer Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                    {order.shipping_address?.firstName?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Info</p>
                                <p className="text-sm text-gray-700 font-medium">{order.shipping_address?.phone}</p>
                                {/* We might want to store email in orders table too if not in address JSON */}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <MapPin size={20} className="text-gray-400" />
                            Shipping Address
                        </h2>
                        <address className="not-italic text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{order.shipping_address?.address}</p>
                            <p>{order.shipping_address?.city}, {order.shipping_address?.pincode}</p>
                            <p>India</p>
                        </address>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Truck size={16} className="text-gray-400" />
                                Delivery Status
                            </h3>
                            {/* Placeholder for tracking history */}
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white box-content ${isPending ? 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.2)]' :
                                        order.status === 'cancelled' ? 'bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'bg-green-500'
                                        }`} />
                                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                {order.status === 'processing' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-white box-content shadow-[0_0_0_3px_rgba(168,85,247,0.2)]" />
                                        <p className="text-sm font-medium text-gray-900">Processing</p>
                                        <p className="text-xs text-gray-400">Order Accepted</p>
                                    </div>
                                )}
                                {order.status === 'cancelled' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white box-content shadow-[0_0_0_3px_rgba(239,68,68,0.2)]" />
                                        <p className="text-sm font-medium text-red-700">Order Rejected</p>
                                        <p className="text-xs text-red-500">Refund Initiated (if paid)</p>
                                    </div>
                                )}
                                {order.status === 'delivered' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white box-content shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" />
                                        <p className="text-sm font-medium text-gray-900">Delivered</p>
                                        <p className="text-xs text-gray-400">Package Arrived</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
