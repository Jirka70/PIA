import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { locales } from "@/internationalization/i18n";

function getPrefferedLocale() {
    return "en"
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    /*if (!pathnameHasLocale) {
        const locale = getPrefferedLocale()
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}${pathname}`
        return NextResponse.redirect(url)
    }*/

    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

	return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};