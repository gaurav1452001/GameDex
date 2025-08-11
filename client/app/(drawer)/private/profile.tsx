import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from 'convex/react';
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { api } from '@/convex/_generated/api';


export default function Profile() {
    const { user } = useUser();
    const finishedCount = useQuery(api.user_game_tracks.getFinishedGamesCount, {
        externalId: user?.id as string
    });
    const playingCount = useQuery(api.user_game_tracks.getPlayingGamesCount, {
        externalId: user?.id as string
    });
    const wishlistCount = useQuery(api.user_game_tracks.getWishlistGamesCount, {
        externalId: user?.id as string
    });
    const reviewsCount = useQuery(api.reviews.getUserReviewsCount, {
        externalId: user?.id as string
    });
    const listsCount = useQuery(api.lists.getListCountByUserId, {
        externalId: user?.id as string
    });
    const recentReviews = useQuery(api.reviews.getFourUserReviews, {
        externalId: user?.id as string
    });

    if (!user) {
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
                <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#c6c6c6ff', fontSize: 18, fontWeight: 'bold' }}>
                    {user?.firstName || 'Profile'}
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                <View style={styles.scrollContent}>
                    <Image
                        source={{ uri: user?.imageUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <Text style={styles.userBio}>
                        this is an example bio of the user
                    </Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#363636ff', marginTop: 30, width: '100%' }} />
                <View style={styles.scrollContent}>
                    <Text style={{ color: '#808080ff', fontSize: 12, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                        FAVORITES
                    </Text>

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

                <View style={styles.scrollContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Games Finished
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {finishedCount ? finishedCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Games Wishlist
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {wishlistCount ? wishlistCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Games Playing
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {playingCount ? playingCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Reviews
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {reviewsCount ? reviewsCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Lists
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {listsCount ? listsCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Likes
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {listsCount ? listsCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Following
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {listsCount ? listsCount : 0}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ color: '#c6c6c6ff', fontSize: 15, textAlign: 'left', width: '100%', marginTop: 10, letterSpacing: 1 }}>
                            Followers
                        </Text>
                        <Text style={{ color: '#717171ff', fontSize: 15, textAlign: 'right' }}>
                            {listsCount ? listsCount : 0}
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