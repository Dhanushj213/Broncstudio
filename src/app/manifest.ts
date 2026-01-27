import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BroncStudio',
        short_name: 'BroncStudio',
        description: 'Stories, Style & Smiles — All in One Place',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/BroncStudio (2).png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
