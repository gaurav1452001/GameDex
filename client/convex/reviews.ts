import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createReview = mutation({
    args: {
        externalId: v.string(),
        name: v.string(),
        imageUrl: v.optional(v.string()),
        gameId: v.string(),
        gameName: v.string(),
        gameCover: v.string(),
        starRating: v.number(),
        isLiked: v.boolean(),
        reviewText: v.string(),
        reviewDate: v.string(),
        screenshots: v.optional(v.string()),
        gameYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.starRating < 0 || args.starRating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }
        const review = await ctx.db.insert('reviews', args);
        return review;
    },
});

export const updateReview = mutation({
    args: {
        reviewId: v.id("reviews"),
        externalId: v.string(),
        name: v.string(),
        imageUrl: v.optional(v.string()),
        gameId: v.string(),
        gameName: v.string(),
        gameCover: v.string(),
        starRating: v.number(),
        isLiked: v.boolean(),
        reviewText: v.string(),
        reviewDate: v.string(),
        screenshots: v.optional(v.string()),
        gameYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { reviewId, ...updateData } = args;

        // Verify the user owns this review
        const existingReview = await ctx.db.get(reviewId);
        if (!existingReview || existingReview.externalId !== args.externalId) {
            throw new Error("Review not found or unauthorized");
        }

        // Validate star rating
        if (args.starRating < 0 || args.starRating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }

        await ctx.db.patch(reviewId, updateData);
        return reviewId;
    },
});

export const getReviewById = query({
    args: { id: v.id("reviews") },
    handler: async (ctx, { id }) => {
        const review = await ctx.db.get(id);
        return review;
    },
});

export const getAllReviews = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('reviews')
            .order('desc')
            .collect();
    },
});

export const upsertLatestReviewByUserAndGame = mutation({
    args: {
        externalId: v.string(),
        name: v.string(),
        imageUrl: v.optional(v.string()),
        gameId: v.string(),
        gameName: v.string(),
        gameCover: v.optional(v.string()),
        starRating: v.number(),
        isLiked: v.boolean(),
        reviewText: v.optional(v.string()),
        reviewDate: v.string(),
        screenshots: v.optional(v.string()),
        gameYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { externalId, gameId, starRating } = args;
        if (starRating < 0 || starRating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }
        // Find the latest review for this user and game
        const latestReview = await ctx.db
            .query('reviews')
            .withIndex('byUserAndGame', (q) =>
                q.eq('externalId', externalId).eq('gameId', gameId)
            )
            .order('desc')
            .first();

        if (latestReview) {
            await ctx.db.patch(latestReview._id, { starRating });
            return latestReview._id;
        } else {
            const newReview = await ctx.db.insert('reviews', args);
            return newReview;
        }
    },
});

//get the star rating of the latest review by user and game
export const getLatestReviewByUserAndGame = query({
    args: {
        externalId: v.string(),
        gameId: v.string(),
    },      
    handler: async (ctx, { externalId, gameId }) => {
        const latestReview = await ctx.db
            .query('reviews')
            .withIndex('byUserAndGame', (q) =>
                q.eq('externalId', externalId).eq('gameId', gameId)
            )
            .order('desc')
            .first();
        return latestReview // Return 0 if no review found
    },
});

export const getUserReviews = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        return await ctx.db
            .query('reviews')
            .withIndex('byUserId', (q) => q.eq('externalId', externalId))
            .order('desc')
            .collect();
    },
});

export const getFourUserReviews = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        return await ctx.db
            .query('reviews')
            .withIndex('byUserId', (q) => q.eq('externalId', externalId))
            .order('desc')
            .take(4);
    },
});

// Get the number of reviews for a specific user
export const getUserReviewsCount = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const reviews = await ctx.db
            .query('reviews')
            .withIndex('byUserId', (q) => q.eq('externalId', externalId))
            .collect();
        return reviews.length;
    },
});


export const deleteReview = mutation({
    args: {
        reviewId: v.id('reviews'),
        externalId: v.string(),
    },
    handler: async (ctx, { reviewId, externalId }) => {
        const review = await ctx.db.get(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        if (review.externalId !== externalId) {
            throw new Error('Unauthorized: You can only delete your own review');
        }
        await ctx.db.delete(reviewId);
        return reviewId;
    },
});