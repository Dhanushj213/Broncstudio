'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Wallet, Search, PlusCircle, MinusCircle, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';
import { manualWalletAdjustment } from '@/actions/adminActions';
import { useToast } from '@/context/ToastContext';

interface WalletUser {
    user_id: string; // The ID from wallet_balances
    balance: number;
    updated_at: string;
    email?: string; // Fetched separately or joined
    name?: string;
}

export default function FinancePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [walletUsers, setWalletUsers] = useState<WalletUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<WalletUser | null>(null);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const { addToast } = useToast();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Search logic: 
        // 1. Search users table by email/name to get ID
        // 2. Fetch wallet balance for that ID
        // Note: Supabase Auth users table is not directly queryable by standard client usually unless exposed via public view.
        // Assuming we have a 'public.users' table or similar from previous context?
        // If not, we can only search by User ID if we dont have a public users table synchronised.
        // Let's assume we search `orders` to find users for now (hacky but works if they have orders)
        // OR: We just listed 'wallet_balances' directly if we want to see who has money.

        // Strategy: List top wallet holders if empty search. If search, try to find user.

        let query = supabase.from('wallet_balances').select('*');

        if (searchQuery) {
            // Ideally we join with a users table. 
            // Since I don't know if 'public.users' exists and is synced with auth.users, 
            // I will try to fetch by ID if it looks like a UUID, else warn.
            if (searchQuery.includes('-')) {
                query = query.eq('user_id', searchQuery);
            } else {
                // Try to find user ID from orders table by email (hacky fallback)
                const { data: orderUser } = await supabase.from('orders').select('user_id').ilike('shipping_address->>email', `%${searchQuery}%`).limit(1);
                if (orderUser && orderUser.length > 0) {
                    query = query.eq('user_id', orderUser[0].user_id);
                } else {
                    addToast('User not found (Try User ID)', 'error');
                    setLoading(false);
                    return;
                }
            }
        } else {
            query = query.order('balance', { ascending: false }).limit(20);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
            addToast('Search failed', 'error');
        } else if (data) {
            setWalletUsers(data);
        }
        setLoading(false);
    };

    const handleAdjustWallet = async (type: 'credit' | 'debit') => {
        if (!selectedUser || !amount || !reason) {
            addToast('Please fill all fields', 'error');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            addToast('Invalid amount', 'error');
            return;
        }

        const { success, error } = await manualWalletAdjustment(selectedUser.user_id, numericAmount, type, reason);

        if (success) {
            addToast(`Wallet ${type}ed successfully`, 'success');
            // Refresh balance
            const { data } = await supabase.from('wallet_balances').select('balance').eq('user_id', selectedUser.user_id).single();
            if (data) {
                setWalletUsers(prev => prev.map(u => u.user_id === selectedUser.user_id ? { ...u, balance: data.balance } : u));
                setSelectedUser(prev => prev ? { ...prev, balance: data.balance } : null);
            }
            setAmount('');
            setReason('');
        } else {
            addToast('Adjustment failed: ' + error, 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wallet size={24} className="text-navy-900" />
                        Finance & Wallet
                    </h1>
                    <p className="text-gray-500 mt-1">Manage user wallet balances and handle refunds.</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search by User ID (or Email via Orders)"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" disabled={loading} className="px-6 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors">
                    {loading ? 'Searching...' : <Search size={20} />}
                </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Users List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">User ID</th>
                                    <th className="px-6 py-4">Current Balance</th>
                                    <th className="px-6 py-4">Updated</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {walletUsers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-400">No users found or search to begin.</td></tr>
                                ) : (
                                    walletUsers.map(user => (
                                        <tr key={user.user_id} className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.user_id === user.user_id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedUser(user)}>
                                            <td className="px-6 py-4 font-mono text-gray-600">{user.user_id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">₹{user.balance.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-gray-500">{format(new Date(user.updated_at), 'MMM d, yyyy')}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 font-bold text-xs hover:underline">Select</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Panel */}
                <div>
                    {selectedUser ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Adjust Balance</h3>
                            <p className="text-sm text-gray-500 mb-6">User: <span className="font-mono text-gray-700">{selectedUser.user_id.slice(0, 8)}</span></p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Reason / Note</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                                        rows={3}
                                        placeholder="e.g. Refund for Order #123"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button
                                        onClick={() => handleAdjustWallet('credit')}
                                        className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                                    >
                                        <PlusCircle size={20} /> Credit
                                    </button>
                                    <button
                                        onClick={() => handleAdjustWallet('debit')}
                                        className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                                    >
                                        <MinusCircle size={20} /> Debit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center border-dashed">
                            <Wallet size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Select a user to manage their wallet balance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
