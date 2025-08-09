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
        reviewId: v.id('reviews'),
        starRating: v.number(),
        isLiked: v.boolean(),
        reviewText: v.string(),
        reviewDate: v.string(),
    },
    handler: async (ctx, args) => {
        if (args.starRating < 0 || args.starRating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }

        const { reviewId, ...updateData } = args;
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

// export const getReviewByUserAndGame = query({
//     args: {
//         externalId: v.string(),
//     },
//     handler: async (ctx, { externalId, gameId }) => {
//         return await ctx.db
//             .query('reviews')
//             .withIndex('byUserAndGame', (q) =>
//                 q.eq('externalId', externalId).eq('gameId', gameId)
//             )
//             .first();
//     },
// });

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

export const deleteReview = mutation({
    args: { reviewId: v.id('reviews') },
    handler: async (ctx, { reviewId }) => {
        await ctx.db.delete(reviewId);
        return reviewId;
    },
});