import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { likesLists } from "./schema";
import { Id } from "./_generated/dataModel";

// Query: Get all likes for a list
export const getLikesByList = query({
    args: { listId: v.id("lists") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("likesLists")
            .withIndex("byList", (q) => q.eq("listId", args.listId))
            .collect();
    },
});

// Query: Get all lists liked by a user
export const getLikesByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("likesLists")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();
    },
});

// Mutation: Add a like
export const addLike = mutation({
    args: {
        userId: v.id("users"),
        listId: v.id("lists"),
        createdAt: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("likesLists", {
            userId: args.userId,
            listId: args.listId,
            createdAt: args.createdAt,
        });
    },
});

// Mutation: Remove a like
export const removeLike = mutation({
    args: {
        userId: v.id("users"),
        listId: v.id("lists"),
    },
    handler: async (ctx, args) => {
        const like = await ctx.db
            .query("likesLists")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("listId"), args.listId))
            .first();
        if (like) {
            await ctx.db.delete(like._id);
            return true;
        }
        return false;
    },
});