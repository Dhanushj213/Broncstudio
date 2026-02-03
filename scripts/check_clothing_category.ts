
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategory() {
    console.log('Checking for Categories...');

    // 1. Check for 'clothing'
    const { data: c1, error: e1 } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'clothing');

    console.log("Slug 'clothing':", c1, e1);

    // 2. Check for 'everyday-icons'
    const { data: c2, error: e2 } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'everyday-icons');

    console.log("Slug 'everyday-icons':", c2, e2);
}

checkCategory();
