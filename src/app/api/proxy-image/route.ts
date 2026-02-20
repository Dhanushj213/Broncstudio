import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Mimic a standard browser request to bypass hotlinking protection
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            // Follow redirects since Google Drive heavily redirects
            redirect: 'follow',
        });

        if (!response.ok) {
            console.error(`Proxy could not fetch image. Status: ${response.status}`);
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const buffer = await response.arrayBuffer();

        // Forward content-type, or fallback to generic image
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        // Heavily cache proxied images to save bandwidth
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Proxy Image Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
