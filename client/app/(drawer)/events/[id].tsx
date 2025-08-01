import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from "react";
import LottieView from 'lottie-react-native';
import { eventPageDataType } from '@/types/eventTypes';
import axios from "axios";
import Ionicons from "@expo/vector-icons/build/Ionicons";


export default function EventInfo() {
    const animation = useRef<LottieView>(null);
    const { id } = useLocalSearchParams();

    type Event = eventPageDataType;

    const [eventPage, setEventPage] = useState<Event>();


    useEffect(() => {
        const fetchEvent = async () => {
            setEventPage(undefined); // Clear previous game data
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/searchEvent/${id}`);
                setEventPage(response.data);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchEvent();
    }, [id]);


    if (!eventPage) {
        return (
            <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#181818',
                    }}
                    source={require('../../../assets/animations/loading3.json')}
                />
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: '#181818' }}>
            <View style={styles.container}>
                {eventPage.event_logo?.image_id ? (
                    <Image
                        source={{
                            uri: 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/' + eventPage.event_logo.image_id + '.jpg'
                        }}
                        style={{
                            width: '100%',
                            height: 200,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={{
                        width: '100%',
                        height: 200,
                        backgroundColor: '#404040',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                            {eventPage.name}
                        </Text>
                    </View>
                )}
                {eventPage.event_networks && (
                    <Ionicons style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: '#181818', padding: 5, borderRadius: 5 }} name="link-sharp" color={'#ffffff'} size={25} onPress={() => Linking.openURL(eventPage.event_networks[0].url)} />
                )}
            </View>
            <View style={styles.infoContainer}>
                <View >
                    <Text style={styles.textColor}>{eventPage.name}</Text>
                    <View style={{ height: 1, backgroundColor: '#333', marginVertical: 8 }} />
                    <Text style={styles.textColor2}>{eventPage.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
                    <View style={styles.timeContainer1}>
                        <Text style={styles.textColor3}>Start Time</Text>
                        <Text style={styles.textColor2}>{new Date(eventPage.start_time * 1000).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</Text>
                        <Text style={styles.textColor2}>{eventPage.time_zone ? eventPage.time_zone : ''}</Text>
                    </View>
                    <View style={styles.timeContainer2}>
                        <Text style={styles.textColor3}>End Time</Text>
                        <Text style={styles.textColor2}>{new Date(eventPage.end_time * 1000).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</Text>
                        <Text style={styles.textColor2}>{eventPage.time_zone ? eventPage.time_zone : ''}</Text>
                    </View>
                </View>
            </View>

            {eventPage?.live_stream_url && (
                <TouchableOpacity
                    style={styles.streamButton}
                    onPress={() => Linking.openURL(eventPage.live_stream_url)}
                >
                    <Text style={styles.streamButtonText}>Watch Live Stream</Text>
                </TouchableOpacity>
            )}
            <View style={{ marginBottom: 30 }}>
                {eventPage?.games &&
                    (<>
                        <Text style={{ fontSize: 15, color: 'white', margin: 16, fontWeight: 'bold' }}>
                            GAMES FEATURED
                        </Text>
                        <ScrollView style={{ marginHorizontal: 16 }} horizontal showsHorizontalScrollIndicator={false}>
                            {eventPage?.games?.filter(game => game.cover?.image_id).map((game) => (
                                <TouchableOpacity key={game.id} onPress={() => router.push(`/games/${game.id}`)}>
                                    <Image
                                        source={{ uri: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/' + game.cover.image_id + '.jpg' }}
                                        style={styles.displayImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                    )}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        justifyContent: 'center'
    },
    textColor: {
        color: 'white',
        fontSize: 25,
        fontWeight: '900',
    },
    textColor2: {
        color: 'beige',
        fontSize: 13,
        marginBottom: 4,
        letterSpacing: 0.9,
    },
    textColor3: {
        color: 'beige',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.6,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
    },
    infoContainer: {
        color: 'white',
        margin: 16,
    },
    displayImage: {
        width: 100, // IGDB t_cover_big_2x is 264x374
        height: 141.66,
        marginRight: 6,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#404040',
        justifyContent: 'center',
    },
    timeContainer1: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#3a3a3aff',
        borderRadius: 8,
    },
    timeContainer2: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#3a3a3aff',
        borderRadius: 8,
    },
    streamButton: {
        backgroundColor: '#f95555ff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    streamButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
