import { View, Image, Text, TouchableOpacity, Platform, Keyboard, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import StarRating from 'react-native-star-rating-widget'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const { height: screenHeight } = Dimensions.get('window');

const Review = () => {
    const [rating, setRating] = useState(0);
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    const [reviewText, setReviewText] = useState('');
    const inputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Use react-native-reanimated for keyboard handling
    const keyboardHeight = useSharedValue(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
                
                // Scroll to keep TextInput visible
                setTimeout(() => {
                    inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
                        const inputBottom = pageY + height;
                        const keyboardTop = screenHeight - e.endCoordinates.height;
                        
                        if (inputBottom > keyboardTop) {
                            const scrollOffset = inputBottom - keyboardTop + 50; // Extra padding
                            scrollViewRef.current?.scrollTo({
                                y: scrollOffset,
                                animated: true,
                            });
                        }
                    });
                }, 100);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                keyboardHeight.value = withTiming(0, { duration: 250 });
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const keyboardPadding = useAnimatedStyle(() => {
        return {
            height: keyboardHeight.value,
        };
    });

    const handleTextInputFocus = () => {
        // Additional delay to ensure keyboard is fully shown
        setTimeout(() => {
            inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
                scrollViewRef.current?.scrollTo({
                    y: pageY - 100,
                    animated: true,
                });
            });
        }, 300);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.gameHeader}>
                    <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>
                            {gamePage?.name}
                        </Text>
                        <Text style={styles.gameYear}>
                            {gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear() : ''}
                        </Text>
                    </View>
                    <Image
                        source={{ uri: 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_cover_big_2x') }}
                        style={styles.gameCover}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.hLine} />

                <View style={styles.dateSection}>
                    <Text style={styles.sectionLabel}>
                        Date
                    </Text>
                    <Text style={styles.dateText}>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={styles.hLine} />

                <View style={styles.ratingSection}>
                    <View>
                        <StarRating
                            rating={rating}
                            starStyle={{ marginHorizontal: -3 }}
                            onChange={setRating}
                            starSize={50}
                            enableHalfStar={true}
                            emptyColor="#555555ff"
                            color="#61d76fff"
                        />
                        <Text style={styles.ratedText}>Rated</Text>
                    </View>
                    <View>
                        <Ionicons name="heart-outline" size={50} color="#a0a0a0ff" />
                    </View>
                </View>

                <View style={styles.hLine} />

                <View style={styles.reviewSection}>
                    <TextInput
                        ref={inputRef}
                        style={styles.reviewInput}
                        placeholder="Write your review..."
                        placeholderTextColor="#a0a0a0ff"
                        multiline={true}
                        value={reviewText}
                        onChangeText={(text) => {
                            if (text.length <= 1000) {
                                setReviewText(text);
                            }
                        }}
                        onFocus={handleTextInputFocus}
                        maxLength={1000}
                        scrollEnabled={true}
                        textAlignVertical="top"
                    />
                    <Text style={styles.characterCount}>
                        {reviewText.length}/1000
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default Review

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1eff',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 18,
        paddingBottom: 30,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    gameInfo: {
        flex: 1,
        flexDirection: 'column',
        gap: 6,
        paddingRight: 10,
    },
    gameName: {
        fontSize: 17,
        color: 'white',
    },
    gameYear: {
        fontSize: 14,
        color: '#a0a0a0ff',
    },
    gameCover: {
        width: 35,
        height: 49.58,
        borderWidth: 1,
        borderColor: '#333',
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 17,
    },
    sectionLabel: {
        fontSize: 15,
        color: '#a0a0a0ff',
    },
    dateText: {
        fontSize: 16,
        letterSpacing: 0.5,
        color: '#a0a0a0ff',
    },
    ratingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    ratedText: {
        fontSize: 12,
        color: '#a0a0a0ff',
        textAlign: 'left',
        paddingLeft: 5,
    },
    reviewSection: {
        marginTop: 10,
        minHeight: 150,
    },
    reviewInput: {
        backgroundColor: '#2a2a2aff',
        color: 'white',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        minHeight: 120,
        maxHeight: 200,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#444',
    },
    characterCount: {
        fontSize: 12,
        color: '#a0a0a0ff',
        textAlign: 'right',
        marginTop: 5,
    },
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 5,
        marginHorizontal: -18,
    },
});