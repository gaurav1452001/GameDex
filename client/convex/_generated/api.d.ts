/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as commentsLists from "../commentsLists.js";
import type * as commentsReviews from "../commentsReviews.js";
import type * as follows from "../follows.js";
import type * as http from "../http.js";
import type * as likesLists from "../likesLists.js";
import type * as likesReviews from "../likesReviews.js";
import type * as lists from "../lists.js";
import type * as reviews from "../reviews.js";
import type * as user_game_tracks from "../user_game_tracks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  commentsLists: typeof commentsLists;
  commentsReviews: typeof commentsReviews;
  follows: typeof follows;
  http: typeof http;
  likesLists: typeof likesLists;
  likesReviews: typeof likesReviews;
  lists: typeof lists;
  reviews: typeof reviews;
  user_game_tracks: typeof user_game_tracks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
