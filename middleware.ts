import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const guid = request.cookies.get('guid')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // Eğer guid yoksa ve login sayfasında değilse, login'e yönlendir
    if (!guid && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Eğer guid varsa ve login sayfasındaysa, haritaya yönlendir
    if (guid && isLoginPage) {
        return NextResponse.redirect(new URL('/map', request.url))
    }

    return NextResponse.next()
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
    matcher: ['/map', '/tarifeler', '/yol-planlama', '/login']
} 