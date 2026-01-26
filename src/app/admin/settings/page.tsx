'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Save, Loader2, Store, Mail, CreditCard } from 'lucide-react';

interface StoreSettings {
    id: string;
    store_name: string;
    support_email: string;
    currency: string;
    tax_rate: number;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        store_name: '',
        support_email: '',
        currency: 'INR',
        tax_rate: 18
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
                tax_rate: data.tax_rate
            });
        } else if (!data) {
            // Fallback if seed didn't run, though SQL should have handled it
            // We can insert a default here potentially, but let's assume raw state
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
                <h1 className="text-2xl font-bold text-navy-900">Store Settings</h1>
                <p className="text-gray-500 text-sm">Manage your general store configuration</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Store size={20} className="text-gray-400" />
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={formData.store_name}
                                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Support Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.support_email}
                                    onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regional & Financial */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-gray-400" />
                        finance & Regional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.tax_rate}
                                onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all disabled:opacity-70"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
