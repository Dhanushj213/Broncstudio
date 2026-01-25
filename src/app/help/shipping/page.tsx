'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function ShippingPage() {
    return (
        <InfoPage title="Shipping Information">
            <div className="space-y-8 text-gray-700">
                <p>
                    At Broncstudio, we strive to deliver your little treasures as quickly and safely as possible.
                    We partner with reputable courier services to ensure timely delivery across India.
                </p>

                <h3 className="text-xl font-bold text-navy-900 mt-8">Delivery Timelines</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Metros:</strong> 2–4 business days</li>
                    <li><strong>Rest of India:</strong> 5–7 business days</li>
                    <li><strong>Remote Areas:</strong> 7–10 business days</li>
                </ul>

                <h3 className="text-xl font-bold text-navy-900 mt-8">Shipping Charges</h3>
                <p>
                    We offer <strong>Free Shipping</strong> on all orders above ₹999.
                    For orders below ₹999, a flat shipping fee of ₹99 applies.
                </p>

                <h3 className="text-xl font-bold text-navy-900 mt-8">Order Processing</h3>
                <p>
                    Orders are processed within 24 hours of placement (excluding Sundays and Public Holidays).
                    You will receive a confirmation email and WhatsApp notification with tracking details once your order is dispatched.
                </p>
            </div>
        </InfoPage>
    );
}
