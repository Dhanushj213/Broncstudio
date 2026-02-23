export interface ImageOptions {
    width?: number;
    height?: number;
    quality?: number;
    blur?: number;
}

const TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const getGoogleDriveDirectLink = (url: string | undefined, options: ImageOptions = {}): string => {
    if (!url) return TRANSPARENT_PIXEL;
    try {
        // Only process if it's a Google Drive URL and NOT already proxied
        if (!url.includes('drive.google.com') || url.includes('wsrv.nl')) return url;

        // More robust regex to extract file ID from various Google Drive URL formats
        const fileIdRegex = /[-\w]{25,}/;
        const match = url.match(fileIdRegex);

        if (match) {
            const fileId = match[0];
            const directDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

            // Build wsrv.nl parameters
            const params = new URLSearchParams();
            params.append('url', directDriveUrl);

            if (options.width) params.append('w', options.width.toString());
            if (options.height) params.append('h', options.height.toString());
            if (options.quality) params.append('q', options.quality.toString());
            if (options.blur) params.append('blur', options.blur.toString());

            // Default better fitting for E-commerce
            params.append('fit', 'cover');
            params.append('a', 'top'); // Align top for apparel usually better

            return `https://wsrv.nl/?${params.toString()}`;
        }

        // Return original URL if it doesn't match Google Drive ID pattern
        return url;
    } catch (e) {
        console.error('Error parsing Google Drive link:', e);
        return url;
    }
};

