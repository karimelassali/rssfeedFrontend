import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  

  console.log('Middleware Running - Path:', request.nextUrl.pathname);
  console.log('Auth Token:', authToken);

  const protectedPaths = [
    '/',
    '/dashboard',
    '/settings',  
    '/news',
    '/publishedArticles'
  ];

  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute) {
    if (!authToken || authToken.trim() === '') {
      console.log('No valid token found, redirecting to /sign-in');
      const loginUrl = new URL('/sign-in', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }
  }

  console.log('Access granted, proceeding to requested page');
  return NextResponse.next();
}


export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/settings/:path*',
    '/news/:path*',
    '/publishedArticles/:path*'
  ]
};