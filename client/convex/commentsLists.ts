import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Schema definition
export const commentsLists = {
    userId: v.id("users"),
    listId: v.id("lists"),
    commentText: v.string(),
    createdAt: v.string(),
};

// Mutation: Add a comment to a list
export const addComment = mutation({
    args: {
        userId: v.id("users"),
        listId: v.id("lists"),
        commentText: v.string(),
        createdAt: v.string(),
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