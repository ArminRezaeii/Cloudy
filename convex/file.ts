import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

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
    type: fileTypes,
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
      type: args.type,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorite: v.optional(v.boolean()),
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
    let file = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    const query = args.query;
    if (query) {
      file = file.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (args.favorite) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .first();
      if (!user) return file;
      const favorite = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", user._id).eq("orgId", args.orgId)
        )
        .collect();
      file = file.filter((file) =>
        favorite.some((favorite) => favorite.fileId == file._id)
      );
    }
    return file;
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hassaccessToFile(ctx, args.fileId);
    if (!access) throw new ConvexError("no access to file");
    await ctx.db.delete(args.fileId);
  },
});

export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hassaccessToFile(ctx, args.fileId);
    if (!access) throw new ConvexError("no access to file");
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first();
    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});
async function hassaccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const file = await ctx.db.get(fileId);

  if (!file) return null;

  const hassAccess = await hassAccessToOrg(
    ctx,
    identity.tokenIdentifier,
    file.orgId
  );
  if (!hassAccess) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();
  if (!user) return null;
  return { user, file };
}
