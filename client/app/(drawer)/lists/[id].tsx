import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Authenticated, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Id } from "@/convex/_generated/dataModel";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useUser } from '@clerk/clerk-expo';
import { ScrollView } from 'react-native-gesture-handler';


const ListScreen = () => {
    const { user } = useUser();
    const { id } = useLocalSearchParams();
    const animation = useRef<LottieView>(null);
    const listId: Id<"lists"> = id as Id<"lists">;
    const list = useQuery(api.lists.getListById, { id: listId });
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const likeList = useMutation(api.likesLists.addLike);
    const unlikeList = useMutation(api.likesLists.removeLike);
    const getLikesByList = useQuery(api.likesLists.getLikesByList, { listId });
    const loggedInUser = useQuery(
        api.users.getUserByExternalId,
        user?.id ? { externalId: user.id } : "skip"
    );

    const likeStatusList = useQuery(
        api.likesLists.hasUserLikedList,
        user && loggedInUser?._id
            ? {
                userId: loggedInUser._id as Id<'users'>,
                listId: listId
            }
            : "skip"
    );

    useEffect(() => {
        setIsExpanded(false);
    }, [id]);

    if (!list) {
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
        <ScrollView style={{ flex: 1, backgroundColor: '#181818' }}>

            <View style={styles.container}>
                {list?.list_game_ids && list.list_game_ids[0] && list.list_game_ids[0].game_screenshots && list.list_game_ids[0].game_screenshots.length > 0 ? (
                    <Image
                        source={{
                            uri: 'https:' + list.list_game_ids[0].game_screenshots[0]?.replace('t_thumb', 't_1080p_2x')
                        }}
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
                    colors={['transparent', '#181818']}
                    style={styles.gradient}
                />
            </View>
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <TouchableOpacity onPress={() => router.push({
                            pathname: `/(drawer)/user_profile`,
                            params: {
                                externalId: list.externalId as string
                            }
                        })}>
                            <Image
                                source={{ uri: list.userImageUrl }}
                                style={{ width: 30, height: 30, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#404040' }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.reviewText}>
                            {list.name?.length > 25 ? `${list.name.substring(0, 25)}...` : list.name}
                        </Text>
                    </View>
                    <Authenticated>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 5, marginTop: 5 }}>
                            <TouchableOpacity
                                onPress={async () => {
                                    if (isLiking) return;
                                    setIsLiking(true);
                                    if (likeStatusList) {
                                        await unlikeList({ userId: loggedInUser?._id as Id<'users'>, listId });
                                    } else {
                                        await likeList({ userId: loggedInUser?._id as Id<'users'>, listId });
                                    }
                                    setTimeout(() => setIsLiking(false), 800);
                                }}
                            >
                                <Ionicons
                                    name={likeStatusList ? "heart" : "heart-outline"}
                                    size={20}
                                    color={likeStatusList ? "#d98138ff" : "#7a7a7aff"}
                                />
                            </TouchableOpacity>
                            {
                                likeStatusList ? (
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
                                {getLikesByList?.length || 0} Likes
                            </Text>
                        </View>
                    </Authenticated>
                </View>
                <View style={{ flexDirection: 'column', gap: 12 }}>
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
                        {list.listName}
                    </Text>
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={{ color: '#7a7a7aff', fontSize: 14, fontWeight: '500', lineHeight: 20 }} numberOfLines={isExpanded ? undefined : 3}>
                            {list.listDesc}
                        </Text>
                        <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                            {isExpanded ? '' : <Ionicons name="ellipsis-horizontal" color={'#d6d6d6ff'} size={23} />}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.view}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {list.list_game_ids?.map((gamePage) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/(drawer)/games/${gamePage.game_id}`)}
                            key={gamePage.game_id}
                        >
                            {gamePage.game_cover_url ? (
                                <Image
                                    source={{ uri: 'https:' + gamePage.game_cover_url.replace('t_thumb', 't_cover_big_2x') }}
                                    style={styles.displayImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.displayImage}>
                                    <Text style={{ color: '#f0f0f0', fontSize: 10, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }}>
                                        {gamePage.game_name}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.hLine} />
        </ScrollView>
    )
}

export default ListScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        justifyContent: 'center'
    },
    view: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#181818',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        alignSelf: 'flex-start',
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
    buttonSignOut: {
        backgroundColor: "#d9902bff",
        color: "#fff",
        fontSize: 25,
        padding: 10,
        fontWeight: "bold",
        width: "50%",
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
    modalTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 1,
        borderColor: "#2c2c2cff",
    },
    expandButtonText: {
        color: '#61d76fff',
        fontSize: 13,
        fontWeight: '600',
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
    mainView: {
        flex: 1,
        backgroundColor: '#181818',
        justifyContent: 'center',
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
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '20%',
        width: '100%',
    },
    displayImage: {
        width: 85,
        height: 126.6,
        margin: 2.4,
        marginTop: 10,
        borderWidth: 0.4,
        borderColor: 'gray',
        justifyContent: 'center',
        backgroundColor: '#404040',
    },
    displayText: {
        color: '#f0f0f0',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center'
    },
});