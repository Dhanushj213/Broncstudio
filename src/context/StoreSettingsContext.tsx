'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export interface StoreSettings {
    currency: string;
    tax_rate: number;
    shipping_charge: number;
    free_shipping_threshold: number;
    announcement_text?: string;
    announcement_link?: string;
    announcement_active?: boolean;
}

const defaultSettings: StoreSettings = {
    currency: 'INR',
    tax_rate: 18, // Default 18% as requested
    shipping_charge: 100, // Default charge
    free_shipping_threshold: 5000, // Default threshold
    announcement_active: false
};

interface StoreSettingsContextType {
    settings: StoreSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .single();

            if (data) {
                setSettings({
                    currency: data.currency,
                    tax_rate: data.tax_rate ?? 18,
                    shipping_charge: data.shipping_charge ?? 100,
                    free_shipping_threshold: data.free_shipping_threshold ?? 5000,
                    announcement_text: data.announcement_text,
                    announcement_link: data.announcement_link,
                    announcement_active: data.announcement_active
                });
            }
        } catch (error) {
            console.error("Failed to fetch store settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <StoreSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </StoreSettingsContext.Provider>
    );
};

export const useStoreSettings = () => {
    const context = useContext(StoreSettingsContext);
    if (context === undefined) {
        throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
    }
    return context;
};
