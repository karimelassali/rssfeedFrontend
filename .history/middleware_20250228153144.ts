import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/sign-in';

  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value || '';

  // Allow access to public paths without token
  if (isPublicPath && !token) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect all other routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/news/:path*',
    // Add other protected routes here
  ],
};