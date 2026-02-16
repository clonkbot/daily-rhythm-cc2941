import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const DEFAULT_TASKS = [
  { name: "Clean Your Bathroom", icon: "🧹", description: "Scrub the tiles, wipe the mirrors, fresh towels out", order: 0 },
  { name: "Cook Breakfast", icon: "🍳", description: "Nourish your body with a wholesome meal", order: 1 },
  { name: "Read Your Bible", icon: "📖", description: "Feed your spirit with the Word", order: 2 },
  { name: "Spend Time with Family", icon: "💛", description: "Quality moments with the ones you love", order: 3 },
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return tasks.sort((a, b) => a.order - b.order);
  },
});

export const initializeTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (existingTasks.length === 0) {
      for (const task of DEFAULT_TASKS) {
        await ctx.db.insert("tasks", {
          userId,
          ...task,
          completed: false,
        });
      }
    }
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Task not found");

    await ctx.db.patch(args.id, {
      completed: !task.completed,
      completedAt: !task.completed ? Date.now() : undefined,
    });
  },
});

export const resetAllTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const task of tasks) {
      await ctx.db.patch(task._id, {
        completed: false,
        completedAt: undefined,
      });
    }
  },
});
