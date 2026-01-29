
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding gift data...');

    // 1. Get some products to be "Birthday Gifts for Him"
    const { data: menProducts } = await supabase.from('products').select('id').limit(5);

    if (menProducts && menProducts.length > 0) {
        const ids = menProducts.map(p => p.id);
        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    is_giftable: true,
                    audience: ['men', 'unisex'],
                    gift_moments: ['forgot_birthday'],
                    gift_types: ['quick', 'safe'],
                    why_gift: 'Perfect last-minute save!'
                }
            })
            .in('id', ids);

        if (error) console.error('Error seeding men gifts:', error);
        else console.log('Seeded 5 Birthday Gifts for Him.');
    }

    // 2. Get some products for "New Home"
    // Offset to get different ones
    const { data: homeProducts } = await supabase.from('products').select('id').range(5, 9);

    if (homeProducts && homeProducts.length > 0) {
        const ids = homeProducts.map(p => p.id);
        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    is_giftable: true,
                    audience: ['women', 'unisex'],
                    gift_moments: ['new_home'],
                    gift_types: ['safe', 'premium'],
                    why_gift: 'Adds warmth to any room.'
                }
            })
            .in('id', ids);

        if (error) console.error('Error seeding home gifts:', error);
        else console.log('Seeded 5 New Home Gifts.');
    }
}

seed();
