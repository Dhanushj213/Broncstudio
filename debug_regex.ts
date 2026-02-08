const getGoogleDriveDirectLink = (url: string): string => {
    try {
        const fileIdRegex = /\/d\/([a-zA-Z0-9_-]+)|\?id=([a-zA-Z0-9_-]+)/;
        const match = url.match(fileIdRegex);
        console.log('Match:', match);

        if (match) {
            const fileId = match[1] || match[2];
            console.log('File ID:', fileId);
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
        return url;
    } catch (e) {
        return url;
    }
};

const url = "https://drive.google.com/file/d/1FCe2JjUYedJ2aKrZx2yLab3KF24Bd8pd/view?usp=drive_link";
console.log('Result:', getGoogleDriveDirectLink(url));

const mangled = "https://drive.google.com/uc?export=view&id=1FCe2JjUYedJ2aKrZx2yLhttps";
console.log('Target mangled:', mangled);
