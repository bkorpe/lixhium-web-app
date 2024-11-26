import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phone, code } = await request.json();

        const response = await fetch(`https://instatistik.com/lixhium/otp.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `telno=${phone}&kod=${code}`,
        });

        if (!response.ok) {
            throw new Error('OTP verification failed');
        }

        const data = await response.text();

        if (data === "0") {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // GUID'i cookie'ye kaydet
        const headers = new Headers();
        headers.append('Set-Cookie', `guid=${data}; Path=/; HttpOnly`);

        return NextResponse.json({ success: true }, { headers });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 