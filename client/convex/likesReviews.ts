import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get likes by reviewId
export const getLikesByReview = query({
    args: { reviewId: v.id("reviews") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("likesReviews")
            .withIndex("byReview", (q) => q.eq("reviewId", args.reviewId))
            .collect();
    },
});

// Query: Check if user has liked a review
export const hasUserLikedReview = query({
    args: {
        userId: v.id("users"),
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const like = await ctx.db
            .query("likesReviews")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
            .first();
        return !!like;
    },
});

//count likes by userId
export const getLikesCountByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const likes = await ctx.db
            .query("likesReviews")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();
        return likes.length;
    },
});

//count likes by reviewId
export const getLikesCountByReview = query({
    args: { reviewId: v.id("reviews") },
    handler: async (ctx, args) => {
        const likes = await ctx.db
            .query("likesReviews")  
            .withIndex("byReview", (q) => q.eq("reviewId", args.reviewId))
            .collect();
        return likes.length;
    },
});

// Query: Get likes by userId
export const getLikesByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("likesReviews")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();
        },
    });

export const getReviewsLikedByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => { 
        const likes = await ctx.db
            .query("likesReviews")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .collect();

        const reviewIds = likes.map(like => like.reviewId);

        // Fetch all reviews by their IDs
        const reviews = await Promise.all(
            reviewIds.map(reviewId => ctx.db.get(reviewId))
        );

        // Filter out any nulls (in case some reviews were deleted)
        return reviews.filter(Boolean);
    }
});

// Mutation: Add a like
export const addLikeReview = mutation({
    args: {
        userId: v.id("users"),
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("likesReviews", {
            userId: args.userId,
            reviewId: args.reviewId,
        });
    },
});

// Mutation: Remove a like
export const removeLikeReview = mutation({
    args: {
        userId: v.id("users"),
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const like = await ctx.db
            .query("likesReviews")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
            .first();
        if (like) {
            await ctx.db.delete(like._id);
            return true;
        }
        return false;
    },
});
