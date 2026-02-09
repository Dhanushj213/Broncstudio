'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { Wallet, History, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { getWalletBalance, getWalletHistory } from '@/actions/walletActions';
import { useUI } from '@/context/UIContext';

export default function WalletPage() {
    const { formatPrice } = useUI();
    interface WalletTransaction {
        id: string;
        amount: number;
        type: 'credit' | 'debit';
        reason: string;
        created_at: string;
    }

    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const { balance: bal } = await getWalletBalance();
                const hist = await getWalletHistory();
                setBalance(bal);
                setHistory(hist);
            } catch (e) {
                console.error("Failed to load wallet data", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getReasonLabel = (reason: string) => {
        switch (reason) {
            case 'purchase_cashback': return 'Cashback Earned';
            case 'referral_bonus': return 'Referral Bonus';
            case 'order_redemption': return 'Used on Order';
            case 'admin_adjustment': return 'Admin Adjustment';
            case 'expiry': return 'Expired';
            default: return reason.replace(/_/g, ' ');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] dark:bg-black pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            <div className="container-premium max-w-[800px] mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-900 dark:text-white mb-4">
                        Your Wallet
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your credits and transaction history.
                    </p>
                </div>

                {/* Balance Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-navy-900 dark:bg-white/10 rounded-3xl p-8 mb-12 shadow-xl text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500 rounded-bl-[100%] opacity-20 -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10">
                        <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-2">Current Balance</p>
                        <div className="text-5xl md:text-6xl font-heading font-bold mb-6">
                            {loading ? '...' : formatPrice(balance)}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 text-sm text-white/80">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-400" />
                                <span>Use up to 10% on orders over ₹999</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-400" />
                                <span>Credits expire in 30 days</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Explainer / Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                            <Wallet size={18} className="text-coral-500" /> How to Earn
                        </h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• <strong>5% Cashback</strong> on every delivered order.</li>
                            <li>• <strong>₹100 Bonus</strong> for referring a friend.</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                            <History size={18} className="text-amber-500" /> How to Use
                        </h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• Minimum order value <strong>₹999</strong>.</li>
                            <li>• Max usage: <strong>10%</strong> of cart value.</li>
                            <li>• Cannot be used for Cash on Delivery.</li>
                        </ul>
                    </div>
                </div>

                {/* History */}
                <div>
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">Transaction History</h2>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border border-gray-100 dark:border-white/10 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet.</p>
                            <Link href="/shop" className="inline-flex items-center gap-2 text-navy-900 dark:text-white font-bold hover:text-coral-500 transition-colors">
                                Start Shopping <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden divide-y divide-gray-100 dark:divide-white/10">
                            {history.map((item) => (
                                <div key={item.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'credit'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {item.type === 'credit' ? <ArrowRight size={16} className="-rotate-45" /> : <ArrowRight size={16} className="rotate-45" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-navy-900 dark:text-white capitalize">
                                                {getReasonLabel(item.reason)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${item.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {item.type === 'credit' ? '+' : ''}{formatPrice(item.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
