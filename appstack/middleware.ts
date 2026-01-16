import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/dashboard', '/profile'];
    const authRoutes = ['/login', '/signup'];

    // Check if user is trying to access protected route without being authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect authenticated users away from auth pages
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
};
