import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf")
);
export const roles = v.union(v.literal("admin"), v.literal("member"));
export default defineSchema({
  files: defineTable({
    orgId: v.string(),
    name: v.string(),
    fileId: v.id("_storage"),
    type: fileTypes,
    userId:v.id("users"),
    shouldDelete: v.optional(v.boolean()),
  })
    .index("by_orgId", ["orgId"])
    .index("byShouldDelete", ["shouldDelete"]),

  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    name:v.optional(v.string()),
    image:v.optional(v.string()),
    orgsId: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
