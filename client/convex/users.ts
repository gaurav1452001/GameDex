import { internalMutation, query, QueryCtx, mutation } from './_generated/server';
import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';
import { use } from 'react';

export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {
        const userAttributes = {
            name: `${data.first_name}` || 'User',
            externalId: data.id,
            email: data.email_addresses[0].email_address,
            imageUrl: data.image_url,
        };

        const user = await userByExternalId(ctx, data.id);
        if (user === null) {
            await ctx.db.insert('users', userAttributes);
        } else {
            await ctx.db.patch(user._id, userAttributes);
        }
    },
});

export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
        const user = await userByExternalId(ctx, clerkUserId);

        if (user !== null) {
            await ctx.db.delete(user._id);
        } else {
            console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
        }
    },
});

// async function userByExternalId(ctx: QueryCtx, externalId: string) {
//     return await ctx.db
//         .query('users')
//         .withIndex('byExternalId', (q) => q.eq('externalId', externalId))
//         .unique();
// }


//get user info by externalId
async function userByExternalId(ctx: QueryCtx, externalId: string) {
    return await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
        .unique();
}


export const getUserByExternalId = query({
    args: { externalId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
            .unique();
    },
});

export const getFavoriteGames = query({
    args: { externalId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
            .unique();

        if (!user || !user.fourFavorites) {
            return [];
        }

        return user.fourFavorites;
    },
});

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const getUserById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const updateUser = mutation({
    args: {
        externalId: v.string(),
        name: v.string(),
        bio: v.optional(v.string()),
        fourFavorites: v.optional(
            v.array(
                v.object({
                    game_id: v.string(),
                    game_cover_url: v.optional(v.string()),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            name: args.name,
            bio: args.bio,
            fourFavorites: args.fourFavorites,
        });

        return user._id;
    },
});