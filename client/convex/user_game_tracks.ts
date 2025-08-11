import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create initial user game track record
export const createUserGameTrack = mutation({
    args: {
        externalId: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), args.externalId))
            .first();

        if (existingUser) {
            return existingUser._id;
        }

        // Create new user track record with empty arrays
        const userTrack = await ctx.db.insert('user_game_tracks', {
            externalId: args.externalId,
            currentlyPlaying: [],
            wantToPlay: [],
            finishedPlaying: [],
        });
        return userTrack;
    },
});

// Add game to currently playing
export const addToCurrentlyPlaying = mutation({
    args: {
        externalId: v.string(),
        game_id: v.string(),
        game_cover_url: v.string(),
    },
    handler: async (ctx, args) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), args.externalId))
            .first();

        if (!userTrack) {
            // Create new record if doesn't exist
            return await ctx.db.insert('user_game_tracks', {
                externalId: args.externalId,
                currentlyPlaying: [{ game_id: args.game_id, game_cover_url: args.game_cover_url }],
                wantToPlay: [],
                finishedPlaying: [],
            });
        }

        // Check if game already exists in any category
        const gameExistsInCurrently = userTrack.currentlyPlaying.some(game => game.game_id === args.game_id);
        const gameExistsInWantTo = userTrack.wantToPlay.some(game => game.game_id === args.game_id);
        const gameExistsInFinished = userTrack.finishedPlaying.some(game => game.game_id === args.game_id);

        if (gameExistsInCurrently) {
            throw new Error('Game is already in currently playing list');
        }

        // Remove from other categories if exists
        let updatedWantToPlay = userTrack.wantToPlay;
        let updatedFinishedPlaying = userTrack.finishedPlaying;

        if (gameExistsInWantTo) {
            updatedWantToPlay = userTrack.wantToPlay.filter(game => game.game_id !== args.game_id);
        }
        if (gameExistsInFinished) {
            updatedFinishedPlaying = userTrack.finishedPlaying.filter(game => game.game_id !== args.game_id);
        }

        // Add to currently playing
        const updatedCurrentlyPlaying = [
            ...userTrack.currentlyPlaying,
            { game_id: args.game_id, game_cover_url: args.game_cover_url }
        ];

        await ctx.db.patch(userTrack._id, {
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: updatedWantToPlay,
            finishedPlaying: updatedFinishedPlaying,
        });

        return userTrack._id;
    },
});

// Add game to want to play
export const addToWantToPlay = mutation({
    args: {
        externalId: v.string(),
        game_id: v.string(),
        game_cover_url: v.string(),
    },
    handler: async (ctx, args) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), args.externalId))
            .first();

        if (!userTrack) {
            return await ctx.db.insert('user_game_tracks', {
                externalId: args.externalId,
                currentlyPlaying: [],
                wantToPlay: [{ game_id: args.game_id, game_cover_url: args.game_cover_url }],
                finishedPlaying: [],
            });
        }

        const gameExistsInWantTo = userTrack.wantToPlay.some(game => game.game_id === args.game_id);
        const gameExistsInCurrently = userTrack.currentlyPlaying.some(game => game.game_id === args.game_id);
        const gameExistsInFinished = userTrack.finishedPlaying.some(game => game.game_id === args.game_id);

        if (gameExistsInWantTo) {
            throw new Error('Game is already in want to play list');
        }

        let updatedCurrentlyPlaying = userTrack.currentlyPlaying;
        let updatedFinishedPlaying = userTrack.finishedPlaying;

        if (gameExistsInCurrently) {
            updatedCurrentlyPlaying = userTrack.currentlyPlaying.filter(game => game.game_id !== args.game_id);
        }
        if (gameExistsInFinished) {
            updatedFinishedPlaying = userTrack.finishedPlaying.filter(game => game.game_id !== args.game_id);
        }

        const updatedWantToPlay = [
            ...userTrack.wantToPlay,
            { game_id: args.game_id, game_cover_url: args.game_cover_url }
        ];

        await ctx.db.patch(userTrack._id, {
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: updatedWantToPlay,
            finishedPlaying: updatedFinishedPlaying,
        });

        return userTrack._id;
    },
});

