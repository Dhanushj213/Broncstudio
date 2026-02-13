'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, CheckCircle, XCircle, Truck, Package, CreditCard, User, MapPin, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateOrderStatus, updatePaymentStatus, undoLastStatusUpdate } from '@/actions/adminActions';
import { useToast } from '@/context/ToastContext';
import InvoiceDownloadButton from '@/components/Invoice/InvoiceDownloadButton';



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
    wallet_amount_used: number;
    discount_amount: number; // Added coupon discount field
    status_history?: { status: string; timestamp: string; updated_by?: string }[];
    items?: OrderItem[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
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
            // MERGE ITEMS INTO ORDER STATE FOR INVOICE
            setOrder({ ...orderData, items: itemsData });
        } else {
            setOrder(orderData);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!order) return;

        // Only confirm for destructive actions
        if (newStatus === 'cancelled' || newStatus === 'rejected') {
            if (!confirm(`Are you sure you want to REJECT this order?`)) return;
        }

        setActionLoading(true);
        const { success, error } = await updateOrderStatus(order.id, newStatus);

        if (!success) {
            addToast('Failed to update status: ' + error, 'error');
        } else {
            setOrder({ ...order, status: newStatus });
            addToast(`Order marked as ${newStatus}`, 'success');
            router.refresh();
        }
        setActionLoading(false);
    };

    const handleUndoStatus = async () => {
        if (!order) return;
        if (!confirm('Undo last status update?')) return;

        setActionLoading(true);
        const { success, error, newStatus } = await undoLastStatusUpdate(order.id);

        if (!success) {
            addToast('Failed to undo: ' + error, 'error');
        } else {
            setOrder({ ...order, status: newStatus as string });
            addToast(`Reverted to ${newStatus}`, 'success');
            router.refresh();
        }
        setActionLoading(false);
    };

    const handleMarkAsPaid = async () => {
        if (!order) return;

        setActionLoading(true);
        const { success, error } = await updatePaymentStatus(order.id, 'paid');

        if (!success) {
            addToast('Failed to update payment: ' + error, 'error');
        } else {
            setOrder({ ...order, payment_status: 'paid' });
            addToast('Payment marked as PAID', 'success');
            router.refresh();
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

    // Calculations
    // Calculations done in render now

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-4">
                <Link href="/admin/orders" className="hover:text-navy-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft size={18} /> Back to Orders
                </Link>
                <span>/</span>
                <span className="font-mono text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</span>
            </div>

            {/* Title & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Order #{order.id.slice(0, 8)}
                        <span className={`text-base px-3 py-1 rounded-full border uppercase tracking-wider ${order.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/30 text-amber-700 dark:text-amber-300' :
                            order.status === 'processing' ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700/30 text-purple-700 dark:text-purple-300' :
                                order.status === 'shipped' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/30 text-blue-700 dark:text-blue-300' :
                                    order.status === 'delivered' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/30 text-green-700 dark:text-green-300' :
                                        'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/30 text-red-700 dark:text-red-300'
                            }`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2" suppressHydrationWarning>
                        <Clock size={16} /> Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                    <InvoiceDownloadButton order={order} variant="outline" />

                    {/* Undo Button - Only show if history exists or status is not pending */}
                    {(order.status !== 'pending' || (order.status_history && order.status_history.length > 0)) && (
                        <button
                            onClick={handleUndoStatus}
                            disabled={actionLoading}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            title="Undo last status update"
                        >
                            <Clock size={20} className="transform -scale-x-100" />
                        </button>
                    )}

                    {isPending && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleUpdateStatus('cancelled')}
                                disabled={actionLoading}
                                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/30 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                            >
                                <XCircle size={20} />
                                Reject Order
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('processing')}
                                disabled={actionLoading}
                                className="bg-navy-900 dark:bg-coral-500 text-white hover:bg-navy-800 dark:hover:bg-coral-600 font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 dark:shadow-coral-500/20 transition-all"
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package size={20} className="text-gray-400" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {items.map((item, idx) => {
                                const meta = item.metadata as any;
                                return (
                                    <div key={idx} className="p-6 flex items-start gap-4">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 relative group">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {item.name}
                                                {meta?.is_custom && (
                                                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                                        Custom
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="space-y-1 mt-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Size: <span className="font-medium text-gray-700 dark:text-gray-300">{meta?.size || item.size || 'N/A'}</span>
                                                    {meta?.color && (
                                                        <> / Color: <span className="font-medium text-gray-700 dark:text-gray-300">{meta.color}</span></>
                                                    )}
                                                </p>

                                                {meta?.is_custom && (
                                                    <div className="mt-4 space-y-4">
                                                        {/* PLACEMENTS GRID */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {meta.placements ? (
                                                                Object.entries(meta.placements as Record<string, any>)
                                                                    .filter(([_, p]) => p.enabled && p.uploadedImage)
                                                                    .map(([loc, p]) => (
                                                                        <div key={loc} className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 flex items-center gap-3">
                                                                            <div className="w-12 h-12 bg-white dark:bg-black/20 rounded border border-gray-200 dark:border-white/10 overflow-hidden flex-shrink-0">
                                                                                <img src={p.uploadedImage} alt={loc} className="w-full h-full object-contain p-1" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{loc}</p>
                                                                                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.printType}</p>
                                                                            </div>
                                                                            <button
                                                                                onClick={async (e) => {
                                                                                    e.preventDefault();
                                                                                    try {
                                                                                        const response = await fetch(p.uploadedImage);
                                                                                        const blob = await response.blob();
                                                                                        const blobUrl = window.URL.createObjectURL(blob);
                                                                                        const link = document.createElement('a');
                                                                                        link.href = blobUrl;
                                                                                        const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_');
                                                                                        let ext = p.uploadedImage.split('.').pop()?.split('?')[0] || 'png';
                                                                                        if (ext.length > 4) ext = 'png';
                                                                                        link.download = `Order_${order.id.slice(0, 8)}_${loc}_${cleanName}.${ext}`;
                                                                                        document.body.appendChild(link);
                                                                                        link.click();
                                                                                        document.body.removeChild(link);
                                                                                        window.URL.revokeObjectURL(blobUrl);
                                                                                    } catch (err) {
                                                                                        addToast('Download failed', 'error');
                                                                                    }
                                                                                }}
                                                                                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                                                                                title="Download Artwork"
                                                                            >
                                                                                <Package size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                            ) : (
                                                                /* Legacy single placement fallback */
                                                                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 flex items-center gap-3 col-span-2">
                                                                    <div className="flex-1">
                                                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Placement Detail (Legacy)</p>
                                                                        <p className="text-xs font-medium text-gray-900 dark:text-white">Type: {meta.print_type || 'N/A'}</p>
                                                                        <p className="text-xs font-medium text-gray-900 dark:text-white">Loc: {meta.placement || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {meta.note && (
                                                            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                                                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase mb-1">Customer Note</p>
                                                                <p className="text-sm italic text-gray-700 dark:text-gray-300">"{meta.note}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                                            <p className="text-xs text-gray-400">₹{item.price} each</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Qty: <span className="font-medium text-gray-700 dark:text-gray-300">{item.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Summary Section with GST & Wallet */}
                        <div className="bg-gray-50 dark:bg-white/5 p-6 space-y-3 border-t border-gray-100 dark:border-white/5">
                            {(() => {
                                // Detailed Bill Logic
                                const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                const walletUsed = order.wallet_amount_used || 0;
                                const couponDiscount = order.discount_amount || 0;
                                const totalPaid = order.total_amount;

                                // Derived Shipping
                                const derivedShipping = Math.max(0, totalPaid - (itemsTotal - couponDiscount - walletUsed));

                                // Tax Calculation (Estimated for display)
                                // Assuming tax is inclusive in the Items Total for simplicity in this view, 
                                // or we can show tax breakdown of the subtotal.
                                // Let's match the Invoice logic: Taxable Value + GST = Items Total
                                const taxRate = 0.18;
                                const taxableValue = itemsTotal / (1 + taxRate);
                                const gstAmount = itemsTotal - taxableValue;

                                return (
                                    <>
                                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                            <span>Items Subtotal</span>
                                            <span>₹{itemsTotal.toFixed(2)}</span>
                                        </div>

                                        {derivedShipping > 0 && (
                                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                                <span>Shipping</span>
                                                <span>₹{derivedShipping.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {couponDiscount > 0 && (
                                            <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                                                <span>Coupon Discount</span>
                                                <span>- ₹{couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {walletUsed > 0 && (
                                            <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                <span>Wallet Credit Used</span>
                                                <span>- ₹{walletUsed.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* GST Breakdown */}
                                        <div className="border-t border-gray-200 dark:border-white/10 my-2 pt-2 pb-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                                <span>Taxable Value (Approx)</span>
                                                <span>₹{taxableValue.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                                <span>GST (18%)</span>
                                                <span>₹{gstAmount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/10">
                                            <span className="font-bold text-gray-900 dark:text-white text-lg">Total Paid</span>
                                            <span className="text-2xl font-bold text-navy-900 dark:text-white">₹{totalPaid.toFixed(2)}</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <CreditCard size={20} className="text-gray-400" />
                            Payment Information
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                                <p className="font-bold text-gray-900 dark:text-white capitalize">{order.payment_method?.replace(/_/g, ' ') || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${order.payment_status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700/30 text-green-700 dark:text-green-300' :
                                        order.payment_status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700/30 text-red-700 dark:text-red-300' :
                                            order.payment_status === 'refunded' ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700/30 text-indigo-700 dark:text-indigo-300' :
                                                'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/30 text-amber-700 dark:text-amber-300'
                                        }`}>
                                        {order.payment_status}
                                    </span>
                                    {order.payment_status !== 'paid' && (
                                        <button
                                            onClick={handleMarkAsPaid}
                                            disabled={actionLoading}
                                            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline disabled:text-gray-400"
                                        >
                                            Mark as Paid
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {order.status === 'pending' && order.payment_status === 'pending' && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-700/30 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                                <div className="min-w-[4px] h-[4px] bg-amber-500 rounded-full mt-2" />
                                <p>This order is waiting for admin approval. Since payment is pending (COD), verifying the customer via phone is recommended before accepting.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <User size={20} className="text-gray-400" />
                            Customer Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                    {order.shipping_address?.firstName?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Info</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{order.shipping_address?.phone}</p>
                                {/* We might want to store email in orders table too if not in address JSON */}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <MapPin size={20} className="text-gray-400" />
                            Shipping Address
                        </h2>
                        <address className="not-italic text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{order.shipping_address?.address}</p>
                            <p>{order.shipping_address?.city}, {order.shipping_address?.pincode}</p>
                            <p>India</p>
                        </address>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Truck size={16} className="text-gray-400" />
                                Delivery Status
                            </h3>
                            {/* Tracking History Timeline */}
                            <div className="relative pl-4 border-l-2 border-gray-100 dark:border-white/5 space-y-6">
                                {/* Always show Created At */}
                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 box-content ${isPending && (!order.status_history || order.status_history.length === 0) ? 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.2)]' : 'bg-gray-300 dark:bg-gray-600'
                                        }`} />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                                    <p className="text-xs text-gray-400" suppressHydrationWarning>{new Date(order.created_at).toLocaleString()}</p>
                                </div>

                                {/* Render History Items */}
                                {order.status_history && Array.isArray(order.status_history) && order.status_history.map((hist: any, idx: number) => {
                                    // Determine color based on status
                                    let colorClass = 'bg-gray-500';
                                    let shadowClass = '';
                                    if (hist.status === 'processing') { colorClass = 'bg-purple-500'; shadowClass = 'shadow-[0_0_0_3px_rgba(168,85,247,0.2)]'; }
                                    else if (hist.status === 'shipped') { colorClass = 'bg-blue-500'; shadowClass = 'shadow-[0_0_0_3px_rgba(59,130,246,0.2)]'; }
                                    else if (hist.status === 'delivered') { colorClass = 'bg-green-500'; shadowClass = 'shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'; }
                                    else if (hist.status === 'cancelled') { colorClass = 'bg-red-500'; shadowClass = 'shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'; }

                                    // Only show shadow on the LAST item (current state)
                                    const isLast = idx === order.status_history!.length - 1;
                                    const finalShadow = isLast ? shadowClass : '';

                                    // Determine specific text for cancellation
                                    let displayText = hist.status.replace(/_/g, ' ');
                                    let subText = null;

                                    if (hist.status === 'cancelled') {
                                        if (hist.updated_by === 'Customer') {
                                            displayText = 'Cancelled by Customer';
                                        } else {
                                            displayText = 'Cancelled by Bronc';
                                            // Optional: Show which admin cancelled it if needed
                                            if (hist.updated_by && hist.updated_by.includes('@')) {
                                                subText = `by ${hist.updated_by}`;
                                            }
                                        }
                                    } else if (hist.updated_by && hist.updated_by !== 'Customer') {
                                        // For other statuses, show who updated it if available (and not Customer, just in case)
                                        if (hist.updated_by.includes('@')) {
                                            subText = `by ${hist.updated_by}`;
                                        }
                                    }

                                    return (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 box-content ${colorClass} ${finalShadow}`} />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{displayText}</p>
                                            <p className="text-xs text-gray-400" suppressHydrationWarning>
                                                {new Date(hist.timestamp).toLocaleString()}
                                                {subText && <span className="block text-[10px] text-gray-400">{subText}</span>}
                                            </p>
                                        </div>
                                    );
                                })}

                                {/* Fallback for Old Orders (No History Array) but have status */}
                                {(!order.status_history || order.status_history.length === 0) && order.status !== 'pending' && (
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 box-content ${order.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{order.status}</p>
                                        <p className="text-xs text-gray-400">Date unknown (Legacy)</p>
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
