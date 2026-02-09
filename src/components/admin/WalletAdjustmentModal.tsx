'use client';

import React, { useState } from 'react';
import { X, Loader2, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { manualWalletAdjustment } from '@/actions/adminActions';
import { useToast } from '@/context/ToastContext';

interface WalletAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: {
        user_id: string;
        name: string;
        email: string;
    } | null;
    onSuccess?: () => void;
}

export default function WalletAdjustmentModal({ isOpen, onClose, customer, onSuccess }: WalletAdjustmentModalProps) {
    const { addToast } = useToast();
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'credit' | 'debit'>('credit');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !customer) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (!reason.trim()) {
            alert("Please provide a reason");
            return;
        }

        setLoading(true);
        try {
            const { success, error } = await manualWalletAdjustment(customer.user_id, value, type, reason);

            if (success) {
                addToast(`Successfully ${type === 'credit' ? 'credited' : 'debited'} ₹${value}`, 'success');
                setAmount('');
                setReason('');
                onSuccess?.();
                onClose();
            } else {
                alert(`Failed: ${error}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Wallet className="text-navy-900" size={20} />
                        Manage Wallet
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Customer</p>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Transaction Type */}
                        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setType('credit')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'credit'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <ArrowDownLeft size={16} /> Credit (Add)
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('debit')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'debit'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <ArrowUpRight size={16} /> Debit (Remove)
                            </button>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900/10 text-lg font-mono"
                                placeholder="0.00"
                                min="1"
                                required
                            />
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Reason / Note</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none h-24"
                                placeholder="e.g. Refund for Order #123, Promotional Bonus, etc."
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${type === 'credit'
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Transaction'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
