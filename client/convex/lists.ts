import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createList = mutation({
    args: {
        externalId: v.string(),
        name: v.string(),
        userImageUrl: v.optional(v.string()),
        listName: v.string(),
        listDesc: v.string(),
        list_game_ids: v.array(
            v.object({
                game_id: v.string(),
                game_cover_url: v.string(),
            })
        )
    },
    handler: async (ctx, args) => {
        if (args.list_game_ids.length === 0) {
            throw new Error('List must contain at least one game');
        }
        const list = await ctx.db.insert('lists', args);
        return list;
    },
});

export const updateList = mutation({
    args: {
        listId: v.id('lists'),
        name: v.string(),
        userImageUrl: v.optional(v.string()),
        listName: v.string(),
        listDesc: v.string(),
        gameCover: v.string(),
        list_game_ids: v.array(
            v.object({
                game_id: v.string(),
                game_cover_url: v.string(),
            })
        )
    },
    handler: async (ctx, args) => {
        if (args.list_game_ids.length === 0) {
            throw new Error('List must contain at least one game');
        }

        const { listId, ...updateData } = args;
        await ctx.db.patch(listId, updateData);
        return listId;
    },
});

export const getListById = query({
    args: { id: v.id("lists") },
    handler: async (ctx, { id }) => {
        const list = await ctx.db.get(id);
        return list;
    },
});

export const getAllLists = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('lists')
            .order('desc')
            .collect();
    },
});

export const deleteList = mutation({
    args: { listId: v.id('lists') },
    handler: async (ctx, { listId }) => {
        await ctx.db.delete(listId);
        return listId;
    },
});