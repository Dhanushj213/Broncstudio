
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Manually load .env.local because standard dotenv might miss it depending on CWD
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.warn("Warning: .env.local not found at", envPath);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // The image URL that currently exists but should be deleted
    // Sourced from previous subagent finding
    const IMAGE_URL = 'https://qukemngpeudzetkmoutn.supabase.co/storage/v1/object/public/personalization-uploads/570cphs18kv-1769636786750.png';

    console.log("Seeding test order for image:", IMAGE_URL);

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            total_amount: 1.00,
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'Manual Test',
            shipping_address: {
                firstName: 'Test',
                lastName: 'Deletion',
                address: '123 Cloud St',
                city: 'Sky City',
                pincode: '000000',
                phone: '9999999999'
            }
        })
        .select()
        .single();

    if (orderError) {
        console.error("Order Insert Error:", orderError);
        return;
    }

    console.log("Created Order:", order.id);

    // 2. Create Order Item link to image
    const { error: itemError } = await supabase
        .from('order_items')
        .insert({
            order_id: order.id,
            name: 'Test Deletion Item',
            quantity: 1,
            price: 1.00,
            image_url: IMAGE_URL, // Main image
            metadata: {
                is_custom: true,
                image_url: IMAGE_URL, // Custom image to delete
                print_type: 'Test',
                placement: 'Front'
            }
        });

    if (itemError) {
        console.error("Item Insert Error:", itemError);
        return;
    }

    console.log("Created Order Item with Image Metadata.");
    console.log("READY_TO_TEST");
}

main();
