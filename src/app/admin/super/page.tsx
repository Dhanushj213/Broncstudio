'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, ShieldAlert, UserCheck, Search, Shield, ShieldOff, AlertTriangle, CreditCard, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface UserProfile {
    id: string;
    email: string;
    role: 'user' | 'admin' | 'super_admin';
    created_at: string;
}

export default function SuperAdminPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    // Payment Settings State
    const [paymentSettings, setPaymentSettings] = useState<any>({
        razorpay_active: false,
        razorpay_key_id: '',
        razorpay_key_secret: '',
        phonepe_active: false,
        phonepe_merchant_id: '',
        phonepe_salt_key: '',
        phonepe_salt_index: '1',
        phonepe_env: 'UAT'
    });
    const [savingPayments, setSavingPayments] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchProfiles();
        fetchPaymentSettings();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            addToast('Error fetching user profiles. Ensure Super Admin policies are applied.', 'error');
            console.error(error);
        } else if (data) {
            setProfiles(data as UserProfile[]);
        }
        setLoading(false);
    };

    const fetchPaymentSettings = async () => {
        const { data, error } = await supabase
            .from('payment_settings')
            .select('*')
            .limit(1)
            .single();

        if (data) {
            setPaymentSettings(data);
        }
    };

    const savePaymentSettings = async () => {
        setSavingPayments(true);
        // Supabase update assuming single row exists
        const { error } = await supabase
            .from('payment_settings')
            .update({
                razorpay_active: paymentSettings.razorpay_active,
                razorpay_key_id: paymentSettings.razorpay_key_id,
                razorpay_key_secret: paymentSettings.razorpay_key_secret,
                phonepe_active: paymentSettings.phonepe_active,
                phonepe_merchant_id: paymentSettings.phonepe_merchant_id,
                phonepe_salt_key: paymentSettings.phonepe_salt_key,
                phonepe_salt_index: paymentSettings.phonepe_salt_index,
                phonepe_env: paymentSettings.phonepe_env,
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentSettings.id);

        if (error) {
            addToast('Failed to save payment settings.', 'error');
            console.error(error);
        } else {
            addToast('Payment gateway settings updated securely!', 'success');
        }
        setSavingPayments(false);
    };

    const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            addToast(`Failed to update role: ${error.message}`, 'error');
        } else {
            addToast('User role updated successfully!', 'success');
            // Optimistic update
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
        }
    };

    const filteredProfiles = profiles.filter(p =>
        (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="text-coral-500" /> Super Admin Control
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage administrator access and core platform settings.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'users' ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                    <UserCheck size={18} /> User Access
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                    <CreditCard size={18} /> Payment Gateways
                </button>
            </div>

            {activeTab === 'users' ? (
                <>

                    {/* Warning Banner */}
                    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-xl flex gap-3 text-orange-800 dark:text-orange-200">
                        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <strong>Critical Security Area:</strong> Granting 'admin' status furnishes full write-access to the store's inventory, orders, and site settings. Treat role elevation with extreme caution.
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] shadow-sm rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96 text-gray-500 dark:text-gray-400 flex items-center">
                                <Search className="absolute left-3 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by email or role..."
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-coral-500 transition-colors text-gray-900 dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {filteredProfiles.length} Users Found
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
                            </div>
                        ) : profiles.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No profiles found. Either the database is empty or Super Admin RLS is blocking the query.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                    <thead className="bg-[#F8F9FA] dark:bg-[#1A2234] text-gray-900 dark:text-white uppercase font-bold text-xs sticky top-0 z-10 shadow-sm border-b border-gray-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-6 py-4">User Details</th>
                                            <th className="px-6 py-4">Role Status</th>
                                            <th className="px-6 py-4">Joined On</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredProfiles.map((profile) => (
                                            <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900 dark:text-white">
                                                        {profile.email || 'No Email Listed (OAuth/Anonymous)'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono mt-1 w-48 truncate" title={profile.id}>
                                                        ID: {profile.id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${profile.role === 'super_admin'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                                        : profile.role === 'admin'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}>
                                                        {profile.role === 'super_admin' && <ShieldAlert size={12} />}
                                                        {profile.role === 'admin' && <Shield size={12} />}
                                                        {profile.role === 'user' && <UserCheck size={12} />}
                                                        {profile.role.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(profile.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {/* Action Toggles */}
                                                    {profile.role === 'super_admin' ? (
                                                        <span className="text-xs text-gray-400 italic">Core Owner</span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            {profile.role === 'admin' ? (
                                                                <button
                                                                    onClick={() => handleRoleUpdate(profile.id, 'user')}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg text-xs font-bold transition-colors border border-red-100 dark:border-red-500/20"
                                                                >
                                                                    <ShieldOff size={14} /> Revoke Admin
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleRoleUpdate(profile.id, 'admin')}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors border border-blue-100 dark:border-blue-500/20"
                                                                >
                                                                    <Shield size={14} /> Make Admin
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="space-y-6 max-w-4xl">
                    <div className="bg-white dark:bg-[#111827] shadow-sm rounded-xl border border-gray-200 dark:border-white/10 p-6 md:p-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Razorpay Settings</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Configure keys for Indian card, UPI, and Netbanking payments.</p>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={paymentSettings?.razorpay_active || false}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpay_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-coral-500 focus:ring-coral-500 bg-gray-50 dark:bg-white/5 dark:border-white/10"
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">Enable Razorpay Checkout</span>
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key ID</label>
                                        <input
                                            type="text"
                                            value={paymentSettings?.razorpay_key_id || ''}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpay_key_id: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-coral-500 transition-colors"
                                            placeholder="rzp_live_..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Secret</label>
                                        <input
                                            type="password"
                                            value={paymentSettings?.razorpay_key_secret || ''}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpay_key_secret: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-coral-500 transition-colors"
                                            placeholder="••••••••••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-white/10" />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">PhonePe Settings</h2>
                                <select
                                    value={paymentSettings?.phonepe_env || 'UAT'}
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, phonepe_env: e.target.value })}
                                    className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none"
                                >
                                    <option value="UAT">UAT (Testing)</option>
                                    <option value="PROD">Production</option>
                                </select>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Configure keys for standard PhonePe payment gateway integration.</p>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer mb-6">
                                    <input
                                        type="checkbox"
                                        checked={paymentSettings?.phonepe_active || false}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, phonepe_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-coral-500 focus:ring-coral-500 bg-gray-50 dark:bg-white/5 dark:border-white/10"
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">Enable PhonePe Checkout</span>
                                </label>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Merchant ID</label>
                                    <input
                                        type="text"
                                        value={paymentSettings?.phonepe_merchant_id || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, phonepe_merchant_id: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-coral-500 transition-colors font-mono"
                                        placeholder="PGTESTPAYUAT"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Salt Key</label>
                                        <input
                                            type="password"
                                            value={paymentSettings?.phonepe_salt_key || ''}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, phonepe_salt_key: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-coral-500 transition-colors font-mono"
                                            placeholder="099eb0cd-02cf..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Salt Index</label>
                                        <input
                                            type="text"
                                            value={paymentSettings?.phonepe_salt_index || '1'}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, phonepe_salt_index: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-coral-500 transition-colors font-mono"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                onClick={savePaymentSettings}
                                disabled={savingPayments}
                                className="flex items-center gap-2 bg-coral-500 hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-coral-500/30"
                            >
                                {savingPayments ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Gateway Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
