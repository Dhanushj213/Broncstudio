'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

type DateRangeType = 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'lastMonth' | 'all';

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
    label: string;
}

interface AdminDateContextType {
    rangeType: DateRangeType;
    setRangeType: (type: DateRangeType) => void;
    dateRange: DateRange;
    customRange: DateRange;
    setCustomRange: (range: DateRange) => void;
}

const AdminDateContext = createContext<AdminDateContextType | undefined>(undefined);

export function AdminDateProvider({ children }: { children: ReactNode }) {
    const [rangeType, setRangeType] = useState<DateRangeType>('today');
    const [customRange, setCustomRange] = useState<DateRange>({ from: undefined, to: undefined, label: 'Custom' });

    const getDateRange = (type: DateRangeType): DateRange => {
        const now = new Date();
        switch (type) {
            case 'today':
                return { from: startOfDay(now), to: endOfDay(now), label: 'Today' };
            case 'yesterday':
                const yest = subDays(now, 1);
                return { from: startOfDay(yest), to: endOfDay(yest), label: 'Yesterday' };
            case 'last7':
                return { from: subDays(now, 7), to: endOfDay(now), label: 'Last 7 Days' };
            case 'thisMonth':
                return { from: startOfMonth(now), to: endOfDay(now), label: 'This Month' };
            case 'lastMonth':
                const lastMonth = subMonths(now, 1);
                return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth), label: 'Last Month' };
            default:
                return { from: undefined, to: undefined, label: 'All Time' };
        }
    };

    const dateRange = rangeType === 'all' ? // 'all' is tricky, let's treat it as undefined range (fetch all)
        { from: undefined, to: undefined, label: 'All Time' }
        : getDateRange(rangeType);

    return (
        <AdminDateContext.Provider value={{ rangeType, setRangeType, dateRange, customRange, setCustomRange }}>
            {children}
        </AdminDateContext.Provider>
    );
}

export function useAdminDate() {
    const context = useContext(AdminDateContext);
    if (context === undefined) {
        throw new Error('useAdminDate must be used within an AdminDateProvider');
    }
    return context;
}
