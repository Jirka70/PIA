import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {getSessionCookie} from 'better-auth/cookies';

const intlMiddleware = createMiddleware(routing);

const AUTH_SLUGS = new Set(['sign-in','sign-up']);
const PUBLIC_PATHS = ['/languages', '/services', "/", "/pricing", "/contact"];

const LOCALE_RE = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);


function stripLocale(path: string) {
  const noLocale = path.replace(LOCALE_RE, '') || '/';
  return noLocale.startsWith('/') ? noLocale : `/${noLocale}`;
}

function isAuthRoute(path: string) {
  const noLocale = path.replace(LOCALE_RE, "") || "/"
  const firstSegment = noLocale.split("/").filter(Boolean)[0] // getting truthy vals

  return AUTH_SLUGS.has(firstSegment)
}

function isPublicRoute(path: string) {
  const noLocale = stripLocale(path);

  // povolíme /, přesný match segmentu, i prefix (pro podstránky)
  return PUBLIC_PATHS.includes(noLocale);
}

export default async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const intlResponse = intlMiddleware(request);


  // Pokud už došlo k redirectu/rewritu, vrať to rovnou
  // (Next používá X-headers k signalizaci – tohle je spolehlivý early-return)
  if (intlResponse.redirected || intlResponse.headers.get('x-middleware-rewrite')) {
    return intlResponse;
  }

  // 2) Tvoje auth logika
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie && isPublicRoute(pathname)) {
    return intlResponse
  }


  if (sessionCookie) {
    if (isAuthRoute(pathname)) {
      const homeUrl = new URL("/", request.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  if (!sessionCookie) {
    const loginUrl = new URL(`/${routing.defaultLocale}/sign-in`, request.url);
  
    if (pathname !== loginUrl.pathname) {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next()
    
  }

  return intlResponse;
}

// Pozor na matcher – nepouštěj middleware na assety
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)']
};
