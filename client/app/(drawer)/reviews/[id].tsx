import { View, Text, ScrollView, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Id } from "@/convex/_generated/dataModel";
import { LinearGradient } from 'expo-linear-gradient';
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';


const ReviewDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const animation = useRef<LottieView>(null);
    const reviewId: Id<"reviews"> = id as Id<"reviews">;
    const review = useQuery(api.reviews.getReviewById, { id: reviewId });

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
                            
                                <Image
                                    source={{ uri: review.imageUrl }}
                                    style={{ width: 35, height: 35, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#404040' }}
                                />
                            <Text style={styles.reviewText}>
                                {review.name}
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
            <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20 }}>
                <Ionicons name="arrow-back" size={24} color="#ffffffff" />
            </TouchableOpacity>
        </View>
    )
}

export default ReviewDetailScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        justifyContent: 'center'
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
    hLine:{
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
    },
    reviewDate: {
        color: '#7a7a7aff',
        fontSize: 11,
        letterSpacing: 0.6,
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