import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from "react";
import LottieView from 'lottie-react-native';

import axios from "axios";


export default function EventInfo() {
    const animation = useRef<LottieView>(null);
    const { id } = useLocalSearchParams();

    type Event = {
        id: number;
        name: string;
        description: string;
        slug: string;
        event_logo: {
            image_id: string;
        };
        start_time: number;
        end_time: number;
        live_stream_url: string;
        games: Array<{
            id: number;
            cover: {
                id: number;
                image_id: string;
            };
        }>;
        videos: number[];
        created_at: number;
        updated_at: number;
    }

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
                <Image
                    source={{
                        uri: 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/' + eventPage.event_logo.image_id + '.jpg'
                    }}
                    style={{
                        width: '100%',
                        height: 200,
                        borderColor: 'gray',
                        borderWidth: 1,
                    }}
                    resizeMode="contain"

                />
                <LinearGradient
                    colors={['transparent', '#181818']} // Replace #ffffff with your background color
                    style={styles.gradient}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.textColor}>{eventPage.name}</Text>
                <Text style={styles.textColor2}>{eventPage.description}</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.timeContainer}>
                    <Text style={styles.textColor3}>Start Time</Text>
                    <Text style={styles.textColor2}>{new Date(eventPage.start_time * 1000).toLocaleString()}</Text>
                </View>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.textColor3}>End Time</Text>
                <Text style={styles.textColor2}>{new Date(eventPage.end_time * 1000).toLocaleString()}</Text>
            </View>

            {eventPage?.live_stream_url && (
                <TouchableOpacity
                    style={styles.streamButton}
                    onPress={() => Linking.openURL(eventPage.live_stream_url)}
                >
                    <Text style={styles.streamButtonText}>Watch Live Stream</Text>
                </TouchableOpacity>
            )}
            <View>
                {eventPage?.games &&
                    (<>
                        <Text style={{ fontSize: 15, color: 'white', margin: 16 }}>
                            GAMES ANNOUNCED
                        </Text>
                        <ScrollView style={{ marginHorizontal: 16 }} horizontal showsHorizontalScrollIndicator={false}>
                            {eventPage?.games?.map((game) => (
                                <TouchableOpacity key={game.id} onPress={() => router.push(`/games/${game.id}`)}>
                                    <Image
                                        source={{ uri: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/' + game.cover.image_id + '.jpg' }}
                                        style={styles.displayImage}
                                        resizeMode="cover" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                    )}
            </View>

            <View style={styles.metaContainer}>
                <Text style={styles.textColor3}>Created: {new Date(eventPage.created_at * 1000).toLocaleDateString()}</Text>
                <Text style={styles.textColor3}>Updated: {new Date(eventPage.updated_at * 1000).toLocaleDateString()}</Text>
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
        fontWeight: 'bold',
    },
    textColor2: {
        color: 'beige',
        fontSize: 15,
        marginVertical: 16
    },
    textColor3: {
        color: 'beige',
        fontSize: 13,
        margin: 16
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
    },
    timeContainer: {
        marginVertical: 8,
    },
    streamButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    streamButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    metaContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
});
