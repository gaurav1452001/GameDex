import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Schema definition
export const follows = {
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.string(),
};

// Mutation: Create a follow
export const createFollow = mutation({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
        createdAt: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("follows", {
            followerId: args.followerId,
            followingId: args.followingId,
            createdAt: args.createdAt,
        });
    },
});

// Mutation: Remove a follow
export const removeFollow = mutation({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const follow = await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followerId"), args.followerId))
            .filter(q => q.eq(q.field("followingId"), args.followingId))
            .first();
        if (follow) {
            await ctx.db.delete(follow._id);
            return true;
        }
        return false;
    },
});

// Query: Get followers of a user
export const getFollowers = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followingId"), args.userId))
            .collect();
    },
});

// Query: Get users followed by a user
export const getFollowing = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followerId"), args.userId))
            .collect();
    },
});