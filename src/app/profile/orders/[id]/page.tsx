'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Clock, MapPin, CreditCard, ChevronRight, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import InvoiceDownloadButton from '@/components/Invoice/InvoiceDownloadButton';


interface OrderItem {
    id?: string;
    product_id?: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
    size?: string;
    metadata?: any;
}

interface StatusHistory {
    status: string;
    timestamp: string;
    updated_by?: string;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    payment_method: string;
    payment_status: string;
    user_id: string;
    items?: OrderItem[];
    status_history?: StatusHistory[];
    coupon_discount?: number;
    discount_amount?: number;
    wallet_amount_used?: number;
}

export default function OrderDetailsPage() {
    const { formatPrice } = useUI();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string);
        }
    }, [params.id]);

    const fetchOrder = async (id: string) => {
        setLoading(true);
        // Fetch Order
        const { data: orderData, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Fetch Items
        const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', id);

        setOrder({ ...orderData, items: itemsData || [] });
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Order...</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
            case 'processing': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300';
            case 'shipped': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
            case 'delivered': return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300';
            case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <main className="bg-page min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <Link href="/profile/orders" className="p-2 rounded-full bg-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm flex-shrink-0 border border-subtle">
                        <ArrowLeft size={20} className="text-primary" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-primary font-heading truncate">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-sm text-gray-500" suppressHydrationWarning>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <InvoiceDownloadButton order={order} variant="outline" />
                </div>

                {/* Status Timeline Card */}
                <div className="bg-card p-6 rounded-2xl border border-subtle shadow-sm mb-6">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Truck size={18} className="text-gray-400" /> Order Timeline
                    </h3>

                    <div className="space-y-6 pl-4 border-l-2 border-subtle relative">
                        {/* Created At */}
                        <div className="relative">
                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-card box-content bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.1)]`} />
                            <p className="text-sm font-bold text-primary">Order Placed</p>
                            <p className="text-xs text-gray-500" suppressHydrationWarning>{new Date(order.created_at).toLocaleString()}</p>
                        </div>

                        {/* Dynamic History */}
                        {order.status_history && order.status_history.map((hist, idx) => {
                            let dotColor = 'bg-gray-400';
                            if (hist.status === 'processing') dotColor = 'bg-purple-500';
                            if (hist.status === 'shipped') dotColor = 'bg-blue-500';
                            if (hist.status === 'delivered') dotColor = 'bg-green-500';
                            if (hist.status === 'cancelled') dotColor = 'bg-red-500';

                            const isLast = idx === order.status_history!.length - 1;
                            const shadow = isLast ? `shadow-[0_0_0_3px_rgba(0,0,0,0.1)]` : '';

                            // Determine specific text for cancellation
                            let displayText = hist.status.replace(/_/g, ' ');
                            if (hist.status === 'cancelled') {
                                if (hist.updated_by === 'Customer') {
                                    displayText = 'Cancelled by Customer';
                                } else {
                                    displayText = 'Cancelled by Bronc';
                                }
                            }

                            return (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-card box-content ${dotColor} ${shadow}`} />
                                    <p className="text-sm font-bold text-primary capitalize">{displayText}</p>
                                    <p className="text-xs text-gray-500" suppressHydrationWarning>{new Date(hist.timestamp).toLocaleString()}</p>
                                </div>
                            )
                        })}

                        {/* Legacy Support if no history */}
                        {(!order.status_history || order.status_history.length === 0) && order.status !== 'pending' && (
                            <div className="relative">
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-card box-content ${getStatusColor(order.status).split(' ')[0].replace('100', '500')}`} />
                                <p className="text-sm font-bold text-primary capitalize">{order.status}</p>
                                <p className="text-xs text-gray-500">Current Status</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="bg-card rounded-2xl border border-subtle shadow-sm overflow-hidden mb-4">
                    <div className="p-4 border-b border-subtle font-bold text-primary">Items ({order.items?.length || 0})</div>
                    <div className="divide-y divide-subtle">
                        {order.items?.map((item, i) => {
                            const meta = item.metadata;
                            return (
                                <div key={i} className="p-4 flex gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                        <Image
                                            src={meta?.image_url || item.image_url}
                                            alt={item.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-primary">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        {meta?.is_custom && (
                                            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                                                Customized
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-bold text-primary">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 space-y-2">
                        {/* Calculate subtotal from items */}
                        {(() => {
                            // Invoice Logic Matching
                            const itemsTotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

                            // Tax Calculation (Additive)
                            // Using flat 18% to match Invoice's output for this order.
                            const totalTax = itemsTotal * 0.18;

                            // Coupon - Strict match to Invoice (only coupon_discount)
                            const coupon = order.discount_amount || order.coupon_discount || 0;
                            const wallet = order.wallet_amount_used || 0;

                            // Derive Shipping
                            // Shipping = Total - (Items + Tax) + Coupon + Wallet
                            const calculatedGross = itemsTotal + totalTax;
                            const rawShipping = order.total_amount - calculatedGross + coupon + wallet;
                            const derivedShipping = Math.max(0, parseFloat(rawShipping.toFixed(2)));

                            const state = order.shipping_address?.state?.toLowerCase() || '';
                            const isInterState = !(state === 'karnataka' || state === 'ka');

                            return (
                                <>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(itemsTotal)}</span>
                                    </div>

                                    {derivedShipping > 0 && (
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Shipping</span>
                                            <span>{formatPrice(derivedShipping)}</span>
                                        </div>
                                    )}

                                    {coupon > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Coupon Discount</span>
                                            <span>-{formatPrice(coupon)}</span>
                                        </div>
                                    )}

                                    {wallet > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Wallet Used</span>
                                            <span>-{formatPrice(wallet)}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-subtle pt-2 pb-2 my-1">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Taxable Value</span>
                                            <span>{formatPrice(parseFloat(itemsTotal.toFixed(2)))}</span>
                                        </div>
                                        {isInterState ? (
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>IGST (18%)</span>
                                                <span>{formatPrice(parseFloat(totalTax.toFixed(2)))}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>CGST (9%)</span>
                                                    <span>{formatPrice(parseFloat((totalTax / 2).toFixed(2)))}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>SGST (9%)</span>
                                                    <span>{formatPrice(parseFloat((totalTax / 2).toFixed(2)))}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-subtle pt-2 mt-2">
                                        <span className="font-bold text-primary">Total Paid</span>
                                        <span className="text-xl font-bold text-primary">{formatPrice(order.total_amount)}</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping */}
                    <div className="bg-card p-6 rounded-2xl border border-subtle shadow-sm">
                        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-400" /> Shipping Details
                        </h3>
                        <p className="font-bold text-primary text-sm">
                            {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed mt-1">
                            {order.shipping_address?.address}<br />
                            {order.shipping_address?.city} - {order.shipping_address?.pincode}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{order.shipping_address?.phone}</p>
                    </div>

                    {/* Payment */}
                    <div className="bg-card p-6 rounded-2xl border border-subtle shadow-sm">
                        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-gray-400" /> Payment Info
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Method</span>
                            <span className="text-sm font-bold text-primary capitalize">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {order.payment_status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Link href="/profile/support" className="text-coral-500 font-bold text-sm hover:underline">Need Help with this Order?</Link>
                </div>
            </div>
        </main>
    );
}
