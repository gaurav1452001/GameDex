import {v} from "convex/values";
import {defineSchema, defineTable} from "convex/server";

export const User={
    email:v.string(),
    externalId:v.string(),
    name:v.string(),
    imageUrl:v.optional(v.string()),
}

export const Review={
    externalId:v.string(),
    name:v.string(),
    imageUrl:v.optional(v.string()),
    gameId:v.string(),
    gameName:v.string(),
    gameCover:v.string(),
    starRating:v.number(),
    isLiked:v.boolean(),
    reviewText:v.string(),
    reviewDate:v.string(),
    screenshots:v.optional(v.string()),
    gameYear:v.optional(v.string()),
}

export default defineSchema({
    users:defineTable(User).
    index("byExternalId", ["externalId"]),

    reviews:defineTable(Review)
	.index("byUserAndGame", ["reviewDate"])
})