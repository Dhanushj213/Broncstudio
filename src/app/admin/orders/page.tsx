'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import OrderTable from '@/components/admin/OrderTable';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            // Fetch all orders - in production we should paginate server-side
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(data);
            }
            if (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, []);

    const handleExportCSV = () => {
        if (!orders.length) return;

        // Basic CSV Logic
        const headers = ['Order ID', 'Date', 'Customer', 'Amount', 'Status', 'Payment', 'City'];
        const rows = orders.map(o => [
            o.id,
            format(new Date(o.created_at), 'yyyy-MM-dd HH:mm'),
            `${o.shipping_address?.firstName} ${o.shipping_address?.lastName}`,
            o.total_amount,
            o.status,
            o.payment_method,
            o.shipping_address?.city || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${format(new Date(), 'yyyyMMdd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track all customer orders.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <OrderTable orders={orders} loading={loading} />
        </div>
    );
}
