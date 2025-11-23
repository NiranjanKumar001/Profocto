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

// get significant resumes (manually saved or saved on close)
export const getSignificantResumes = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const allResumes = await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("owner"), args.id))
      .collect();
    
    // Filter to only include resumes that have been manually saved
    return allResumes.filter(resume => !resume.isAutoSaveOnly);
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

// upsert resume - create if doesn't exist, update if it does
export const upsertResume = mutation({
  args: {
    resume_id: v.optional(v.string()),
    resume_data: v.string(),
    owner: v.id("users"),
    isSignificantSave: v.optional(v.boolean()), // True for manual saves or on close
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // If resume_id is provided, try to find and update it
    if (args.resume_id) {
      try {
        const existingResume = await ctx.db.get(args.resume_id as any);
        if (existingResume) {
          await ctx.db.replace(args.resume_id as any, {
            ...existingResume,
            resume_data: args.resume_data,
            // Update lastSignificantSave only if this is a manual/close save
            lastSignificantSave: args.isSignificantSave 
              ? now 
              : existingResume.lastSignificantSave,
            // Clear isAutoSaveOnly flag if this is a significant save
            isAutoSaveOnly: args.isSignificantSave 
              ? false 
              : existingResume.isAutoSaveOnly,
          });
          return { success: true, id: args.resume_id, action: "updated" };
        }
      } catch (error) {
        // If ID is invalid or resume not found, create new one
        console.log("Resume not found, creating new one");
      }
    }
    // Create new resume
    const newId = await ctx.db.insert("resume", {
      resume_data: args.resume_data,
      owner: args.owner,
      lastSignificantSave: args.isSignificantSave ? now : undefined,
      isAutoSaveOnly: !args.isSignificantSave,
    });
    return { success: true, id: newId, action: "created" };
  },
});
// delete a resume
export const deleteResume = mutation({
  args: { id: v.id("resume") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
