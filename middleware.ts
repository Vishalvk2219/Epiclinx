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

  // Redirect unauthenticated users
  if (!token) return NextResponse.redirect(new URL('/', req.url));

  // Verify JWT token (pass token to verifier)
  const payload = await verifyToken();
  if (!payload) return NextResponse.redirect(new URL('/', req.url));

  // Check which role is required for the path
  const requiredRole = Object.entries(roleRoutes).find(([_, paths]) =>
    paths.some(path => pathname.startsWith(path))
  )?.[0];

  // Allow if no specific role restriction
  if (!requiredRole) return NextResponse.next();

  if (payload.role !== requiredRole) {
    if (pathname.startsWith("/dashboard")){
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, req.url));
    }
    return NextResponse.redirect(new URL('', req.url));
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
