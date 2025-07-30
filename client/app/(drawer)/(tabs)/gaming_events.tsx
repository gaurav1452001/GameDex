import axios from "axios";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState, useRef } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, FlatList } from "react-native";
export default function GamingEvents() {
    const animation = useRef<LottieView>(null);

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
        games: number[];
        videos: number[];
        created_at: number;
        updated_at: number;
    }

    const [events, setEvents] = useState<Event[]>();

    useEffect(() => {
        const fetchEvents = async () => {
            setEvents(undefined); // Clear previous game data
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/events`);
                console.log('Playtime data:', response.data);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchEvents();
    }, []);


    return (
        <ScrollView style={{ backgroundColor: '#181818' }} showsVerticalScrollIndicator={false}>

            {events ? (
                events?.map((event) => (
                    <TouchableOpacity onPress={() => router.push(`/events/${event.id}`)} key={event.id}>
                        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' }}>
                            <Image
                                source={{
                                    uri: 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/' + event.event_logo.image_id + '.jpg'
                                }}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                }}
                                resizeMode="contain"

                            />
                            <Text style={{ color: '#fff', fontSize: 18 }}>{event.name}</Text>
                            <Text numberOfLines={3} style={{ color: '#aaa' }}>
                                {event.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 200,
                            height: 200,
                            backgroundColor: '#181818',
                        }}
                        source={require('../../../assets/animations/loading2.json')}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = {
    mainView: {
        backgroundColor: '#232323',
        justifyContent: 'center',
    },
}