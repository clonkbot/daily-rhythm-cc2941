import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(),
    description: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    order: v.number(),
  }).index("by_user", ["userId"]),
  timerSessions: defineTable({
    userId: v.id("users"),
    startedAt: v.number(),
    duration: v.number(), // in seconds
    isRunning: v.boolean(),
    pausedAt: v.optional(v.number()),
    remainingWhenPaused: v.optional(v.number()),
  }).index("by_user", ["userId"]),
  dailyProgress: defineTable({
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
    tasksCompleted: v.number(),
    totalTasks: v.number(),
  }).index("by_user_date", ["userId", "date"]),
});
