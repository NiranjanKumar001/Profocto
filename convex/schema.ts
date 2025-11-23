import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  }).index("by_email", ["email"]),

  accounts: defineTable({
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
  })
    .index("by_provider_and_account_id", ["provider", "providerAccountId"])
    .index("by_user_id", ["userId"]),

  sessions: defineTable({
    sessionToken: v.string(),
    userId: v.id("users"),
    expires: v.number(),
  })
    .index("by_session_token", ["sessionToken"])
    .index("by_user_id", ["userId"]),

  // NOTE: Only "resume" (singular) table is used in the application
  // Any "resumes" table should be deleted from the dashboard
  resume: defineTable({
    resume_data: v.string(),
    owner:  v.id("users"),
    lastSignificantSave: v.optional(v.number()), // Timestamp of last manual/close save
    isAutoSaveOnly: v.optional(v.boolean()), // True if only auto-saved, never manually saved
    // _id and _creationtime added automatically
  }).index('by_owner_id',["owner"])
});