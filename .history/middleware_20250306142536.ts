import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the user cookie
  const userCookie = request.cookies.get('user');

  // Define paths that should be protected
  const protectedPaths = [
    '/dashboard',
    '/settings',
    '/news',
    '/publishedArticles'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a protected route and there's no user cookie, redirect to login
  if (isProtectedRoute && !userCookie) {
    const loginUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/news/:path*',
    '/publishedArticles/:path*'
  ]
};