import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

// Query: Check if a user has liked a list
export const hasUserLikedList = query({
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
        return !!like;
    },
});

// Query: count all likes for a list
export const getLikesCountByList = query({
    args: { listId: v.id("lists") },
    handler: async (ctx, args) => {
        const likes = await ctx.db
            .query("likesLists")
            .withIndex("byList", (q) => q.eq("listId", args.listId))
            .collect();
        return likes.length;
    },
});


// count all likes a user has given across all lists
export const getLikesCountByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const likes = await ctx.db
            .query("likesLists")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();
        return likes.length;
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

//get all lists liked by a user with details
export const getListsLikedByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => { 
        const likes = await ctx.db
            .query("likesLists")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();

        const listsId = likes.map(like => like.listId);

        // Fetch all lists by their IDs
        const lists = await Promise.all(
            listsId.map(listId => ctx.db.get(listId))
        );

        // Filter out any nulls (in case some lists were deleted)
        return lists.filter(Boolean);
    }
});

// Mutation: Add a like
export const addLike = mutation({
    args: {
        userId: v.id("users"),
        listId: v.id("lists"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("likesLists", {
            userId: args.userId,
            listId: args.listId,
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
