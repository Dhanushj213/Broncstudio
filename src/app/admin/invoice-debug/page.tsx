
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { InvoicePDF, Order } from '@/components/Invoice/InvoicePDF';

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading PDF Viewer...</p>,
    }
);

const mockOrder: Order = {
    id: 'debug-12345678',
    created_at: new Date().toISOString(),
    total_amount: 1500,
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'cod',
    user_id: 'debug_user',
    shipping_address: {
        firstName: 'Debug',
        lastName: 'User',
        address: '123 Debug St, Tech Park',
        city: 'Bangalore',
        pincode: '560001',
        phone: '9999999999'
    },
    items: [
        {
            name: 'Debug T-Shirt Standard',
            quantity: 1,
            price: 500,
            image_url: '',
            size: 'M',
            metadata: {
                color: 'Black',
                gst_percent: 12
            }
        },
        {
            name: 'Debug Personalized Mug',
            quantity: 1,
            price: 800,
            image_url: '',
            size: 'Standard',
            metadata: {
                is_custom: true,
                base_price_unit: 600,
                customization_cost_unit: 200,
                gst_percent: 12,
                print_gst_percent: 18,
                placements: {
                    front: { print_type: { name: 'DTF' } }
                }
            }
        }
    ]
};

export default function InvoiceDebugPage() {
    return (
        <div className="h-screen w-full p-10 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-black">Invoice PDF Debug Viewer</h1>
            <div className="w-full h-[800px] border border-gray-300 shadow-lg bg-white">
                <PDFViewer width="100%" height="100%" className="w-full h-full">
                    <InvoicePDF order={mockOrder} />
                </PDFViewer>
            </div>
        </div>
    );
}
