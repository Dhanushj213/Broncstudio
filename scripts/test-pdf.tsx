
import React from 'react';
import { renderToFile } from '@react-pdf/renderer';
import { InvoicePDF, Order } from '../src/components/Invoice/InvoicePDF';
import path from 'path';

const mockOrder: Order = {
    id: '12345678-test-order',
    created_at: new Date().toISOString(),
    total_amount: 1500,
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'cod',
    user_id: 'user_123',
    shipping_address: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Bangalore',
        pincode: '560001',
        phone: '9999999999'
    },
    items: [
        {
            id: 'item1',
            name: 'Standard T-Shirt',
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
            id: 'item2',
            name: 'Custom T-Shirt',
            quantity: 1,
            price: 800,
            image_url: '',
            size: 'L',
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

async function generate() {
    try {
        const outputPath = path.join(process.cwd(), 'test-invoice.pdf');
        const logoPath = path.join(process.cwd(), 'public', 'blacklogo.png');
        console.log('Generating PDF to', outputPath);
        await renderToFile(<InvoicePDF order={mockOrder} logoPath={logoPath} />, outputPath);
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
}

generate();
