import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// User functions
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Delete user's accounts
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_user_id", (q) => q.eq("userId", args.id))
      .collect();
    
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // Delete user's sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.id))
      .collect();
    
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete user
    await ctx.db.delete(args.id);
  },
});

// Account functions
export const createAccount = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("accounts", args);
  },
});

export const getAccountByProvider = query({
  args: {
    provider: v.string(),
    providerAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_provider_and_account_id", (q) =>
        q.eq("provider", args.provider).eq("providerAccountId", args.providerAccountId)
      )
      .first();
  },
});

export const deleteAccount = mutation({
  args: {
    provider: v.string(),
    providerAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_provider_and_account_id", (q) =>
        q.eq("provider", args.provider).eq("providerAccountId", args.providerAccountId)
      )
      .first();
    
    if (account) {
      await ctx.db.delete(account._id);
    }
  },
});

// Session functions
export const createSession = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.id("users"),
    expires: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const getSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
  },
});

export const updateSession = mutation({
  args: {
    sessionToken: v.string(),
    expires: v.optional(v.number()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
    
    if (session) {
      const { sessionToken, ...updates } = args;
      await ctx.db.patch(session._id, updates);
    }
  },
});

export const deleteSession = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
      
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});