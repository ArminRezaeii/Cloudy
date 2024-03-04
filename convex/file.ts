import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("you must be logged in");
  return await ctx.storage.generateUploadUrl();
});

async function hassAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier);
  const hassAccess =
    user.orgsId.includes(orgId) || user.tokenIdentifier.includes(orgId);
  return hassAccess;
}
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type:fileTypes
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("you must be logged in");

    const hassAccess = await hassAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hassAccess) {
      throw new ConvexError("you do not have  access to this org");
    }
    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type:args.type
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },

  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const hassAccess = await hassAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hassAccess) return [];
    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("you must be logged in");

    const file = await ctx.db.get(args.fileId);

    if (!file) throw new ConvexError("this file does not exist");

    const hassAccess = await hassAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );
    if(!hassAccess) throw new ConvexError("you do not have access")
    await ctx.db.delete(args.fileId)
  },
});
