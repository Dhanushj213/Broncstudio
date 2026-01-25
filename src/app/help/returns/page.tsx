'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function ReturnsPage() {
    return (
        <InfoPage title="Returns & Refunds">
            <div className="space-y-8 text-gray-700">
                <div className="p-6 bg-coral-50 border border-coral-100 rounded-xl text-coral-800 text-sm font-medium mb-8">
                    <strong>Note:</strong> We have a 7-day hassle-free return policy for most items.
                </div>

                <h3 className="text-xl font-bold text-navy-900">How do I return an item?</h3>
                <ol className="list-decimal pl-5 space-y-3">
                    <li>Visit the <strong>Order History</strong> section in your profile.</li>
                    <li>Select the order and item you wish to return.</li>
                    <li>Choose a reason for return and submit the request.</li>
                    <li>Our courier partner will pick up the item within 2–3 business days.</li>
                </ol>

                <h3 className="text-xl font-bold text-navy-900 mt-8">Refund Process</h3>
                <p>
                    Once the item is picked up and verified at our warehouse, the refund will be initiated.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Prepaid Orders:</strong> Refunded to original source (5–7 business days).</li>
                    <li><strong>COD Orders:</strong> Refunded to your bank account via link/UPI or Store Credit (instant).</li>
                </ul>

                <h3 className="text-xl font-bold text-navy-900 mt-8">Non-Returnable Items</h3>
                <p>
                    For hygiene reasons, innerwear, socks, and personalized items are not eligible for return unless defective.
                </p>
            </div>
        </InfoPage>
    );
}
