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
        try {
            if (!orders.length) {
                alert("No orders to export");
                return;
            }

            const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Amount', 'Status', 'Payment', 'City', 'State', 'Pincode'];

            const escapeCsv = (str: string | number | null | undefined) => {
                if (str === null || str === undefined) return '""';
                const stringValue = String(str);
                // Replace newlines with spaces to prevent breaking CSV structure
                const cleanValue = stringValue.replace(/[\r\n]+/g, ' ');
                const escaped = cleanValue.replace(/"/g, '""');
                return `"${escaped}"`;
            };

            const safeFormatDate = (dateStr: string) => {
                try {
                    const d = new Date(dateStr);
                    if (isNaN(d.getTime())) return 'N/A';
                    return format(d, 'yyyy-MM-dd HH:mm');
                } catch {
                    return 'N/A';
                }
            };

            const rows = orders.map(o => [
                o.id,
                safeFormatDate(o.created_at),
                `${o.shipping_address?.firstName || ''} ${o.shipping_address?.lastName || ''}`.trim(),
                o.shipping_address?.email || 'N/A',
                o.shipping_address?.phone || 'N/A',
                o.total_amount,
                o.status,
                o.payment_method,
                o.shipping_address?.city || '',
                o.shipping_address?.state || '',
                o.shipping_address?.pincode || ''
            ]);

            const csvContent = [
                headers.map(escapeCsv).join(','),
                ...rows.map(row => row.map(escapeCsv).join(','))
            ].join('\n');

            // Use Uint8Array for BOM to ensure correct encoding without string manipulation issues
            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
            const blob = new Blob([bom, csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `orders_export_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err: any) {
            console.error("Orders Export Failed:", err);
            alert("Failed to export Orders CSV: " + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all customer orders.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-sm shadow-sm"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <OrderTable orders={orders} loading={loading} />
        </div>
    );
}
