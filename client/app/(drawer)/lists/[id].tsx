import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Id } from "@/convex/_generated/dataModel";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';


const ReviewDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const animation = useRef<LottieView>(null);
    const listId: Id<"lists"> = id as Id<"lists">;
    const list = useQuery(api.lists.getListById, { id: listId });
    const [isExpanded, setIsExpanded] = useState(false);

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
        <View style={{ flex: 1, backgroundColor: '#181818' }}>
            <View style={styles.container}>
                {list?.list_game_ids ? (
                    <Image
                        source={{ uri: list.list_game_ids[0].game_cover_url }}
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
            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Image
                        source={{ uri: list.userImageUrl }}
                        style={{ width: 30, height: 30, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#404040' }}
                    />
                    <Text style={styles.reviewText}>
                        {list.name?.length > 25 ? `${list.name.substring(0, 25)}...` : list.name}
                    </Text>
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
                <FlatList
                    data={list.list_game_ids}
                    keyExtractor={(item) => item.game_id.toString()}
                    numColumns={4}
                    contentContainerStyle={styles.mainView}
                    renderItem={({ item: gamePage }) => (
                        <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${gamePage.game_id}`)} key={gamePage.game_id}>
                            <Image
                                source={{ uri: gamePage.game_cover_url }}
                                style={styles.displayImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#181818',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        alignSelf: 'flex-start',
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