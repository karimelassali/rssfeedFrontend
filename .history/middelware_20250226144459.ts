import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/sign-in'

  // Get the token from cookies
  const token = request.localStorage.get('auth')?.value || ''

  // Redirect to sign-in if accessing protected route without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Redirect to home if accessing sign-in with valid token
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
 
// Configure the paths that middleware should run on
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
