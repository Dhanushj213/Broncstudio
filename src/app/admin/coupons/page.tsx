'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Filter, Trash2, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    usage_count: number;
    usage_limit: number | null;
    is_active: boolean;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => Promise<void>;
        isDanger: boolean;
        confirmText: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: async () => { },
        isDanger: false,
        confirmText: 'Confirm'
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching coupons:', error);
            // Don't alert here as it might just be the table missing initially
        } else {
            setCoupons(data || []);
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean, quiet = false) => {
        const { error } = await supabase
            .from('coupons')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (error) {
            addToast('Failed to update status: ' + error.message, 'error');
        } else {
            setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
            if (!quiet) addToast(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
        }
    };

    const executeDelete = async (id: string, code: string) => {
        const { error } = await supabase.from('coupons').delete().eq('id', id);

        if (error) {
            if (error.code === '23503') { // Foreign Key Violation
                // Close current modal and open the "Deactivate" suggestion modal
                setModalConfig({
                    isOpen: true,
                    title: 'Cannot Delete Coupon',
                    message: `The coupon "${code}" cannot be deleted because it has been used in existing orders.\n\nWould you like to deactivate it instead? This will prevent future use.`,
                    confirmText: 'Deactivate Coupon',
                    isDanger: false,
                    action: async () => {
                        await toggleStatus(id, true, true);
                        addToast(`Coupon "${code}" deactivated successfully.`, 'success');
                    }
                });
            } else {
                addToast('Failed to delete: ' + error.message, 'error');
            }
        } else {
            setCoupons(coupons.filter(c => c.id !== id));
            addToast('Coupon deleted successfully', 'success');
        }
    };

    const confirmDelete = (id: string, code: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Coupon?',
            message: `Are you sure you want to delete "${code}"? This action cannot be undone.`,
            confirmText: 'Delete',
            isDanger: true,
            action: () => executeDelete(id, code)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage discounts and promotions</p>
                </div>
                <Link href="/admin/coupons/new">
                    <button className="bg-navy-900 dark:bg-coral-500 text-white hover:bg-navy-800 dark:hover:bg-coral-600 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 dark:shadow-coral-500/20 transition-all">
                        <Plus size={20} />
                        Create Coupon
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-navy-900 dark:text-white" /></div>
            ) : coupons.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    <Tag size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No coupons found. Create your first one!</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#FAF9F7] dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">{coupon.code}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%`
                                            : coupon.discount_type === 'fixed_amount'
                                                ? `₹${coupon.discount_value}`
                                                : 'Free Shipping'
                                        }
                                    </td>
                                    <td className="px-6 py-4 self-center text-gray-600 dark:text-gray-400">
                                        {coupon.usage_count} / {coupon.usage_limit || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${coupon.is_active
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                                                }`}
                                        >
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => confirmDelete(coupon.id, coupon.code)}
                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Delete Coupon"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.action}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                isDanger={modalConfig.isDanger}
            />
        </div>
    );
}
