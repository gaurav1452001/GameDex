import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation: Add a comment to a list
export const addComment = mutation({
    args: {
        userId: v.id("users"),
        userName: v.string(),
        userImageUrl: v.optional(v.string()),
        listId: v.id("lists"),
        commentText: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("commentsLists", args);
    },
});

// Query: Get comments for a specific list
export const getCommentsByList = query({
    args: { listId: v.id("lists") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("commentsLists")
            .filter((q) => q.eq(q.field("listId"), args.listId))
            .order("desc")
            .collect();
    },
});