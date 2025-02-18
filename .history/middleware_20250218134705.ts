import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/auth(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/public(.*)',
  '/api/test(.*)',
  '/api/cron(.*)'
])

const isBrowser = (userAgent: string): boolean => {
  const botPatterns = [
    'bot',
    'spider',
    'crawler',
    'lighthouse',
    'pagespeed',
    'googlebot',
    'chrome-lighthouse',
    'pingdom',
    'gtmetrix'
  ]
  const lowerUA = userAgent.toLowerCase()
  return !botPatterns.some(pattern => lowerUA.includes(pattern))
}

export default clerkMiddleware(async (auth, request) => {
  const userAgent = request.headers.get('user-agent') || ''
  
  if (!isPublicRoute(request) && isBrowser(userAgent)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
