'use client';

import React, { useEffect, useState } from 'react';
import { Wallet, History, ArrowUpRight, ArrowDownLeft, CreditCard, Plus, ArrowLeft } from 'lucide-react';
import { getWalletBalance, getWalletHistory, processWalletTransaction } from '@/actions/walletActions';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function WalletPage() {
    const { addToast } = useToast();
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingFunds, setAddingFunds] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        setLoading(true);
        const [balanceData, historyData] = await Promise.all([
            getWalletBalance(),
            getWalletHistory()
        ]);
        setBalance(balanceData.balance);
        setHistory(historyData);
        setLoading(false);
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amountToAdd);
        if (isNaN(value) || value < 100) {
            alert("Minimum top-up amount is ₹100");
            return;
        }

        // Simulate Payment Gateway Success
        // In reality, this would redirect to Razorpay/Stripe, then webhook would credit wallet.
        // For demo/simplicity:
        if (confirm(`Proceed to add ₹${value} to your wallet? (Simulation)`)) {
            // We need a server action that allows users to 'self-credit' via payment simulation
            // Since `processWalletTransaction` takes a userId and is server-side, we can't call it directly with our own ID easily without auth check context
            // But we can create a wrapper or just use a temporary simulated action.

            // NOTE: In production, NEVER allow client to dictate credit without PG verification.
            alert("Redirecting to Payment Gateway...");

            // Simul:
            setTimeout(() => {
                alert("Payment Successful! Wallet Credited.");
                // trigger refresh
                fetchWalletData();
                setAddingFunds(false);
                setAmountToAdd('');
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 transition-colors">
            <div className="max-w-2xl mx-auto space-y-8 pt-12">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wallet className="text-coral-500" /> My Wallet
                    </h1>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <p className="text-white/70 font-medium mb-2">Available Balance</p>
                        <h2 className="text-5xl font-heading font-bold mb-8">{formatPrice(balance)}</h2>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setAddingFunds(!addingFunds)}
                                className="bg-white text-navy-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <Plus size={18} /> Add Money
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Funds Form */}
                {addingFunds && (
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 animate-in slide-in-from-top-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top-up Wallet</h3>
                        <form onSubmit={handleAddFunds} className="flex gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    placeholder="Enter amount (Min ₹100)"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-coral-500"
                                />
                            </div>
                            <button type="submit" className="bg-coral-500 text-white px-6 rounded-xl font-bold hover:bg-coral-600 transition-colors">
                                Pay
                            </button>
                        </form>
                    </div>
                )}

                {/* History */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <History size={20} className="text-gray-400" /> Transaction History
                    </h3>

                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading history...</div>
                        ) : history.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No transactions yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-white/10">
                                {history.map((tx) => (
                                    <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white capitalize">{tx.reason.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(tx.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatPrice(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
