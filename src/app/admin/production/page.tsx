'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Download, CheckCircle, Printer, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

// Types
interface ProductionItem {
    id: string; // order_item id
    order_id: string;
    product_name: string;
    quantity: number;
    size?: string;
    image_url: string;
    metadata?: any;
    created_at: string;
    order_status: string;
    customer_name: string;
}

export default function ProductionPage() {
    const [items, setItems] = useState<ProductionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const { addToast } = useToast();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchProductionQueue = async () => {
            setLoading(true);

            // Fetch orders that are confirmed (processing or pending payment-paid)
            // For simplicity, we fetch 'processing' status which usually means paid & ready.
            // We might also want to include 'pending' if it's COD and verified. 
            // Let's stick to 'processing' for now as the "Production Queue".

            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('id, created_at, status, shipping_address')
                .in('status', ['processing', 'pending']) // Include pending for visibility, but maybe separate them
                .order('created_at', { ascending: true });

            if (ordersError) {
                console.error('Error fetching orders:', ordersError);
                setLoading(false);
                return;
            }

            if (!orders || orders.length === 0) {
                setItems([]);
                setLoading(false);
                return;
            }

            const orderIds = orders.map(o => o.id);

            // Fetch Items for these orders
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .in('order_id', orderIds);

            if (itemsError) {
                console.error('Error fetching items:', itemsError);
                setLoading(false);
                return;
            }

            // Map items to include order details
            const productionItems: ProductionItem[] = orderItems.map(item => {
                const order = orders.find(o => o.id === item.order_id);
                return {
                    id: item.id,
                    order_id: item.order_id,
                    product_name: item.name,
                    quantity: item.quantity,
                    size: item.size || item.metadata?.size,
                    image_url: item.metadata?.image_url || item.image_url,
                    metadata: item.metadata,
                    created_at: order?.created_at,
                    order_status: order?.status,
                    customer_name: `${order?.shipping_address?.firstName} ${order?.shipping_address?.lastName}`
                };
            });

            setItems(productionItems);
            setLoading(false);
        };

        fetchProductionQueue();
    }, []);

    const handleDownloadAll = async () => {
        if (items.length === 0) return;
        setDownloading(true);
        const zip = new JSZip();
        let count = 0;

        try {
            const promises = items.map(async (item) => {
                if (!item.image_url) return;

                try {
                    // Fetch image through proxy or directly if CORS allows
                    // If CORS is an issue, we might need a server action or proxy. Usually Supabase storage is fine.
                    const response = await fetch(item.image_url);
                    const blob = await response.blob();

                    // Filename: OrderID_ProductName_Size_Qty.png
                    const safeName = item.product_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    const filename = `${item.order_id.slice(0, 5)}_${safeName}_${item.size || 'NA'}_${item.quantity}.png`;

                    zip.file(filename, blob);
                    count++;
                } catch (err) {
                    console.error(`Failed to download image for ${item.product_name}`, err);
                }
            });

            await Promise.all(promises);

            if (count > 0) {
                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, `production_batch_${format(new Date(), 'yyyyMMdd_HHmm')}.zip`);
                addToast(`Downloaded ${count} designs`, 'success');
            } else {
                addToast('No valid images found to download', 'info');
            }

        } catch (error) {
            console.error('Error zipping files:', error);
            addToast('Failed to create zip file', 'error');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Printer size={24} className="text-navy-900" />
                        Production Queue
                    </h1>
                    <p className="text-gray-500 mt-1">Manage print jobs and download design files for processing.</p>
                </div>
                <button
                    onClick={handleDownloadAll}
                    disabled={downloading || items.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {downloading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Preparing Zip...
                        </>
                    ) : (
                        <>
                            <Download size={18} /> Download All Designs ({items.length})
                        </>
                    )}
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-400">Loading production queue...</div>
            ) : items.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500">No orders currently waiting in the processing queue.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">Print Spec</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 text-center">Qty</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            <Link href={`/admin/orders/${item.order_id}`} className="hover:text-blue-600 hover:underline">
                                                #{item.order_id.slice(0, 8)}
                                            </Link>
                                            <div className={`mt-1 text-xs px-2 py-0.5 rounded w-fit capitalize ${item.order_status === 'processing' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {item.order_status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden relative group">
                                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    <p className="text-gray-500 text-xs">Size: {item.size || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Show print details if custom */}
                                            {item.metadata?.is_custom ? (
                                                <div className="text-xs">
                                                    <span className="font-bold">Type:</span> {item.metadata.print_type}<br />
                                                    <span className="font-bold">Pos:</span> {item.metadata.placement}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Standard Item</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.customer_name}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.image_url && (
                                                <a
                                                    href={item.image_url}
                                                    download
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Download Design"
                                                >
                                                    <Download size={18} />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
