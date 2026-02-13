export const getGoogleDriveDirectLink = (url: string): string => {
    if (!url) return '';
    try {
        // More robust regex to extract file ID from various Google Drive URL formats
        const fileIdRegex = /[-\w]{25,}/;
        const match = url.match(fileIdRegex);

        if (match) {
            const fileId = match[0];
            // Thumbnail endpoint is often more reliable for direct image display
            // sz=w1280 provides a high-quality preview
            const directLink = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;

            // Still use the proxy to bypass potential 403s/CORs issues
            return `/api/proxy-image?url=${encodeURIComponent(directLink)}`;
        }

        // Return original URL if it's already a direct link or doesn't match Google Drive
        return url;
    } catch (e) {
        console.error('Error parsing Google Drive link:', e);
        return url;
    }
};
