'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCouponPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        usage_limit: '',
        is_active: true
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('coupons').insert({
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            discount_value: parseFloat(formData.discount_value),
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            is_active: formData.is_active
        });

        if (error) {
            alert('Error: ' + error.message);
        } else {
            router.push('/admin/coupons');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <Link href="/admin/coupons" className="text-gray-500 hover:text-navy-900 flex items-center gap-1 mb-6">
                <ArrowLeft size={18} /> Back to Coupons
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Coupon</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code *</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg uppercase bg-white text-gray-900"
                        placeholder="SUMMER20"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900"
                            value={formData.discount_type}
                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed_amount">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Value *</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900"
                            placeholder="20"
                            value={formData.discount_value}
                            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Usage Limit (Optional)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900"
                        placeholder="e.g. 100"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5"
                    />
                    <span className="font-bold text-navy-900">Active</span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Create Coupon
                </button>
            </form>
        </div>
    );
}
