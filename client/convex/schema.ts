import {v} from "convex/values";
import {defineSchema, defineTable} from "convex/server";

export const User={
    email:v.string(),
    externalId:v.string(),
    name:v.string(),
    imageUrl:v.optional(v.string()),
}

export default defineSchema({
    users:defineTable(User).index("byExternalId", ["externalId"]),
})