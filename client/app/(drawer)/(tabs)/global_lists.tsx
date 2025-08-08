import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { router } from "expo-router";

export default function ReviewsScreen() {
    const animation = useRef<LottieView>(null);
    const lists = useQuery(api.lists.getAllLists);

    if (!lists) {
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


    if (lists.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#bcbcbcff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>
                    No lists available at the moment.
                </Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#181818',
                    }}
                    source={require('@/assets/animations/ghost.json')}
                />
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#181818' }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
        >
            <View>
                <Text style={{ fontSize: 18, color: '#61d76fff', fontWeight: 'bold', marginBottom: 5 }}>
                    Popular Lists
                </Text>
            </View>

            {lists?.map((list) => (
                <View key={list._id} style={{ marginTop: 15 }}>
                    <TouchableOpacity onPress={() => router.push(`/lists/${list._id}`)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                        <Text style={{ color: '#c7c7c7ff', fontSize: 15, fontWeight: 900, flex: 2 }}>
                            {list.listName}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ color: '#828282ff', marginRight: 8, fontSize: 11, fontWeight: 'bold' }} numberOfLines={1}>
                                {list.name?.length > 9 ? `${list.name.substring(0, 9)}...` : list.name}
                            </Text>
                            <Image
                                source={{ uri: list.userImageUrl }}
                                style={{ width: 28, height: 28, borderRadius: 50, borderWidth: 1, borderColor: '#404040' }}
                            />
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={{ marginRight: -16 }} horizontal showsHorizontalScrollIndicator={false}>
                        {list.list_game_ids.map((game, index) => (
                            <TouchableWithoutFeedback key={index} onPress={() => router.push(`/lists/${list._id}`)}>
                                    <Image
                                        source={{ uri: game.game_cover_url }}
                                        style={{ width: 65, height: 98.5 }}
                                        resizeMode="contain"
                                    />
                            </TouchableWithoutFeedback>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={() => router.push(`/lists/${list._id}`)}>
                        <Text style={{ color: '#bababaff', fontSize: 13, marginTop: 5, marginBottom: 10 }} numberOfLines={2}>
                            {list.listDesc}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.hLine} />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 15,
        marginRight: -16
    },
    reviewGameDate: {
        color: '#7a7a7aff',
        fontSize: 11,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    displayText: {
        color: '#f0f0f0',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center'
    },
    displayImage: {
        borderColor: '#535353ff',
        backgroundColor: '#404040',
        justifyContent: 'center',
        width: 80,
        height: 120,
        marginRight: 12,
        borderWidth: 1,
    }
})