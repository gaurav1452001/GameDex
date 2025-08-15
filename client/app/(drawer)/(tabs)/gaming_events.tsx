import axios from "axios";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState, useRef, use } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { eventScreenType } from "@/types/eventTypes";

export default function GamingEvents() {
    const animation = useRef<LottieView>(null);
    const [Offset, setOffset] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<eventScreenType[]>();

    const fetchEvents = async () => {
        if (isLoading) return; // Prevent multiple calls
        setIsLoading(true);
        try {
            const backend_url = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
            const response = await axios.get(`https://${backend_url}/posts/events`, {
                params: {
                    currentOffset: Offset,
                },
            });
            const newEvents = response.data;

            // Check if we reached the end
            if (!newEvents || newEvents.length === 0 || newEvents.length < 1) {
                setHasMoreData(false);
            }

            setEvents((events) => [...events||[], ...newEvents]);
        } catch (error) {
            console.error('Error fetching playtime:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchEvents();
    }, [Offset]);

    const loadMoreEvents = () => {
        if (hasMoreData && !isLoading) {
            // setIsLoading(true);
            setOffset(Offset + 10);
        }
    };

    const renderLoader = () => {
        // if (!isLoading || !hasMoreData) return null;
        return (
            <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <ActivityIndicator size="large" color="#4692d0ff" />
            </View>
        )
    }

    const renderEndMessage = () => {
        if (hasMoreData || events?.length === 0) return null;
        return (
            <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                <Text style={{ color: '#61d76fff', fontSize: 16 }}>You reached the end!</Text>
            </View>
        );
    };

    const renderEventItem = ({ item }: { item: eventScreenType }) => (
        <TouchableOpacity onPress={() => router.push(`/events/${item.id}`)}>
            <View style={{ margin: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#303030ff' }}>
                {item.event_logo?.image_id ? (
                    <Image
                        source={{
                            uri: 'https://images.igdb.com/igdb/image/upload/t_1080p_2x/' + item?.event_logo?.image_id + '.jpg'
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
                            {item?.name}
                        </Text>
                    </View>
                )}
                <View style={{ paddingVertical: 13, paddingHorizontal: 15, gap: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 }}>{item?.name}</Text>
                    <Text numberOfLines={2} style={{ color: '#aaa', fontSize: 11, letterSpacing: 0.5 }}>
                        {item?.description}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (!events) {
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
        <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            style={{ backgroundColor: '#181818' }}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreEvents}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => (
                <>
                    {renderLoader()}
                    {renderEndMessage()}
                </>
            )}
        />
    );
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#232323',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
});