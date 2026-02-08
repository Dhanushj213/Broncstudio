'use client';

import React, { useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Search } from 'lucide-react';

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState('');

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Tracking functionality for Order #${orderId} coming soon!`);
    };

    return (
        <InfoPage title="Track Your Order">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Enter your Order ID (found in your confirmation email) to see the current status of your shipment.
            </p>

            <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/10 max-w-lg">
                <form onSubmit={handleTrack} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Order ID</label>
                        <input
                            type="text"
                            placeholder="e.g. BRONC-12345"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-navy-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-navy-900 dark:focus:border-white focus:ring-1 focus:ring-navy-900 dark:focus:ring-white transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Email or Phone</label>
                        <input
                            type="text"
                            placeholder="Enter the email/phone used for checkout"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-navy-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-navy-900 dark:focus:border-white focus:ring-1 focus:ring-navy-900 dark:focus:ring-white transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:bg-coral-500 dark:hover:bg-coral-400 transition-colors flex items-center justify-center gap-2">
                        <Search size={18} /> Track Order
                    </button>
                </form>
            </div>
        </InfoPage>
    );
}
