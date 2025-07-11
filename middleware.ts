import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/reset-password',
  '/reset-password/success',
  '/favicon.ico',
  '/_next',
  '/images',
  '/fonts',
  '/api',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));

  // Example: check for a cookie named 'auth' (replace with real logic)
  const isLoggedIn = Boolean(request.cookies.get('auth'));

  if (!isPublic && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 