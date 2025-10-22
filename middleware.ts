import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/profile"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected) {
    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
    // const verifyUrl = new URL("/api/verify-token", req.url);
    // verifyUrl.searchParams.set("redirectTo", pathname);
    // return NextResponse.redirect(verifyUrl);
    return NextResponse.next()
  }
  return NextResponse.next()
}
