import {NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

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
