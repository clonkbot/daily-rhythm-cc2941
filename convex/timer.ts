import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const DEFAULT_DURATION = 2 * 60 * 60; // 1 hour 59 min 60 sec = 2 hours in seconds

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db
      .query("timerSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return session;
  },
});

export const start = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("timerSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      if (existing.remainingWhenPaused !== undefined) {
        // Resume from pause
        await ctx.db.patch(existing._id, {
          isRunning: true,
          startedAt: Date.now(),
          duration: existing.remainingWhenPaused,
          pausedAt: undefined,
          remainingWhenPaused: undefined,
        });
      } else if (!existing.isRunning) {
        await ctx.db.patch(existing._id, {
          isRunning: true,
          startedAt: Date.now(),
        });
      }
    } else {
      await ctx.db.insert("timerSessions", {
        userId,
        startedAt: Date.now(),
        duration: DEFAULT_DURATION,
        isRunning: true,
      });
    }
  },
});

export const pause = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db
      .query("timerSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (session && session.isRunning) {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      const remaining = Math.max(0, session.duration - elapsed);

      await ctx.db.patch(session._id, {
        isRunning: false,
        pausedAt: Date.now(),
        remainingWhenPaused: remaining,
      });
    }
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db
      .query("timerSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        startedAt: Date.now(),
        duration: DEFAULT_DURATION,
        isRunning: false,
        pausedAt: undefined,
        remainingWhenPaused: undefined,
      });
    } else {
      await ctx.db.insert("timerSessions", {
        userId,
        startedAt: Date.now(),
        duration: DEFAULT_DURATION,
        isRunning: false,
      });
    }
  },
});
