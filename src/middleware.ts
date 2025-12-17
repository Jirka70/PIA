import {NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

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
  const intlResponse = intlMiddleware(request);


  if (intlResponse.redirected || intlResponse.headers.get('x-middleware-rewrite')) {
    return intlResponse;
  }


  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)']
};
