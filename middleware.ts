import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET ?? process.env.myJWTsecret;

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret });

  if (req.nextUrl.pathname.startsWith('/write')) {
    if (!session) {
      const signInUrl = new URL('/api/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/write/:path*', '/write2/:path*', '/edit/:path*'],
};
