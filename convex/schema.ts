import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    gender: v.string(),
    name: v.string(),
  }),
});