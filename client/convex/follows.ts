import { query, mutation } from "./_generated/server";
import { v } from "convex/values";



// Mutation: Create a follow
export const createFollow = mutation({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followerId"), args.followerId))
            .filter(q => q.eq(q.field("followingId"), args.followingId))
            .first();
        if (existing) {
            return null;
        }
        return await ctx.db.insert("follows", {
            followerId: args.followerId,
            followingId: args.followingId,
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

//check if a user is following another user
export const isFollowing = query({
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
        return !!follow;
    },
});


// Query: Get followers of a user
export const getFollowers = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followingId"), args.userId))
            .collect();
        // Fetch user documents for each followerId
        const followers = await Promise.all(
            follows.map(follow => ctx.db.get(follow.followerId))
        );
        // Filter out any nulls (in case a user was deleted)
        return followers.filter(Boolean);
    },
});



// Query: Get users followed by a user
export const getFollowing = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .filter(q => q.eq(q.field("followerId"), args.userId))
            .collect();
        // Fetch user documents for each followingId
        const followingUsers = await Promise.all(
            follows.map(follow => ctx.db.get(follow.followingId))
        );
        // Filter out any nulls (in case a user was deleted)
        return followingUsers.filter(Boolean);
    },
});

// Query: Get following count of a user
export const getFollowingCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const following = await ctx.db
            .query("follows")
            .withIndex("byFollower", (q) => q.eq("followerId", args.userId))
            .collect();
        return following.length;
    },
});

// Query: Get follower count of a user
export const getFollowerCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const followers = await ctx.db
            .query("follows")
            .withIndex("byFollowing", (q) => q.eq("followingId", args.userId))
            .collect();
        return followers.length;
    },
});