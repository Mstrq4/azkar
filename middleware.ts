import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar', 'bn', 'cn', 'de', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja', 'no', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sv', 'tr', 'ur', 'vl', 'zh'];
const defaultLocale = 'ar';

// قائمة بمسارات لوحة التحكم التي نريد استثناءها
const dashboardPaths = ['/dashbord', '/dashbord/categories', '/dashbord/Faile', '/login', '/dashbord/morning'];

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }
  return defaultLocale;
}

function isDashboardPath(pathname: string) {
  return dashboardPaths.some(path => pathname.startsWith(path));
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false, // بناءً على احتياجاتك، يمكن تغيير هذه القيمة إلى true إذا كنت تريد الكشف التلقائي عن اللغة.
});

export default function middleware(request: NextRequest) {
  console.log('Middleware called:', request.nextUrl.pathname);
  const pathname = request.nextUrl.pathname;

  if (isDashboardPath(pathname)) {
    console.log('Dashboard path detected, skipping middleware');
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    console.log(`No locale detected, redirecting to /${locale}${pathname}`);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  console.log('Applying intl middleware');
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/']
};
