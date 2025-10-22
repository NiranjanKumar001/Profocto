import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { convexAdapter } from '@/lib/convex-client';

// Determine whether Convex adapter should be enabled. For local development
// the user may not have set a proper Convex deploy key. We treat values that
// look like URLs as misconfigured (your `.env.local` currently has a URL there).
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexDeployKey = process.env.CONVEX_DEPLOY_KEY;
const hasConvexAdapter = Boolean(
  convexUrl && convexDeployKey && !/^https?:\/\//i.test(convexDeployKey)
);

if (!hasConvexAdapter) {
  console.warn('[auth.config] Convex adapter disabled: missing or invalid CONVEX_DEPLOY_KEY. Falling back to JWT sessions for local dev.');
}

export const authOptions: NextAuthOptions = {
  // Enable debug while troubleshooting sign-in callback failures (disable in production)
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,

  // Only attach the database adapter when Convex envs look valid. If not
  // present, fall back to JWT sessions so sign-in callbacks do not fail.
  ...(hasConvexAdapter ? { adapter: convexAdapter } : {}),

  // Configure session handling: use 'database' when adapter available, else 'jwt'
  session: hasConvexAdapter
    ? {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
      }
    : {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
      },
  
  // Configure Google authentication provider only
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  
  // Callbacks for customizing the NextAuth behavior
  callbacks: {
    async session({ session, user }) {
      // With database sessions, we get the user object instead of token
      if (session.user && user) {
        session.user.id = user.id;
        session.provider = 'google';
      }
      return session
    },
    
    async signIn({ user }) {
      return true
    },
    
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      // Default redirect to builder page after successful login
      return `${baseUrl}/builder`;
    }
  },
  
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  
  // Enhanced error handling
  events: {
    async signIn({ user }) {
      // User signed in successfully
    }
  },
  
  // Logger disabled for clean console output
}