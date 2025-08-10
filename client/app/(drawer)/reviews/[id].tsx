import { View, Text, ScrollView, Image, StyleSheet, Touchable, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
import { update } from '@/redux/gameData/gameDataSlice';
import { GamePageDataType } from '@/types/gameTypes';
import axios from 'axios';
import { useAppDispatch } from '@/redux/hooks';


const ReviewDetailScreen = () => {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const animation = useRef<LottieView>(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const reviewId: Id<"reviews"> = id as Id<"reviews">;
    const review = useQuery(api.reviews.getReviewById, { id: reviewId });
    const deleteReview = useMutation(api.reviews.deleteReview);
    const { user } = useUser();

    useEffect(() => {
        const fetchGameInfo = async () => {
            if (!review?.gameId) return; // Wait until review is loaded and gameId is available
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/search/${review?.gameId}`);
                console.log('Game Info:', response.data);
                dispatch(update(response.data));
            } catch (error) {
                console.error('Error fetching game info:', error);
            }
        };
        fetchGameInfo();
    }, [review]);


    const checkUser = () => {
        if (user?.id === review?.externalId) {
            return true;
        }
        return false;
    }
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

            <Authenticated>
                {/* delete modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={deleteModalVisible}
                    onRequestClose={() => {
                        setDeleteModalVisible(!deleteModalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 }}>
                                Delete Review
                            </Text>
                            <Text style={styles.modalText}>
                                Are you sure you want to delete this review?
                            </Text>
                            <View style={styles.modalTextContainer}>
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => setDeleteModalVisible(!deleteModalVisible)}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonSignOut}
                                    onPress={() => {
                                        deleteReview({ reviewId, externalId: user?.id as string });
                                        setDeleteModalVisible(!deleteModalVisible);
                                        router.back();
                                    }}
                                >
                                    <Text style={styles.textStyle}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* option to delete and edit the review */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={reviewModalVisible}
                    onRequestClose={() => {
                        setReviewModalVisible(false);
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#222', paddingHorizontal: 24, paddingVertical: 13, width: '100%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                    <Text style={{ flex: 6, color: '#fff', fontSize: 16, letterSpacing: 0.5, marginBottom: 10 }}>
                                        {review.gameName}
                                    </Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => setReviewModalVisible(false)} >
                                            <Ionicons name="close" size={24} color="#aaa" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {review.gameYear && (
                                    <Text style={{ color: '#aaa', letterSpacing: 0.5, fontSize: 14, marginBottom: 15, borderBottomColor: '#404040' }}>
                                        Reviewed on {formatDate(review.reviewDate)}
                                    </Text>
                                )}
                                <View style={{ height: 1, backgroundColor: '#404040', marginBottom: 12, marginHorizontal: -24 }} />
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 12,
                                        marginBottom: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 20,
                                    }}
                                    onPress={() => {
                                        setReviewModalVisible(false);
                                        setDeleteModalVisible(true);
                                    }}
                                >
                                    <Ionicons name="trash" size={20} color="#e17b50ff" />
                                    <Text style={{ fontSize: 16, color: '#e17b50ff' }}>Delete Review</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 12,
                                        marginBottom: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 20,
                                    }}
                                    onPress={() => {
                                        setReviewModalVisible(false);
                                        router.push({
                                            pathname: `/(drawer)/games/review/reviewEdit`,
                                            params: {
                                                reviewId: review?._id,
                                            }
                                        });
                                    }}
                                >
                                    <Ionicons name="create" size={20} color="#aaa" />
                                    <Text style={{ fontSize: 16, color: '#aaa' }}>Edit Review</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Authenticated>
            <Authenticated>
                {checkUser() ? (
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                                {((review?.name).slice(0, 15))}'s Review
                            </Text>
                        </View>
                        <TouchableOpacity style={{ paddingHorizontal: 8, borderColor: '#aaa' }} onPress={() => {
                            setReviewModalVisible(true);
                        }}>
                            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>) : (
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                                {((review?.name).slice(0, 15))}'s Review
                            </Text>
                        </View>
                    </View>
                )}
            </Authenticated>
            <View>

            </View>
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
                            <Image
                                source={{ uri: review.imageUrl }}
                                style={{ width: 35, height: 35, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#404040' }}
                            />
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
                <View style={{ marginHorizontal: 16 }}>
                    <Text style={styles.reviewTextDesc}>
                        {review.reviewText}
                    </Text>
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

function dispatch(arg0: { payload: GamePageDataType; type: "gameData/update"; }) {
    throw new Error('Function not implemented.');
}
