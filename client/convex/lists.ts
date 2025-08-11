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
                game_name: v.string(),
                game_cover_url: v.optional(v.string()),
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
        externalId: v.string(),
        name: v.string(),
        userImageUrl: v.optional(v.string()),
        listName: v.string(),
        listDesc: v.optional(v.string()),
        list_game_ids: v.array(
            v.object({
                game_id: v.string(),
                game_name: v.string(),
                game_cover_url: v.optional(v.string()),
            })
        )
    },
    handler: async (ctx, args) => {
        if (args.list_game_ids.length === 0) {
            throw new Error('List must contain at least one game');
        }

        // Fetch the existing list
        const existingList = await ctx.db.get(args.listId);
        if (!existingList) {
            throw new Error('List not found');
        }

        // Verify externalId matches
        if (existingList.externalId !== args.externalId) {
            throw new Error('External ID does not match the owner of the list');
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

export const getListByUserId = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        return await ctx.db
            .query('lists')
            .filter(q => q.eq(q.field('externalId'), externalId))
            .order('desc')
            .collect();
    },
});

//count all lists by user id
export const getListCountByUserId = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const countLists = await ctx.db
            .query('lists')
            .filter(q => q.eq(q.field('externalId'), externalId))
            .collect();
        return countLists.length;
    },
});

export const deleteList = mutation({
    args: { 
        listId: v.id('lists'),
        externalId: v.string(),
    },
    handler: async (ctx, { listId, externalId }) => {
        const list = await ctx.db.get(listId);
        if (!list) {
            throw new Error('List not found');
        }
        if (list.externalId !== externalId) {
            throw new Error('External ID does not match the owner of the list');
        }
        await ctx.db.delete(listId);
        return listId;
    },
});