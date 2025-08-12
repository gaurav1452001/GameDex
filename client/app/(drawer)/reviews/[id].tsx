import { View, Text, ScrollView, Image, StyleSheet, Touchable, TouchableOpacity, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Id } from "@/convex/_generated/dataModel";
import { LinearGradient } from 'expo-linear-gradient';
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Authenticated } from 'convex/react';
import { useUser } from '@clerk/clerk-expo';


const ReviewDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const animation = useRef<LottieView>(null);
    const [isLiking, setIsLiking] = useState(false);
    const reviewId: Id<"reviews"> = id as Id<"reviews">;
    const review = useQuery(api.reviews.getReviewById, { id: reviewId });
    const likeReview = useMutation(api.likesReviews.addLikeReview);
    const unlikeReview = useMutation(api.likesReviews.removeLikeReview);
    const getLikesByReview = useQuery(api.likesReviews.getLikesByReview, { reviewId });
    const { user } = useUser();

    const loggedInUser = useQuery(
        api.users.getUserByExternalId,
        user?.id ? { externalId: user.id } : "skip"
    );

    const likeStatus = useQuery(
        api.likesReviews.hasUserLikedReview,
        user && loggedInUser?._id
            ? {
                userId: loggedInUser._id as Id<'users'>,
                reviewId: reviewId
            }
            : "skip"
    );


    //when the user goes to the individual review page, the below useEffect will dispatch the game data to the redux store
    //this is done so that the game data is available in the redux store and can be used to easily update the game data in the review page
    //the edit page was giving bugs therefore this is done, would remove later if fixed
    

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!review) {
        return (
            <View style={styles.loadingContainer}>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#181818',
                    }}
                    source={require('@/assets/animations/batman.json')}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#181818' }}>
                <View style={styles.container}>
                    {review?.screenshots ? (
                        <Image
                            source={{ uri: review.screenshots }}
                            style={{
                                width: '100%',
                                height: 200,
                                borderColor: 'gray',
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../../../assets/images/login_screen_image.png')}
                            style={{
                                width: '100%',
                                height: 200,
                                borderColor: 'gray',
                            }}
                            resizeMode="cover"
                        />
                    )}
                    <LinearGradient
                        colors={['transparent', '#181818']} // Replace #ffffff with your background color
                        style={styles.gradient}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 16 }}>
                    <View style={styles.reviewInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8 }}>
                            <TouchableOpacity onPress={() => {
                                router.push({
                                    pathname: `/(drawer)/user_profile`,
                                    params: {
                                        externalId: review.externalId as string
                                    }
                                }
                                )
                            }}>
                                <Image
                                    source={{ uri: review.imageUrl }}
                                    style={{ width: 35, height: 35, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#404040' }}
                                />
                            </TouchableOpacity>
                            <Text style={styles.reviewText}>
                                {review.name?.length > 25 ? `${review.name.substring(0, 25)}...` : review.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', gap: 12 }}>
                            <Text style={styles.reviewTextName}>
                                {review.gameName}
                                <Text style={styles.reviewGameDate}>
                                    {review.gameYear ? `  ${review.gameYear}` : ''}
                                </Text>
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <StarRatingDisplay
                                    rating={review.starRating}
                                    emptyColor="#181818"
                                    color="#61d76fff"
                                    starSize={16}
                                    starStyle={{ marginHorizontal: -0.5 }}
                                />
                                {review.isLiked && (
                                    <Ionicons
                                        name="heart"
                                        size={16}
                                        color="#d98138ff"
                                        style={{ marginLeft: 10 }}
                                    />
                                )}
                            </View>
                            <Text style={[styles.reviewDate, { marginRight: 3 }]}>
                                Finished {formatDate(review.reviewDate)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        router.push(`/(drawer)/games/${review.gameId}`);
                    }}>
                        {review?.gameCover ? (
                            <Image
                                source={{ uri: review.gameCover }}
                                style={styles.displayImage}
                            />
                        ) : (
                            <View style={styles.displayImage}>
                                <Text style={styles.displayText}>
                                    {review.gameName}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 16, gap: 10 }}>
                    <Text style={styles.reviewTextDesc}>
                        {review.reviewText}
                    </Text>
                    <Authenticated>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                            <TouchableOpacity
                                onPress={async () => {
                                    if (isLiking) return;
                                    setIsLiking(true);
                                    if (likeStatus) {
                                        await unlikeReview({ userId: loggedInUser?._id as Id<'users'>, reviewId });
                                    } else {
                                        await likeReview({ userId: loggedInUser?._id as Id<'users'>, reviewId });
                                    }
                                    setTimeout(() => setIsLiking(false), 800);
                                }}
                            >
                                <Ionicons
                                    name={likeStatus ? "heart" : "heart-outline"}
                                    size={20}
                                    color={likeStatus ? "#d98138ff" : "#7a7a7aff"}
                                />
                            </TouchableOpacity>
                            {
                                likeStatus ? (
                                    <Text style={{ color: '#d98138ff', fontSize: 12, letterSpacing: 0.5 }}>
                                        Liked
                                    </Text>
                                ) : (
                                    <Text style={{ color: '#7a7a7aff', fontSize: 12, letterSpacing: 0.5 }}>
                                        Like?
                                    </Text>
                                )
                            }

                            <Text style={{ color: '#7a7a7aff', fontSize: 12, letterSpacing: 0.5 }}>
                                {getLikesByReview?.length || 0} Likes
                            </Text>
                        </View>
                    </Authenticated>
                </View>
                <View style={styles.hLine} />
            </ScrollView>
        </View>
    )
}

export default ReviewDetailScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(3, 3, 3, 0.65)",
    },
    modalView: {
        marginHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#343434ff",
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonClose: {
        backgroundColor: "#343434ff",
        color: "#fff",
        width: "50%",
        fontSize: 25,
        fontWeight: "bold",
        padding: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15,
    },
    modalText: {
        marginBottom: 20,
        color: "#bebebeff",
        textAlign: "center",
        fontSize: 16,
        letterSpacing: 0.5,
        paddingHorizontal: 20,
    },
    modalTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 1,
        borderColor: "#2c2c2cff",
    },
    buttonSignOut: {
        backgroundColor: "#d9902bff",
        color: "#fff",
        fontSize: 25,
        padding: 10,
        fontWeight: "bold",
        width: "50%",
    },
    displayImage: {
        width: 100,
        height: 141.66,
        borderWidth: 1,
        borderColor: '#404040',
        backgroundColor: '#404040',
        justifyContent: 'center',
        marginRight: 6,
    },
    hLine: {
        height: 1,
        backgroundColor: '#404040',
        marginVertical: 12,
    },
    reviewGameDate: {
        color: '#7a7a7aff',
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    loadingText: {
        color: '#ccc',
        fontSize: 16,
    },
    reviewText: {
        color: '#a0a0a0ff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,

    },
    reviewDate: {
        color: '#7a7a7aff',
        fontSize: 11,
        letterSpacing: 0.6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#181818',
    },
    reviewTextName: {
        color: '#ffffffff',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    reviewTextDesc: {
        color: '#c7c7c7ff',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    reviewInfo: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 16,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '20%',
        width: '100%',
    },
    displayText: {
        color: '#f0f0f0',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center'
    },
});

