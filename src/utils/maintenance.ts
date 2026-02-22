import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface SiteSettings {
    maintenance_mode: boolean;
    maintenance_message: string;
    launch_mode: boolean;
    launch_datetime: string | null;
    auto_disable_launch: boolean;
    launch_message: string;
    background_image?: string | null;
}

export async function getMaintenanceSettings(): Promise<SiteSettings | null> {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const { data, error } = await supabase
        .from('site_settings')
        .select('maintenance_mode, maintenance_message, launch_mode, launch_datetime, auto_disable_launch, launch_message, background_image')
        .single();

    if (error) {
        // If table doesn't exist yet or other error, return default settings
        console.error('Error fetching site settings:', error.message);
        return {
            maintenance_mode: false,
            maintenance_message: 'Our platform is currently under maintenance. We\'ll be back soon.',
            launch_mode: false,
            launch_datetime: null,
            auto_disable_launch: true,
            launch_message: 'Something Powerful Is Launching.',
            background_image: null
        };
    }

    return data;
}
