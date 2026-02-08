'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Filter, Trash2, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (error) {
            alert('Failed to delete: ' + error.message);
        } else {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                    <p className="text-gray-500 text-sm">Manage discounts and promotions</p>
                </div>
                <Link href="/admin/coupons/new">
                    <button className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all">
                        <Plus size={20} />
                        Create Coupon
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : coupons.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                    <Tag size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No coupons found. Run the SQL migration first!</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{coupon.code}</td>
                                    <td className="px-6 py-4">
                                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                    </td>
                                    <td className="px-6 py-4 self-center">
                                        {coupon.usage_count} / {coupon.usage_limit || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(coupon.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
