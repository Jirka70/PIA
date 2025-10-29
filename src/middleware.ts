import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

let locales = ["en", "cs"]


export async function middleware(request: NextRequest) {


  const pathname = request.nextUrl.pathname.toString();

  if (pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    /\.[\w]+$/.test(pathname)) {
      return NextResponse.next()
}

  const segments = pathname.split("/");
  console.log(segments)
  const localeSegment = segments[1]
  const restParts = segments.slice(2);

  console.log("segments", segments)
  console.log("localesegment", localeSegment)
  console.log("restparts", restParts)

  const locale = locales.includes(localeSegment)
    ? localeSegment
    : "en"

  if (locale === localeSegment) { // no change
    return NextResponse.next()
  }



  const sessionCookie = getSessionCookie(request);
  const rest = segments.join("/")
  const localeUrl = new URL(`/${locale}/${rest}`, request.url)
  console.log("localeUrl", localeUrl.href)


  if (!sessionCookie) {
    const url = new URL(`/${locale}/sign-in`, request.url)
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(localeUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)'],
}


