
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspect() {
    const { data: roots } = await supabase
        .from('categories')
        .select('id, name, slug')
        .is('parent_id', null);

    console.log('--- Root Categories (No Parent) ---');
    console.table(roots);

    // Check the known parent of Men/Women
    const parentId = '73d4ef16-de88-455f-91df-2a614e5920c2';
    const { data: parent } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .eq('id', parentId);

    console.log('\n--- Parent of Men/Women ---');
    console.table(parent);
}

inspect();
