'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { CreditCard, DollarSign, Download, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface Transaction {
    id: string; // Order ID essentially
    created_at: string;
    total_amount: number;
    payment_status: string;
    payment_method: string;
    user_name: string;
}

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (orders) {
            const txs = orders.map(o => ({
                id: o.id,
                created_at: o.created_at,
                total_amount: o.total_amount,
                payment_status: o.payment_status,
                payment_method: o.payment_method,
                user_name: `${o.shipping_address?.firstName} ${o.shipping_address?.lastName}`
            }));
            setTransactions(txs);
        }
        setLoading(false);
    };

    const totalCollected = transactions
        .filter(t => t.payment_status === 'paid')
        .reduce((sum, t) => sum + t.total_amount, 0);

    const totalPending = transactions
        .filter(t => t.payment_status === 'pending')
        .reduce((sum, t) => sum + t.total_amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Transactions</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCollected)}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Amount</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPending)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                    <button className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1 hover:underline">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#FAF9F7] dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                        {tx.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {tx.user_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">
                                        {tx.payment_method}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(tx.total_amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${tx.payment_status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' :
                                            tx.payment_status === 'failed' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' :
                                                'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
                                            }`}>
                                            {tx.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
