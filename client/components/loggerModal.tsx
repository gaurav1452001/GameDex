import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useQuery, useMutation } from 'convex/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearLogger } from '@/redux/gameLogger/gameLoggerSlice';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { api } from "../convex/_generated/api";
import { current } from '@reduxjs/toolkit';



const LoggerModal = ({ setModalVisible }: any) => {
    const dispatch = useAppDispatch();
    const loggerVisible = useAppSelector((state) => state.gamePageLogger.data);
    const gamePage = useAppSelector((state) => state.gamePageData.data);
    const [rating, setRating] = useState(0);
    const { user } = useUser();
    const user_game_tracker = useQuery(api.user_game_tracks.getGameStatus, {
        externalId: user?.id as string,
        game_id: gamePage?.id.toString() as string
    });
    const finishedPlaying = useMutation(api.user_game_tracks.addToFinishedPlaying);
    const currentlyPlaying = useMutation(api.user_game_tracks.addToCurrentlyPlaying);
    const wantToPlay = useMutation(api.user_game_tracks.addToWantToPlay);
    const removeGameFromTrack = useMutation(api.user_game_tracks.removeGameFromTracking);

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
                                <TouchableOpacity style={styles.centerItems} onPress={() => removeGameFromTrack(handleRemoveTracking)}>
                                    <Ionicons name="checkmark-circle" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>Finished</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => finishedPlaying(handleCurrentUser)}>
                                    <Ionicons name="checkmark-circle" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Finish</Text>
                                </TouchableOpacity>
                            }

                            {user_game_tracker === 'currentlyPlaying' ? (
                                <TouchableOpacity style={styles.centerItems} onPress={() => removeGameFromTrack(handleRemoveTracking)}>
                                    <Ionicons name="game-controller" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>Playing</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => currentlyPlaying(handleCurrentUser)}>
                                    <Ionicons name="game-controller" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Play</Text>
                                </TouchableOpacity>
                            }


                            {user_game_tracker === 'wantToPlay' ? (
                                <TouchableOpacity style={styles.centerItems} onPress={() => removeGameFromTrack(handleRemoveTracking)}>
                                    <Ionicons name="time" size={50} color="#61d76fff" />
                                    <Text style={styles.modalText}>In Wishlist</Text>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity style={styles.centerItems} onPress={() => wantToPlay(handleCurrentUser)}>
                                    <Ionicons name="time" size={50} color="#7d7d7dff" />
                                    <Text style={styles.modalText}>Wishlist</Text>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity style={styles.centerItems}>
                                <Ionicons name="heart" size={50} color="#7d7d7dff" />
                                <Text style={styles.modalText}>Like</Text>
                            </TouchableOpacity>


                        </View>
                        <View style={styles.hLine} />
                        <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                            <StarRating
                                rating={rating}
                                starStyle={{ marginHorizontal: -2 }}
                                onChange={setRating}
                                starSize={55}
                                enableHalfStar={true}
                                emptyColor="#555555ff"
                                color="#61d76fff"
                            />
                            <Text style={[styles.modalText, { marginTop: 10 }]}>
                                Rate
                            </Text>
                        </View>
                        <View style={styles.hLine} />
                        <View style={{ flexDirection: 'column', paddingVertical: 10, gap: 30 }}>
                            <TouchableOpacity style={styles.lister} onPress={() => { dispatch(clearLogger()); router.push(`/games/review/reviewScreen`); }}>
                                <Ionicons name="create-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText}>Review or log</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.lister}>
                                <Ionicons name="list-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText} >Add to Lists</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.lister} onPress={handleShowPoster}>
                                <Ionicons name="share-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText}>Show Poster</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.lister}>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color="#bababaff" />
                                <Text style={styles.modalText}>Review or log</Text>
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