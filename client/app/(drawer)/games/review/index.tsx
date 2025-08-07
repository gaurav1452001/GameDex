import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, BackHandler, Modal, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import { useNavigation } from '@react-navigation/native'
import StarRating from 'react-native-star-rating-widget'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

const { height: screenHeight } = Dimensions.get('window');

const Review = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const createReview = useMutation(api.reviews.createReview)
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    const [reviewText, setReviewText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    console.log('Current route:', navigation.getState());
    useEffect(() => {
        const handleBackPress = () => {
            if (reviewText || rating > 0 || liked) {
                setModalVisible(true);
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            backHandler.remove();
        };
    }, [reviewText, rating, liked]);

    const reviewData = {
        externalId: user?.id || '',
        name: user?.firstName || '',
        imageUrl: user?.imageUrl || undefined,
        gameId: gamePage?.id?.toString() || '',
        gameName: gamePage?.name || '',
        gameCover: gamePage?.cover?.url ? 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_cover_big_2x') : '',
        starRating: rating,
        isLiked: liked,
        reviewText: reviewText,
        screenshots: gamePage?.screenshots ? 'https:' + gamePage?.screenshots[0]?.url.replace('t_thumb', 't_screenshot_huge') : '',
        reviewDate: new Date().toISOString(),
        gameYear: gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear().toString() : '',
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
                
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'column', marginBottom: 25 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 23, fontWeight: '900', paddingHorizontal: 20, marginBottom: 10 }}>
                                Discard changes
                            </Text>
                            <Text style={{ color: 'beige', textAlign: 'center', fontSize: 17, paddingHorizontal: 40 }}>
                                Are you sure? Changes will be lost.
                            </Text>
                        </View>
                        <View style={styles.modalTextContainer}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSignOut}
                                onPress={() => {
                                    setReviewText('');
                                    setRating(0);
                                    setLiked(false);
                                    setModalVisible(!modalVisible);
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.textStyle}>Discard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity onPress={() => createReview(reviewData)}>
                    <Text style={{ color: '#61d76fff', fontSize: 16, marginBottom: 10 }}>
                        Submit Review
                    </Text>
                </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => setLiked(!liked)}>
                        <Ionicons name={liked ? "heart" : "heart-outline"} size={50} color={liked ? "#d98138ff" : "#a0a0a0ff"} />
                    </TouchableOpacity>
                </View>
                <View style={styles.hLine} />
                <View style={styles.reviewSection}>
                    <TextInput
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
                        maxLength={1000}
                        scrollEnabled={true}
                        textAlignVertical="top"
                        spellCheck={false}
                        autoCorrect={false}
                    />
                    <Text style={styles.characterCount}>
                        {reviewText.length}/1000
                    </Text>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
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
        maxHeight: screenHeight * 0.4,
    },
    reviewInput: {
        backgroundColor: '#2a2a2aff',
        color: 'white',
        paddingHorizontal: 15,
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(3, 3, 3, 0.65)",
    },
    drawerText: {
        color: "#9f9f9fff",
    },
    modalView: {
        marginHorizontal: 30,
        paddingTop: 20,
        backgroundColor: "#343434ff",
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
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
        fontSize: 16,
        marginBottom: 3,
    },
    modalText: {
        marginBottom: 25,
        color: "white",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
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
        backgroundColor: "#7766bdff",
        color: "#fff",
        fontSize: 25,
        padding: 10,
        fontWeight: "bold",
        width: "50%",
    },
});