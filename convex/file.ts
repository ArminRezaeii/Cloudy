import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createFile = mutation({
  args: {
    name: v.string(),
    gender: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("you must log in");
    await ctx.db.insert("files", {
      name: args.name,
      gender: args.gender,
    });
  },
});

export const getFiles = query({
  args: {},

  async handler(ctx, args) {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];
    return ctx.db.query("files").collect();
  },
});
