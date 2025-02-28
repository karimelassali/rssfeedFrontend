import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // احصل على المسار المطلوب
  const path = request.nextUrl.pathname;

  // تحديد المسارات العامة (التي لا تحتاج إلى توثيق)
  const isPublicPath = path === '/sign-in';

  // جلب `authToken` من الكوكيز
  const token = request.cookies.get('authToken')?.value || '';

  // إذا كان المستخدم في صفحة تسجيل الدخول وليس لديه توكن، السماح له بالدخول
  if (isPublicPath && !token) {
    return NextResponse.next();
  }

  // إذا كان المستخدم في صفحة تسجيل الدخول ولكنه مصدّق عليه، إعادة توجيهه للصفحة الرئيسية
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // إذا كان المستخدم يحاول الوصول إلى صفحات محمية بدون توكن، إعادة توجيهه لتسجيل الدخول
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // السماح للطلب بالمتابعة
  return NextResponse.next();
}

// تحديد المسارات التي يعمل عليها Middleware
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/news/:path*',
    // أضف أي مسارات محمية هنا
  ],
};