// Add game to finished playing
export const addToFinishedPlaying = mutation({
    args: {
        externalId: v.string(),
        game_id: v.string(),
        game_cover_url: v.string(),
    },
    handler: async (ctx, args) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), args.externalId))
            .first();

        if (!userTrack) {
            return await ctx.db.insert('user_game_tracks', {
                externalId: args.externalId,
                currentlyPlaying: [],
                wantToPlay: [],
                finishedPlaying: [{ game_id: args.game_id, game_cover_url: args.game_cover_url }],
            });
        }

        const gameExistsInFinished = userTrack.finishedPlaying.some(game => game.game_id === args.game_id);
        const gameExistsInCurrently = userTrack.currentlyPlaying.some(game => game.game_id === args.game_id);
        const gameExistsInWantTo = userTrack.wantToPlay.some(game => game.game_id === args.game_id);

        if (gameExistsInFinished) {
            throw new Error('Game is already in finished playing list');
        }

        let updatedCurrentlyPlaying = userTrack.currentlyPlaying;
        let updatedWantToPlay = userTrack.wantToPlay;

        if (gameExistsInCurrently) {
            updatedCurrentlyPlaying = userTrack.currentlyPlaying.filter(game => game.game_id !== args.game_id);
        }
        if (gameExistsInWantTo) {
            updatedWantToPlay = userTrack.wantToPlay.filter(game => game.game_id !== args.game_id);
        }

        const updatedFinishedPlaying = [
            ...userTrack.finishedPlaying,
            { game_id: args.game_id, game_cover_url: args.game_cover_url }
        ];

        await ctx.db.patch(userTrack._id, {
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: updatedWantToPlay,
            finishedPlaying: updatedFinishedPlaying,
        });

        return userTrack._id;
    },
});

// Remove game from any category
export const removeGameFromTracking = mutation({
    args: {
        externalId: v.string(),
        game_id: v.string(),
    },
    handler: async (ctx, args) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), args.externalId))
            .first();

        if (!userTrack) {
            throw new Error('User track record not found');
        }

        const updatedCurrentlyPlaying = userTrack.currentlyPlaying.filter(game => game.game_id !== args.game_id);
        const updatedWantToPlay = userTrack.wantToPlay.filter(game => game.game_id !== args.game_id);
        const updatedFinishedPlaying = userTrack.finishedPlaying.filter(game => game.game_id !== args.game_id);

        await ctx.db.patch(userTrack._id, {
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: updatedWantToPlay,
            finishedPlaying: updatedFinishedPlaying,
        });

        return userTrack._id;
    },
});

// Get user game track data
export const getUserGameTrack = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), externalId))
            .first();

        return userTrack;
    },
});

//Get the number of games finished playing by a user
export const getFinishedGamesCount = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), externalId))
            .first();   

        if (!userTrack) {
            throw new Error('User track record not found');
        }

        return userTrack.finishedPlaying.length;
    },
});

//Get the number of games currently playing by a user
export const getPlayingGamesCount = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), externalId))
            .first();   

        if (!userTrack) {
            throw new Error('User track record not found');
        }

        return userTrack.currentlyPlaying.length;
    },
});

//Get the number of games WishListed by a user
export const getWishlistGamesCount = query({
    args: { externalId: v.string() },
    handler: async (ctx, { externalId }) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), externalId))
            .first();   

        if (!userTrack) {
            throw new Error('User track record not found');
        }

        return userTrack.wantToPlay.length;
    },
});



// Get game status for a specific user and game
export const getGameStatus = query({
    args: { 
        externalId: v.string(),
        game_id: v.string(),
    },
    handler: async (ctx, { externalId, game_id }) => {
        const userTrack = await ctx.db
            .query('user_game_tracks')
            .filter((q) => q.eq(q.field('externalId'), externalId))
            .first();

        if (!userTrack) {
            return null;
        }

        if (userTrack.currentlyPlaying.some(game => game.game_id === game_id)) {
            return 'currentlyPlaying';
        }
        if (userTrack.wantToPlay.some(game => game.game_id === game_id)) {
            return 'wantToPlay';
        }
        if (userTrack.finishedPlaying.some(game => game.game_id === game_id)) {
            return 'finishedPlaying';
        }
        return null;
    },
});