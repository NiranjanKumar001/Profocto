import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For database sessions, the token may be null but the session cookie exists
        // Allow access to builder pages if there's any authentication indicator
        if (req.nextUrl.pathname.startsWith('/builder')) {
          // Check for NextAuth session cookie
          const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
          return !!sessionToken || !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/builder/:path*']
};
