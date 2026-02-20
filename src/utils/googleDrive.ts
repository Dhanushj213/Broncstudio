export const getGoogleDriveDirectLink = (url: string | undefined): string => {
    if (!url) return '';
    try {
        // Only process if it's a Google Drive URL
        if (!url.includes('drive.google.com')) return url;

        // More robust regex to extract file ID from various Google Drive URL formats
        const fileIdRegex = /[-\w]{25,}/;
        const match = url.match(fileIdRegex);

        if (match) {
            const fileId = match[0];
            const directDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            // Use an external image proxy (wsrv.nl) to bypass Google Drive's strict hotlinking/CORS policies
            return `https://wsrv.nl/?url=${encodeURIComponent(directDriveUrl)}`;
        }

        // Return original URL if it doesn't match Google Drive ID pattern
        return url;
    } catch (e) {
        console.error('Error parsing Google Drive link:', e);
        return url;
    }
};

