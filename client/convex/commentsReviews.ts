import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const commentsReviews = {
    userId: v.id("users"),
    reviewId: v.id("reviews"),
    commentText: v.string(),
    createdAt: v.string(),
};

// Query: Get comments for a review
export const getCommentsByReview = query({
    args: { reviewId: v.id("reviews") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("commentsReviews")
            .withIndex("byReview", (q) => q.eq("reviewId", args.reviewId))
            .order("desc")
            .collect();
    },
});

// Mutation: Add a comment to a review
export const addComment = mutation({
    args: {
        userId: v.id("users"),
        reviewId: v.id("reviews"),
        commentText: v.string(),
        createdAt: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("commentsReviews", {
            userId: args.userId,
            reviewId: args.reviewId,
            commentText: args.commentText,
            createdAt: args.createdAt,
        });
    },
});

// Mutation: Delete a comment
export const deleteComment = mutation({
    args: { commentId: v.id("commentsReviews") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.commentId);
    },
});