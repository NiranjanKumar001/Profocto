import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// get all resumes of the user
export const getResumes = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("owner"), args.id))
      .collect();
  },
});

// get single resume 
// for getting _id of a resume
export const getResume = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
})

// create a resume
export const createResume = mutation({
  args: {
    resume_data: v.string(),
    owner: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resume", args);
  },
});

// update a resume with new data
export const updateResume = mutation({
  args: {
    resume_id: v.id("resume"),
    resume_data: v.string(),
  },
  handler: async (ctx, args) => {
    const existingResume = await ctx.db.get(args.resume_id);

    if (existingResume) {
      await ctx.db.replace(args.resume_id, {
        ...existingResume,
        resume_data: args.resume_data,
      });
      return { success: true };
    }

    return { success: false };
  },
});


// delete a resume
export const deleteResume = mutation({
  args: { id: v.id("resume") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
