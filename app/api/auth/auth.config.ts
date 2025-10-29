import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { convexAdapter } from '@/lib/convex-client';

export const authOptions: NextAuthOptions = {
  debug: false, // Disabled for clean console output
  secret: process.env.NEXTAUTH_SECRET,
  
  // Use Convex database adapter
  adapter: convexAdapter,
  
  // Configure session handling with database
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Configure Google authentication provider only
  providers: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
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
  ] : [],
  
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