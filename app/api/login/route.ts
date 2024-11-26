import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();

        const response = await fetch(`https://instatistik.com/lixhium/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `telno=${phone}`,
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.text();

        if (data === "0") {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 