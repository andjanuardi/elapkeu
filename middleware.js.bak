// middleware.ts or middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const allow = ['/api/auth', '/login', '/_next', '/favicon.ico', '/assets'];
  const deny = ['/api', '/'];

  if (allow.some((item) => pathname.startsWith(item))) {
    return NextResponse.next();
  }

  if (deny.some((item) => !token && pathname.startsWith(item))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
