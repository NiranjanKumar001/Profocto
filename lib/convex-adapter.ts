import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "next-auth/adapters";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function ConvexAdapter(convex: ConvexHttpClient): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const userId = await convex.mutation(api.auth.createUser, {
        name: user.name || "",
        email: user.email!,
        image: user.image || undefined,
        emailVerified: user.emailVerified?.getTime(),
        createdAt: Date.now(),
      });
      return {
        id: userId,
        name: user.name || "",
        email: user.email!,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      };
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await convex.query(api.auth.getUser, { id: id as Id<"users"> });
      if (!user) return null;
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await convex.query(api.auth.getUserByEmail, { email });
      if (!user) return null;
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<AdapterUser | null> {
      const account = await convex.query(api.auth.getAccountByProvider, {
        provider,
        providerAccountId,
      });
      if (!account) return null;
      
      const user = await convex.query(api.auth.getUser, { id: account.userId });
      if (!user) return null;
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      await convex.mutation(api.auth.updateUser, {
        id: user.id as Id<"users">,
        name: user.name || undefined,
        email: user.email || undefined,
        image: user.image === null ? undefined : user.image,
        emailVerified: user.emailVerified?.getTime(),
      });
      return user as AdapterUser;
    },

    async deleteUser(userId: string): Promise<void> {
      await convex.mutation(api.auth.deleteUser, { id: userId as Id<"users"> });
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      await convex.mutation(api.auth.createAccount, {
        userId: account.userId as Id<"users">,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token || undefined,
        access_token: account.access_token || undefined,
        expires_at: account.expires_at || undefined,
        token_type: account.token_type || undefined,
        scope: account.scope || undefined,
        id_token: account.id_token || undefined,
        session_state: account.session_state || undefined,
      });
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<void> {
      await convex.mutation(api.auth.deleteAccount, {
        provider,
        providerAccountId,
      });
    },

    async createSession({ sessionToken, userId, expires }: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      await convex.mutation(api.auth.createSession, {
        sessionToken,
        userId: userId as Id<"users">,
        expires: expires.getTime(),
      });
      return { sessionToken, userId, expires };
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await convex.query(api.auth.getSession, { sessionToken });
      if (!session) return null;
      
      const user = await convex.query(api.auth.getUser, { id: session.userId });
      if (!user) return null;
      
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: new Date(session.expires),
        },
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image || null,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        },
      };
    },

    async updateSession({ sessionToken, expires, userId }: { sessionToken: string; expires?: Date; userId?: string }): Promise<AdapterSession | null | undefined> {
      await convex.mutation(api.auth.updateSession, {
        sessionToken,
        expires: expires?.getTime(),
        userId: userId as Id<"users"> | undefined,
      });
      return { sessionToken, expires: expires!, userId: userId! };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await convex.mutation(api.auth.deleteSession, { sessionToken });
    },
  };
}