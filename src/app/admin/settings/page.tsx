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

interface SiteSettings {
    id: string;
    maintenance_mode: boolean;
    maintenance_message: string;
    launch_mode: boolean;
    launch_datetime: string;
    auto_disable_launch: boolean;
    launch_message: string;
    launch_hero_video?: string;
    background_image?: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
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
    const [siteFormData, setSiteFormData] = useState({
        maintenance_mode: false,
        maintenance_message: 'Our platform is currently under maintenance. We\'ll be back soon.',
        launch_mode: false,
        launch_datetime: '',
        auto_disable_launch: true,
        launch_message: 'Something Powerful Is Launching.',
        launch_hero_video: '',
        background_image: ''
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

        try {
            // Fetch Store Settings
            const { data: storeData, error: storeError } = await supabase
                .from('store_settings')
                .select('*')
                .single();

            if (storeError) {
                console.warn('Store settings not found or error:', storeError.message);
            } else if (storeData) {
                setSettings(storeData);
                setFormData({
                    store_name: storeData.store_name,
                    support_email: storeData.support_email,
                    currency: storeData.currency,
                    tax_rate: storeData.tax_rate,
                    shipping_charge: storeData.shipping_charge ?? 0,
                    free_shipping_threshold: storeData.free_shipping_threshold ?? 0,
                    announcement_text: storeData.announcement_text || '',
                    announcement_link: storeData.announcement_link || '',
                    announcement_active: storeData.announcement_active ?? true
                });
            }

            // Fetch Site Settings
            const { data: siteData, error: siteError } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (siteError) {
                console.warn('Site settings not found or error:', siteError.message);
                if (siteError.code === 'PGRST116') {
                    console.log('Site settings table may be empty or missing.');
                }
            }
            if (siteData) {
                setSiteSettings(siteData);
                setSiteFormData({
                    maintenance_mode: siteData.maintenance_mode ?? false,
                    maintenance_message: siteData.maintenance_message || '',
                    launch_mode: siteData.launch_mode ?? false,
                    launch_datetime: siteData.launch_datetime ? new Date(siteData.launch_datetime).toISOString().slice(0, 16) : '',
                    auto_disable_launch: siteData.auto_disable_launch ?? true,
                    launch_message: siteData.launch_message || '',
                    launch_hero_video: siteData.launch_hero_video || '',
                    background_image: siteData.background_image || ''
                });
            }
        } catch (err) {
            console.error('Unexpected error fetching settings:', err);
        }

        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const storeUpdates = {
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

        const siteUpdates = {
            maintenance_mode: siteFormData.maintenance_mode,
            maintenance_message: siteFormData.maintenance_message,
            launch_mode: siteFormData.launch_mode,
            launch_datetime: siteFormData.launch_datetime ? new Date(siteFormData.launch_datetime).toISOString() : null,
            auto_disable_launch: siteFormData.auto_disable_launch,
            launch_message: siteFormData.launch_message,
            launch_hero_video: siteFormData.launch_hero_video,
            background_image: siteFormData.background_image,
            updated_at: new Date().toISOString()
        };

        // Save Store Settings
        let storeResult;
        if (settings?.id) {
            storeResult = await supabase
                .from('store_settings')
                .update(storeUpdates)
                .eq('id', settings.id);
        } else {
            storeResult = await supabase
                .from('store_settings')
                .insert([storeUpdates]);
        }

        if (storeResult.error) {
            alert('Failed to save store settings');
            console.error('Store Settings Error:', JSON.stringify(storeResult.error, null, 2));
            console.log('Error Object:', storeResult.error);
            setSaving(false);
            return;
        }

        // Save Site Settings
        let siteResult;
        if (siteSettings?.id) {
            siteResult = await supabase
                .from('site_settings')
                .update(siteUpdates)
                .eq('id', siteSettings.id);
        } else {
            siteResult = await supabase
                .from('site_settings')
                .insert([siteUpdates]);
        }

        if (siteResult.error) {
            // Provide more helpful message if table doesn't exist
            if (siteResult.error.message.includes('relation "site_settings" does not exist')) {
                alert('Database Error: The "site_settings" table is missing. Please run the SQL migration provided.');
            } else {
                alert('Failed to save site settings');
            }
            console.error('Site Settings Error:', JSON.stringify(siteResult.error, null, 2));
        } else {
            alert('All settings saved successfully');
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

                {/* Launch Mode Settings */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-xl">🚀</span>
                            Launch Mode
                        </h2>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={siteFormData.launch_mode}
                                onChange={(e) => setSiteFormData({ ...siteFormData, launch_mode: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500 dark:peer-checked:bg-coral-500"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Launch Headline</label>
                            <input
                                type="text"
                                value={siteFormData.launch_message}
                                onChange={(e) => setSiteFormData({ ...siteFormData, launch_message: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                                placeholder="e.g. Something Powerful Is Launching."
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Launch Hero Video URL</label>
                            <input
                                type="text"
                                value={siteFormData.launch_hero_video}
                                onChange={(e) => setSiteFormData({ ...siteFormData, launch_hero_video: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors font-mono text-sm"
                                placeholder="Paste direct video URL or YouTube embed URL for the launch hero slider"
                            />
                            {siteFormData.launch_hero_video && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">Video URL provided. Ensure it is publicly accessible.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Launch Date & Time</label>
                            <input
                                type="datetime-local"
                                value={siteFormData.launch_datetime}
                                onChange={(e) => setSiteFormData({ ...siteFormData, launch_datetime: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors"
                            />
                            <p className="text-xs text-gray-400 mt-1">Website will automatically open at this time.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl h-fit self-end">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={siteFormData.auto_disable_launch}
                                    onChange={(e) => setSiteFormData({ ...siteFormData, auto_disable_launch: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                            <div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Scheduled Auto Open</span>
                                <p className="text-xs text-gray-400">Disable launch mode automatically at zero.</p>
                            </div>
                        </div>
                        {siteFormData.launch_mode && (
                            <div className="col-span-full p-4 bg-navy-50 dark:bg-navy-900/10 border border-navy-100 dark:border-navy-900/20 rounded-xl">
                                <p className="text-sm text-navy-600 dark:text-navy-400 font-medium">
                                    <strong>LAUNCH ACTIVE:</strong> Public users will see the countdown page. Admins can still access the site.
                                    {siteFormData.launch_datetime && ` Countdown set for ${new Date(siteFormData.launch_datetime).toLocaleString()}.`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Maintenance Mode Settings */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-xl">🚧</span>
                            Maintenance Mode
                        </h2>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={siteFormData.maintenance_mode}
                                onChange={(e) => setSiteFormData({ ...siteFormData, maintenance_mode: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Maintenance Message</label>
                            <textarea
                                value={siteFormData.maintenance_message}
                                onChange={(e) => setSiteFormData({ ...siteFormData, maintenance_message: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-navy-900 dark:focus:border-white/30 transition-colors resize-none"
                                placeholder="e.g. Our platform is currently under maintenance. We'll be back soon!"
                            />
                        </div>
                        {siteFormData.maintenance_mode && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    <strong>WARNING:</strong> Maintenance mode blocks all public users. It takes priority over Launch Mode.
                                </p>
                            </div>
                        )}
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
