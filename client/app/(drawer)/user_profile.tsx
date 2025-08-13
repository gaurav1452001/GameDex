import React, { use, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Touchable } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { Authenticated, useMutation, useQuery } from 'convex/react'


export default function Profile() {
    const params = useLocalSearchParams();
    const userId = params?.externalId as string;
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const OtherUser = useQuery(api.users.getUserByExternalId, { externalId: userId as string });
    const loggedInUser = useQuery(
        api.users.getUserByExternalId,
        user?.id ? { externalId: user?.id } : "skip"
    );
    const following = useQuery(
        api.follows.isFollowing,
        user && loggedInUser?._id && OtherUser?._id
            ? {
                followerId: loggedInUser._id as Id<'users'>,
                followingId: OtherUser._id as Id<'users'>
            }
            : "skip"
    );
    const follow = useMutation(api.follows.createFollow);
    const unfollow = useMutation(api.follows.removeFollow);



    const finishedCount = useQuery(api.user_game_tracks.getFinishedGamesCount, {
        externalId: userId as string
    });
    const playingCount = useQuery(api.user_game_tracks.getPlayingGamesCount, {
        externalId: userId as string
    });
    const wishlistCount = useQuery(api.user_game_tracks.getWishlistGamesCount, {
        externalId: userId as string
    });
    const reviewsCount = useQuery(api.reviews.getUserReviewsCount, {
        externalId: userId as string
    });
    const listsCount = useQuery(api.lists.getListCountByUserId, {
        externalId: userId as string
    });
    const recentReviews = useQuery(api.reviews.getFourUserReviews, {
        externalId: userId as string
    });
    const favoriteGames = useQuery(api.users.getFavoriteGames, {
        externalId: userId as string
    });
    const likesListsCount = useQuery(api.likesLists.getLikesCountByUser, {
        userId: OtherUser?._id as Id<'users'>
    }) ?? 0;
    const likesReviewsCount = useQuery(api.likesReviews.getLikesCountByUser, {
        userId: OtherUser?._id as Id<'users'>
    }) ?? 0;
    const likes = likesListsCount + likesReviewsCount;
    const followerCount = useQuery(api.follows.getFollowerCount, {
        userId: OtherUser?._id as Id<'users'>
    });
    const followingCount = useQuery(api.follows.getFollowingCount, {
        userId: OtherUser?._id as Id<'users'>
    });


    if (!userId) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#c6c6c6ff', fontSize: 18, fontWeight: 'bold' }}>
                    {OtherUser?.name || 'Profile'}
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                <View style={styles.scrollContent}>
                    <Image
                        source={{ uri: OtherUser?.imageUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <Authenticated>
                        <View style={{ marginTop: 10 }}>
                            {OtherUser?._id !== loggedInUser?._id && (
                                following ? (
                                    <TouchableOpacity onPress={() => {
                                        if (isFollowing) return;
                                        setIsFollowing(true);
                                        unfollow({ followerId: loggedInUser?._id as Id<'users'>, followingId: OtherUser?._id as Id<'users'> })
                                        setTimeout(() => setIsFollowing(false), 800);
                                    }}>
                                        <Text style={styles.following}>Following</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => {
                                        if (isFollowing) return;
                                        setIsFollowing(true);
                                        follow({
                                            followerId: loggedInUser?._id as Id<'users'>, followingId: OtherUser?._id as Id<'users'>
                                        })
                                        setTimeout(() => setIsFollowing(false), 800);
                                    }}>
                                        <Text style={styles.follower}>Follow</Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    </Authenticated>
                    <Text style={styles.userBio}>
                        {OtherUser?.bio || 'No bio available.'}
                    </Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#363636ff', marginTop: 30, width: '100%' }} />
                <View style={styles.scrollContent}>
                    <Text style={{ color: '#808080ff', fontSize: 12, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                        FAVORITES
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, marginHorizontal: -16 }}>
                        {
                            favoriteGames && favoriteGames?.length > 0 ? (
                                favoriteGames.map((game) => (
                                    <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${game.game_id}`)} key={game.game_id}>
                                        <Image
                                            source={{ uri: game?.game_cover_url }}
                                            style={styles.displayImage}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={{ color: '#717171ff', fontSize: 15 }}>No favorite games</Text>
                            )
                        }
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#363636ff', marginTop: 30, width: '100%' }} />
                <View style={styles.scrollContent}>
                    <Text style={{ color: '#808080ff', fontSize: 12, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1, }}>
                        RECENT ACTIVITY
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, marginHorizontal: -16 }}>
                        {
                            recentReviews && recentReviews?.length > 0 ? (
                                recentReviews.map((review) => (
                                    <TouchableOpacity onPress={() => router.push(`/(drawer)/reviews/${review._id}`)} key={review._id}>
                                        <Image
                                            source={{ uri: review?.gameCover }}
                                            style={styles.displayImage}
                                            resizeMode="contain"
                                        />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2 }}>
                                            <StarRatingDisplay
                                                rating={review?.starRating}
                                                starSize={10}
                                                emptyColor='#181818'
                                                color="#989898ff"
                                                starStyle={{ marginHorizontal: -0.2 }}
                                            />
                                            {review?.isLiked && (
                                                <Ionicons
                                                    name="heart"
                                                    size={10}
                                                    color="#d98138ff"
                                                    style={{ marginLeft: 6 }}
                                                />
                                            )}
                                            {review?.reviewText && (
                                                <Ionicons
                                                    name="menu-outline"
                                                    size={10}
                                                    color="#989898ff"
                                                    style={{ marginLeft: 6 }}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={{ color: '#717171ff', fontSize: 15 }}>No recent activity</Text>
                            )
                        }
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#363636ff', marginTop: 30, width: '100%' }} />
                <View style={styles.scrollContent}>
                    <Text style={{ color: '#808080ff', fontSize: 12, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1, }}>
                        RATINGS
                    </Text>

                </View>
                <View style={{ height: 1, backgroundColor: '#363636ff', marginTop: 30, width: '100%' }} />

                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={() => {router.push(
                        {
                            pathname: '/(drawer)/user_games',
                            params: { externalId: userId }
                        }
                    )}} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Games Finished
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {finishedCount ? finishedCount : 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {router.push(
                        {
                            pathname: '/(drawer)/user_games/wishlist',
                            params: { externalId: userId }
                        }
                    )}} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Games Wishlist
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {wishlistCount ? wishlistCount : 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {router.push(
                        {
                            pathname: '/(drawer)/user_games/playing',
                            params: { externalId: userId }
                        }
                    )}} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Games Playing
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {playingCount ? playingCount : 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        router.push(
                            {
                                pathname: '/(drawer)/user_reviews',
                                params: { externalId: userId }
                            }
                        )
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Reviews
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {reviewsCount ? reviewsCount : 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        router.push(
                            {
                                pathname: '/(drawer)/user_lists',
                                params: { externalId: userId }
                            }
                        )
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Lists
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {listsCount ? listsCount : 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        router.push(
                            {
                                pathname: '/(drawer)/user_likes/lists',
                                params: { externalId: userId }
                            }
                        )
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Likes
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {likes ? likes : 0}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Following
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {followingCount ? followingCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', letterSpacing: 1 }}>
                            Followers
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {followerCount ? followerCount : 0}
                        </Text>
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
    },
    following: {
        color: '#84e661ff',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#84e661ff',
        padding: 4,
        letterSpacing: 1
    },
    follower: {
        color: '#8c8c8cff',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#8c8c8cff',
        padding: 4,
        letterSpacing: 1
    },

    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 25,
        paddingBottom: 20,
        backgroundColor: '#2a2a2a',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    displayImage: {
        width: 80,
        height: 108,
        margin: 2.4,
        marginTop: 10,
        borderWidth: 0.4,
        borderColor: 'gray',
        backgroundColor: '#404040',
    },
    profileSection: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#858585ff',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c6c6c6ff',
        marginTop: 15,
        marginBottom: 5,
    },
    userBio: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 10,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        marginHorizontal: 20,
        marginTop: 30,
        padding: 15,
        borderRadius: 12,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});