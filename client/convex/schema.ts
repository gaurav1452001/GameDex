import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export const User = {
    email: v.string(),
    externalId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
}

export const Review = {
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
}

export const List = {
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
}

export const follows = {
    followerId: v.id("users"), // who follows
    followingId: v.id("users"), // who is being followed
    createdAt: v.string(),
}

export const commentsReviews = {
    userId: v.id("users"),
    reviewId: v.id("reviews"),
    commentText: v.string(),
    createdAt: v.string(),
};

export const likesReviews = {
    userId: v.id("users"),
    reviewId: v.id("reviews"),
    createdAt: v.string(),
};

export const commentsLists = {
    userId: v.id("users"),
    listId: v.id("lists"),
    commentText: v.string(),
    createdAt: v.string(),
};

export const likesLists = {
    userId: v.id("users"),
    listId: v.id("lists"),
    createdAt: v.string(),
};

export const user_game_track = {
    externalId: v.string(), // Clerk or auth provider ID
    currentlyPlaying: v.array(
        v.object({
            game_id: v.string(),
            game_cover_url: v.optional(v.string()),
        })
    ),
    wantToPlay: v.array(
        v.object({
            game_id: v.string(),
            game_cover_url: v.optional(v.string()),
        })
    ),
    finishedPlaying: v.array(
        v.object({
            game_id: v.string(),
            game_cover_url: v.optional(v.string()),
        })
    ),
}

export default defineSchema({
    users: defineTable(User).
        index("byExternalId", ["externalId"]),

    reviews: defineTable(Review)
        .index("byUserAndGame", ["reviewDate"])
        .index("byUserId", ["externalId"]),

    lists: defineTable(List)
        .index("byUser", ["externalId"]),

    user_game_tracks: defineTable(user_game_track)
        .index("byUserId", ["externalId"]),

    follows: defineTable(follows)
        .index("byFollower", ["followerId"])
        .index("byFollowing", ["followingId"]),

    commentsReviews: defineTable(commentsReviews)
        .index("byReview", ["reviewId"])
        .index("byUser", ["userId"]),

    likesReviews: defineTable(likesReviews)
        .index("byReview", ["reviewId"])
        .index("byUser", ["userId"]),

    commentsLists: defineTable(commentsLists)
        .index("byList", ["listId"])
        .index("byUser", ["userId"]),
        
    likesLists: defineTable(likesLists)
        .index("byList", ["listId"])
        .index("byUser", ["userId"]),
})