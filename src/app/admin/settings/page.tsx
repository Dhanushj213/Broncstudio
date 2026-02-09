'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Save, Loader2, Store, Mail, CreditCard, Truck } from 'lucide-react';

interface StoreSettings {
    id: string;
    store_name: string;
    support_email: string;
    currency: string;
    tax_rate: number;
    shipping_charge: number;
    free_shipping_threshold: number;
    announcement_text?: string;
    announcement_link?: string;
    announcement_active?: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        store_name: '',
        support_email: '',
        currency: 'INR',
        tax_rate: 18,
        shipping_charge: 0,
        free_shipping_threshold: 0,
        announcement_text: '',
        announcement_link: '',
        announcement_active: true
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        if (data) {
            setSettings(data);
            setFormData({
                store_name: data.store_name,
                support_email: data.support_email,
                currency: data.currency,
                tax_rate: data.tax_rate,
                shipping_charge: data.shipping_charge ?? 0,
                free_shipping_threshold: data.free_shipping_threshold ?? 0,
                announcement_text: data.announcement_text || '',
                announcement_link: data.announcement_link || '',
                announcement_active: data.announcement_active ?? true
            });
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const updates = {
            store_name: formData.store_name,
            support_email: formData.support_email,
            currency: formData.currency,
            tax_rate: formData.tax_rate,
            shipping_charge: formData.shipping_charge,
            free_shipping_threshold: formData.free_shipping_threshold,
            announcement_text: formData.announcement_text,
            announcement_link: formData.announcement_link,
            announcement_active: formData.announcement_active,
            updated_at: new Date().toISOString()
        };

        let result;
        if (settings?.id) {
            result = await supabase
                .from('store_settings')
                .update(updates)
                .eq('id', settings.id);
        } else {
            result = await supabase
                .from('store_settings')
                .insert([updates]);
        }

        if (result.error) {
            alert('Failed to save settings');
            console.error(result.error);
        } else {
            alert('Settings saved successfully');
            fetchSettings(); // Refresh
        }
        setSaving(false);
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your general store configuration</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Store size={20} className="text-gray-400" />
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={formData.store_name}
                                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.support_email}
                                    onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement Bar Settings */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-xl">📢</span>
                            Announcement Bar
                        </h2>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.announcement_active}
                                onChange={(e) => setFormData({ ...formData, announcement_active: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900 dark:peer-checked:bg-coral-500"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Announcement Text</label>
                            <input
                                type="text"
                                value={formData.announcement_text}
                                onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                placeholder="e.g. Free Shipping on all orders above ₹999 • New Collection Dropped"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Link URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.announcement_link}
                                onChange={(e) => setFormData({ ...formData, announcement_link: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                placeholder="e.g. /shop/new-arrivals"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping Configuration */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Truck size={20} className="text-gray-400" />
                        Shipping & Fulfillment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Standard Shipping Charge</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={formData.shipping_charge}
                                    onChange={(e) => setFormData({ ...formData, shipping_charge: parseFloat(e.target.value) })}
                                    className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Charged if cart value is below threshold.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Free Shipping Threshold</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={formData.free_shipping_threshold}
                                    onChange={(e) => setFormData({ ...formData, free_shipping_threshold: parseFloat(e.target.value) })}
                                    className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Cart total required for free shipping.</p>
                        </div>
                    </div>
                </div>

                {/* Regional & Financial */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-gray-400" />
                        Financial & Regional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.tax_rate}
                                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-navy-900 dark:bg-coral-500 text-white hover:bg-navy-800 dark:hover:bg-coral-600 font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 dark:shadow-coral-500/20 transition-all disabled:opacity-70"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
