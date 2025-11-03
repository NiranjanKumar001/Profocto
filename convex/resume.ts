import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Constants
const FREE_RESUME_LIMIT = 2;

// Error Messages
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  RESUME_NOT_FOUND: "Resume not found",
  RESUME_LIMIT_REACHED: `Free plan allows only ${FREE_RESUME_LIMIT} resumes. Upgrade to Premium for unlimited resumes.`,
  PREMIUM_EXPIRED: "Your premium subscription has expired. Please renew to create more resumes.",
} as const;

/**
 * Helper function to check if user has active premium subscription
 * @param ctx - Convex context
 * @param userId - User ID to check
 * @returns Object with isPremium status and user data
 */
async function checkPremiumStatus(ctx: any, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isPremium = user.isPremium || false;
  const isExpired = user.premiumExpiresAt && user.premiumExpiresAt < Date.now();

  // Auto-downgrade expired premium users
  if (isPremium && isExpired) {
    await ctx.db.patch(userId, { isPremium: false });
    return { isPremium: false, user, wasExpired: true };
  }

  return { isPremium, user, wasExpired: false };
}

/**
 * Helper function to validate resume creation limits
 * @param ctx - Convex context
 * @param userId - User ID creating the resume
 * @throws Error if user has reached their resume limit
 */
async function validateResumeLimit(ctx: any, userId: Id<"users">) {
  const existingResumes = await ctx.db
    .query("resume")
    .filter((q: any) => q.eq(q.field("owner"), userId))
    .collect();

  const { isPremium, wasExpired } = await checkPremiumStatus(ctx, userId);

  // Premium users have unlimited resumes
  if (isPremium) {
    return;
  }

  // Check free tier limit
  if (existingResumes.length >= FREE_RESUME_LIMIT) {
    const errorMessage = wasExpired 
      ? ERROR_MESSAGES.PREMIUM_EXPIRED 
      : ERROR_MESSAGES.RESUME_LIMIT_REACHED;
    throw new Error(errorMessage);
  }
}

/**
 * Query to get all resumes for a specific user
 */
export const getResumes = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.id) {
      return [];
    }

    return await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("owner"), args.id))
      .collect();
  },
});

/**
 * Query to get a single resume by ID
 */
export const getResume = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});

/**
 * Mutation to create a new resume
 * Enforces free tier limit of 2 resumes for non-premium users
 */
export const createResume = mutation({
  args: {
    resume_data: v.string(),
    owner: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Validate resume creation limit
    await validateResumeLimit(ctx, args.owner);
    
    // Create and return the new resume
    const resumeId = await ctx.db.insert("resume", {
      resume_data: args.resume_data,
      owner: args.owner,
    });
    
    return resumeId;
  },
});

/**
 * Mutation to update an existing resume
 * @returns Object with success status
 */
export const updateResume = mutation({
  args: {
    resume_id: v.id("resume"),
    resume_data: v.string(),
  },
  handler: async (ctx, args) => {
    const existingResume = await ctx.db.get(args.resume_id);

    if (!existingResume) {
      throw new Error(ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    await ctx.db.replace(args.resume_id, {
      ...existingResume,
      resume_data: args.resume_data,
    });
    
    return { success: true, id: args.resume_id };
  },
});


/**
 * Mutation to upsert a resume (update if exists, create if doesn't)
 * This is the primary mutation used for saving resumes
 * @returns Object with success status, resume ID, and action taken
 */
export const upsertResume = mutation({
  args: {
    resume_id: v.optional(v.string()),
    resume_data: v.string(),
    owner: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Attempt to update existing resume if ID is provided
    if (args.resume_id) {
      try {
        const existingResume = await ctx.db.get(args.resume_id as any);
        
        if (existingResume) {
          await ctx.db.replace(args.resume_id as any, {
            ...existingResume,
            resume_data: args.resume_data,
          });
          
          return { 
            success: true, 
            id: args.resume_id, 
            action: "updated" as const 
          };
        }
      } catch (error) {
        // If ID is invalid or resume not found, fall through to create new one
        console.warn("Resume not found with ID:", args.resume_id, "- Creating new resume");
      }
    }

    // Validate resume creation limit before creating new resume
    await validateResumeLimit(ctx, args.owner);

    // Create new resume
    const newId = await ctx.db.insert("resume", {
      resume_data: args.resume_data,
      owner: args.owner,
    });
    
    return { 
      success: true, 
      id: newId, 
      action: "created" as const 
    };
  },
});

/**
 * Mutation to delete a resume
 * @param id - Resume ID to delete
 */
export const deleteResume = mutation({
  args: { id: v.id("resume") },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    
    if (!resume) {
      throw new Error(ERROR_MESSAGES.RESUME_NOT_FOUND);
    }
    
    await ctx.db.delete(args.id);
    
    return { success: true, message: "Resume deleted successfully" };
  },
});

