import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://broncstudio.com'; // Replace with actual domain

    // Static Routes
    const routes = [
        '',
        '/shop',
        '/curated',
        '/personalise',
        '/help/contact',
        '/help/faq',
        '/help/size-guide',
        '/policies/privacy',
        '/policies/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
