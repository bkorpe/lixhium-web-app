import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ features: [] });
    }

    try {
        const response = await fetch(
            `http://185.15.199.162:2322/api?q=${encodeURIComponent(query)}&lang=tr&limit=10`
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Location search error:', error);
        return NextResponse.json({ features: [] }, { status: 500 });
    }
} 