import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearLogger } from '@/redux/gameLogger/gameLoggerSlice';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { api } from "../convex/_generated/api";
import { ScrollView } from 'react-native-gesture-handler';



const LoggerModal = ({ setModalVisible }: any) => {
    const dispatch = useAppDispatch();
    const [listAdder, setListAdder] = useState(false);
    const loggerVisible = useAppSelector((state) => state.gamePageLogger.data);
    const gamePage = useAppSelector((state) => state.gamePageData.data);
    const [isRating, setIsRating] = useState(false);
    const [rating, setRating] = useState(0);
    const { user } = useUser();
    const [isChanging, setIsChanging] = useState(false);
    const [addingToList, setAddingToList] = useState(false);
    const user_game_tracker = useQuery(api.user_game_tracks.getGameStatus, {
        externalId: user?.id as string,
        game_id: gamePage?.id.toString() as string
    });
    const AllLists = useQuery(api.lists.getListByUserId,{ externalId: user?.id as string });
    const addToList = useMutation(api.lists.addGameToList);
    const updateRating = useMutation(api.reviews.upsertLatestReviewByUserAndGame);
    const finishedPlaying = useMutation(api.user_game_tracks.addToFinishedPlaying);
    const currentlyPlaying = useMutation(api.user_game_tracks.addToCurrentlyPlaying);
    const wantToPlay = useMutation(api.user_game_tracks.addToWantToPlay);
    const removeGameFromTrack = useMutation(api.user_game_tracks.removeGameFromTracking);

    const latestReview = useQuery(api.reviews.getLatestReviewByUserAndGame, {
        externalId: user?.id || '',
        gameId: gamePage?.id?.toString() || ''
    });

    useEffect(() => {
        if (latestReview) {
            setRating(latestReview.starRating || 0);
        }
    }, [latestReview]);

    const handleCurrentUser = {
        externalId: user?.id as string,
        game_id: gamePage?.id.toString() as string,
        game_cover_url: gamePage?.cover?.url as string
    }

    const handleRemoveTracking = {
        externalId: user?.id as string,
        game_id: gamePage?.id.toString() as string,
    }

    const handleShowPoster = () => {
        dispatch(clearLogger());
        setModalVisible(true);
    };

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={listAdder}
                onRequestClose={() => setListAdder(false)}
            >
                <View style={styles.modalContainer2}>
                    <View style={{ height: '50%', width: '90%', backgroundColor: '#181818ff', borderRadius: 10, padding: 16 }}>
                        <ScrollView style={{ flex: 1 }}>
                            {AllLists?.length ? (
                                AllLists.map((list) => (
                                    <TouchableOpacity
                                        key={list?._id}
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: 0.5,
                                            borderBottomColor: '#333',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onPress={
                                            async () => {
                                                if (addingToList) {
                                                    return;
                                                }
                                                setAddingToList(true);
                                                await addToList({
                                                    listId: list._id,
                                                    externalId: user?.id as string,
                                                    game_id: gamePage?.id?.toString() as string,
                                                    game_name: gamePage?.name as string,
                                                    game_cover_url: gamePage?.cover?.url as string,
                                                    game_screenshots: gamePage?.screenshots?.map((s: any) => s.url) as string[],
                                                });
                                                setListAdder(false);
                                                setTimeout(() => {
                                                    setAddingToList(false);
                                                }, 800);
                                            }}
                                    >
                                        <Text style={styles.modalText}>{list?.listName}</Text>
                                        <Ionicons name="add-circle-outline" size={22} color="#61d76fff" />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.modalText}>No lists found.</Text>
                            )}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setListAdder(false)} style={{ marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#61d76fff', fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={loggerVisible}
                onRequestClose={() => {
                    dispatch(clearLogger());
                }}>
                <View style={styles.modalContainer} >
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'column', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.modalTextName}>{gamePage?.name}</Text>
                                <TouchableOpacity style={{ backgroundColor: '#7d7d7dff', borderRadius: 50 }} onPress={() => dispatch(clearLogger())}>
                                    <Ionicons name="close-outline" size={24} color="#262626ff" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.modalText}>{gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear() : ''}</Text>
                        </View>
                        <View style={styles.hLine} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>

                            {user_game_tracker === 'finishedPlaying' ? (
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    removeGameFromTrack(handleRemoveTracking);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="checkmark-circle" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>Finished</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    finishedPlaying(handleCurrentUser);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="checkmark-circle" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Finish</Text>
                                </TouchableOpacity>
                            }

                            {user_game_tracker === 'currentlyPlaying' ? (
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    removeGameFromTrack(handleRemoveTracking);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="game-controller" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>Playing</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    currentlyPlaying(handleCurrentUser);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="game-controller" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Play</Text>
                                </TouchableOpacity>
                            }


                            {user_game_tracker === 'wantToPlay' ? (
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    removeGameFromTrack(handleRemoveTracking);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="time" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>In Wishlist</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => {
                                    if (isChanging) {
                                        return;
                                    }
                                    setIsChanging(true);
                                    wantToPlay(handleCurrentUser);
                                    setTimeout(() => {
                                        setIsChanging(false);
                                    }, 1000);
                                }}>
                                    <Ionicons name="time" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Wishlist</Text>
                                </TouchableOpacity>
                            }

                        </View>
                        <View style={styles.hLine} />
                        <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                            <StarRating
                                rating={rating}
                                starStyle={{ marginHorizontal: -2 }}
                                onChange={setRating}
                                starSize={55}
                                onRatingEnd={(rating) => {
                                    console.log("Rating ended with value: ", rating);
                                }}
                                enableHalfStar={true}
                                emptyColor="#555555ff"
                                color="#61d76fff"
                            />
                            <TouchableOpacity onPress={() => {
                                if (isRating || rating === 0) {
                                    return;
                                }
                                setIsRating(true);
                                updateRating({
                                    externalId: user?.id || '',
                                    name: user?.firstName || '',
                                    imageUrl: user?.imageUrl || undefined,
                                    gameId: gamePage?.id?.toString() || '',
                                    gameName: gamePage?.name || '',
                                    gameCover: gamePage?.cover?.url ? 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_cover_big_2x') : '',
                                    starRating: rating,
                                    isLiked: false,
                                    reviewText: '',
                                    screenshots: gamePage?.screenshots ? 'https:' + gamePage?.screenshots[0]?.url.replace('t_thumb', 't_screenshot_huge') : '',
                                    reviewDate: new Date().toISOString(),
                                    gameYear: gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear().toString() : '',
                                });
                                if (user_game_tracker !== 'finishedPlaying') {
                                    finishedPlaying(handleCurrentUser);
                                }
                                setTimeout(() => {
                                    setIsRating(false);
                                }, 800);
                            }}>
                                <Text style={{
                                    color: latestReview ? '#61d76fff' : '#616161ff',
                                    fontSize: 12,
                                    marginTop: 10,
                                    borderColor: latestReview ? '#61d76fff' : '#616161ff',
                                    borderWidth: 1,
                                    paddingVertical: 2,
                                    paddingHorizontal: 8,
                                    borderRadius: 5
                                }}>
                                    {latestReview ? 'Update Rating' : 'Rate'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hLine} />
                        <View style={{ flexDirection: 'column', paddingVertical: 10, gap: 30 }}>
                            <TouchableOpacity style={styles.lister} onPress={() => { dispatch(clearLogger()); router.push(`/games/review/reviewScreen`); }}>
                                <Ionicons name="create-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText}>Review or log</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.lister}
                                onPress={() => {
                                    setListAdder(true);
                                }}
                            >
                                <Ionicons name="list-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText} >Add to Lists</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.lister} onPress={handleShowPoster}>
                                <Ionicons name="share-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText}>Show Poster</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default LoggerModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },

    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    lister: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingTop: 10,
    },
    centerItems: {
        alignItems: 'center',
    },
    hLine: {
        height: 0.7,
        backgroundColor: '#5f5f5fff',
        marginHorizontal: -16
    },
    modalContent: {
        width: '100%',
        height: '75%',
        paddingHorizontal: 16,
        backgroundColor: '#181818ff',
    },

    modalText: {
        color: '#bababaff',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    modalTextName: {
        color: '#ffffffff',
        fontSize: 16,
        marginBottom: 10,
    },

})