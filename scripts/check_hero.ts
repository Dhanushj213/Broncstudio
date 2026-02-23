
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHeroImages() {
    const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .in('section_id', ['shop_hero_images', 'personalise_hero_image']);

    if (error) {
        console.error('Error fetching hero data:', error);
        return;
    }

    data.forEach(block => {
        console.log(`--- ${block.section_id} ---`);
        console.log(JSON.stringify(block.content, null, 2));
    });
}

checkHeroImages();
