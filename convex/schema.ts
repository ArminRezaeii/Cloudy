import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    orgId: v.string(),
    name: v.string(),
    fileId:v.id("_storage")
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgsId: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
