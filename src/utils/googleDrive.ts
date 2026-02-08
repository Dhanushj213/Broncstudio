export const getGoogleDriveDirectLink = (url: string): string => {
    try {
        // Regex to extract file ID from common Google Drive URL formats
        // Matches:
        // /file/d/FILE_ID/view
        // /open?id=FILE_ID
        // /uc?id=FILE_ID
        const fileIdRegex = /\/d\/([a-zA-Z0-9_-]+)|\?id=([a-zA-Z0-9_-]+)/;
        const match = url.match(fileIdRegex);

        if (match) {
            const fileId = match[1] || match[2];
            // Use 'uc' (User Content) export=view/download for direct access
            // export=view is often better for video streaming in browser
            // export=download forces download but sometimes works for img src
            // Let's try export=view first as it's more standard for inline display
            const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
            // Use our server-side proxy to bypass 403 Forbidden errors
            return `/api/proxy-image?url=${encodeURIComponent(directLink)}`;
        }
        return url;
    } catch (e) {
        return url;
    }
};
