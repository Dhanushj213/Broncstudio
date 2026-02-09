'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function ReturnsPage() {
    return (
        <InfoPage title="Returns & Refunds">
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
                <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-800 dark:text-red-300 text-sm font-medium mb-8">
                    <strong>Important:</strong> We have a strict No Return Policy on all products.
                </div>

                <h3 className="text-xl font-bold text-navy-900 dark:text-white">Return Policy</h3>
                <p>
                    Please note that we do not accept returns on any products, including personalized items. All sales are final. Since many of our products are made-to-order or customized, we are unable to offer returns or refunds once an order is placed.
                </p>

                <h3 className="text-xl font-bold text-navy-900 dark:text-white mt-8">Damaged or Defective Items</h3>
                <p>
                    In the unlikely event that you receive a damaged or defective product, we are happy to offer an exchange.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li>Exchange requests must be raised within <strong>3 days</strong> of the order delivery date.</li>
                    <li>Please provide clear photos or videos of the damage when contacting support.</li>
                    <li>The item must be unused and in its original packaging.</li>
                </ul>

                <h3 className="text-xl font-bold text-navy-900 dark:text-white mt-8">How to Request an Exchange</h3>
                <p>
                    To request an exchange for a damaged item, please contact our customer support team immediately through our contact page or email us directly. We will review your request and guide you through the exchange process.
                </p>
            </div>
        </InfoPage>
    );
}
