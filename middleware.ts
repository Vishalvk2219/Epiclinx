import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from "./lib/verify-token";

const roleRoutes: Record<string, string[]> = {
  brand: ['/dashboard/brand', '/brand/post-a-job'],
  creator: ['/dashboard/creator'],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const { pathname } = req.nextUrl;


  if (!token) return NextResponse.redirect(new URL('/', req.url));

  const payload:any = await verifyToken();
  if (!payload) return NextResponse.redirect(new URL('/', req.url));

  const requiredRole = Object.entries(roleRoutes).find(([_, paths]) =>
    paths.some(path => pathname.startsWith(path))
  )?.[0];

  if (!requiredRole) return NextResponse.next();

  if (payload.role !== requiredRole) {
    if (pathname.startsWith("/dashboard")){
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/brand/:path*',
    '/dashboard/creator/:path*',
    '/brand/post-a-job'
  ],
};
