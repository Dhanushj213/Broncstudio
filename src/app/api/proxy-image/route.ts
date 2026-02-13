import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Mimic a modern browser to reduce 403s
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            // Follow redirects
            redirect: 'follow',
        });

        if (!response.ok) {
            console.error(`Proxy Fetch Error: ${response.status} ${response.statusText} for URL: ${url}`);
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // If we get HTML back, it's likely a redirect to a sign-in page
        if (contentType.includes('text/html')) {
            console.error('Proxy Error: Received HTML instead of an image. The file might not be public.');
            return new NextResponse('Source returned HTML (likely a login page) instead of an image. Ensure the file is shared as "Anyone with the link can view".', { status: 403 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*', // Enable CORs for the proxy
            },
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
