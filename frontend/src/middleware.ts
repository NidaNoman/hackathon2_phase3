// frontend/src/middleware.ts
// T027 [P] [US2] Implement frontend route protection for authenticated routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value; // Look for token in cookies

  const protectedRoutes = ['/tasks']; // Define routes that require authentication

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') ||
                      request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup');

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If already authenticated, redirect from login/signup pages to /tasks
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/tasks';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/auth/:path*', '/login', '/signup'], // Apply middleware to these paths
};
