import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Constants
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

// Error Messages
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  INVALID_DURATION: "Duration must be a positive number",
  ALREADY_PREMIUM: "User already has active premium subscription",
} as const;

/**
 * Helper function to check if premium subscription is expired
 * @param expiresAt - Expiration timestamp (null means lifetime)
 * @returns True if premium is expired
 */
function isPremiumExpired(expiresAt: number | undefined): boolean {
  if (!expiresAt) return false; // Lifetime premium never expires
  return expiresAt < Date.now();
}

/**
 * Query to check if user has active premium subscription (boolean only)
 * Note: Queries are read-only, expiry checking is done in mutations
 * @returns True if user has active premium, false otherwise
 */
export const isPremiumUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user || !user.isPremium) {
      return false;
    }
    
    // Check if premium is expired (read-only check)
    if (isPremiumExpired(user.premiumExpiresAt)) {
      return false;
    }
    
    return true;
  },
});

/**
 * Query to get detailed premium subscription status
 * @returns Object containing premium status, dates, and subscription type
 */
export const getPremiumStatus = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      return {
        isPremium: false,
        premiumSince: null,
        premiumExpiresAt: null,
        isLifetime: false,
        daysRemaining: 0,
      };
    }
    
    const isExpired = isPremiumExpired(user.premiumExpiresAt);
    const isActive = user.isPremium && !isExpired;
    const isLifetime = user.isPremium && !user.premiumExpiresAt;
    
    // Calculate days remaining if applicable
    let daysRemaining = 0;
    if (isActive && user.premiumExpiresAt) {
      const msRemaining = user.premiumExpiresAt - Date.now();
      daysRemaining = Math.ceil(msRemaining / MILLISECONDS_PER_DAY);
    }
    
    return {
      isPremium: isActive,
      premiumSince: user.premiumSince || null,
      premiumExpiresAt: user.premiumExpiresAt || null,
      isLifetime,
      daysRemaining,
    };
  },
});

/**
 * Mutation to activate premium subscription
 * For admin/testing use - will be replaced with payment integration
 * @param userId - User ID to activate premium for
 * @param lifetime - If true, premium never expires (optional)
 * @param durationDays - Number of days for subscription (e.g., 30, 365) (optional)
 */
export const activatePremium = mutation({
  args: {
    userId: v.id("users"),
    lifetime: v.optional(v.boolean()),
    durationDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    // Validate arguments
    if (!args.lifetime && !args.durationDays) {
      throw new Error("Either 'lifetime' must be true or 'durationDays' must be specified");
    }
    
    if (args.durationDays && args.durationDays <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_DURATION);
    }
    
    const now = Date.now();
    let expiresAt: number | undefined = undefined;
    
    // Calculate expiry timestamp if not lifetime
    if (!args.lifetime && args.durationDays) {
      expiresAt = now + (args.durationDays * MILLISECONDS_PER_DAY);
    }
    
    await ctx.db.patch(args.userId, {
      isPremium: true,
      premiumSince: user.premiumSince || now, // Preserve original activation date
      premiumExpiresAt: expiresAt,
    });
    
    const message = args.lifetime 
      ? "Lifetime premium subscription activated successfully" 
      : `Premium subscription activated for ${args.durationDays} days`;
    
    return {
      success: true,
      message,
      expiresAt,
    };
  },
});

/**
 * Mutation to deactivate premium subscription
 * For admin/testing use
 * @param userId - User ID to deactivate premium for
 */
export const deactivatePremium = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    await ctx.db.patch(args.userId, {
      isPremium: false,
      premiumExpiresAt: Date.now(), // Mark as expired immediately
    });
    
    return {
      success: true,
      message: "Premium subscription deactivated successfully",
    };
  },
});

/**
 * Mutation to extend premium subscription
 * For payment integration - extends existing subscription or activates from now
 * @param userId - User ID to extend premium for
 * @param additionalDays - Number of days to add to subscription
 */
export const extendPremium = mutation({
  args: {
    userId: v.id("users"),
    additionalDays: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (args.additionalDays <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_DURATION);
    }
    
    const now = Date.now();
    let newExpiresAt: number;
    
    // If currently premium with valid expiry date, extend from that date
    if (user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > now) {
      newExpiresAt = user.premiumExpiresAt + (args.additionalDays * MILLISECONDS_PER_DAY);
    } else {
      // If expired or never had premium, extend from now
      newExpiresAt = now + (args.additionalDays * MILLISECONDS_PER_DAY);
    }
    
    await ctx.db.patch(args.userId, {
      isPremium: true,
      premiumSince: user.premiumSince || now, // Preserve or set activation date
      premiumExpiresAt: newExpiresAt,
    });
    
    const expiryDate = new Date(newExpiresAt).toLocaleDateString();
    
    return {
      success: true,
      message: `Premium subscription extended by ${args.additionalDays} days`,
      expiresAt: newExpiresAt,
      expiryDate,
    };
  },
});
