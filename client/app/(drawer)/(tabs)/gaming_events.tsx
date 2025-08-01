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
        event_logo: {
            image_id: string;
        };
        start_time: number;
    }

    const [events, setEvents] = useState<Event[]>();

    useEffect(() => {
        const fetchEvents = async () => {
            setEvents(undefined); // Clear previous game data
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/events`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchEvents();
    }, []);


    return (
        <ScrollView style={{ backgroundColor: '#181818', gap: 8 }} showsVerticalScrollIndicator={false}>
            {events ? (
                events?.map((event) => (
                    <TouchableOpacity onPress={() => router.push(`/events/${event.id}`)} key={event.id}>
                        <View style={{ margin: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#303030ff' }}>
                            {event.event_logo?.image_id ? (
                                <Image
                                    source={{
                                        uri: 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/' + event.event_logo.image_id + '.jpg'
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
                                        {event.name}
                                    </Text>
                                </View>
                            )}
                            <View style={{ paddingVertical: 13, paddingHorizontal: 10, gap: 6 }}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{event.name}</Text>
                                <Text numberOfLines={2} style={{ color: '#aaa', fontSize: 12, }}>
                                    {event.description}
                                </Text>
                            </View>
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
                        source={require('../../../assets/animations/marioloading.json')}
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