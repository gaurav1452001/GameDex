import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from "react";
import LottieView from 'lottie-react-native';

import axios from "axios";


export default function GameInfo() {
    const animation = useRef<LottieView>(null);
    const { id } = useLocalSearchParams();
    type Play = {
        completely: number;
        game_id: number;
        hastily: number;
        normally: number;
    }

    type Game = {
        id: number;
        cover: {
            id: number;
            url: string;
        };
        name: string;
        rating: number;
        screenshots: Array<{
            id: number;
            url: string;
        }>;
        involved_companies: Array<{
            id: number;
            company: {
                id: number;
                name: string;
            };
        }>;
        first_release_date: number;
        summary: string;
    };

    const [playtime, setPlaytime] = useState<Play>();
    const [gamePage, setGamePage] = useState<Game>();

    useEffect(() => {
        const fetchPlaytime = async () => {
            setGamePage(undefined); // Clear previous game data
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/search/${id}`);
                console.log('Playtime data:', response.data);
                setGamePage(response.data);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchPlaytime();
    }, [id]);

    const hasScreenshot = gamePage?.screenshots && gamePage.screenshots[0]?.url;

    if (!gamePage) {
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
                    source={hasScreenshot
                        ? { uri: 'https:' + gamePage.screenshots[0].url.replace('t_thumb', 't_1080p_2x') }
                        : require('../../../assets/images/login_screen_image.png')
                    }
                    style={{
                        width: '100%',
                        height: 200,
                        borderColor: 'gray',
                    }}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#181818']} // Replace #ffffff with your background color
                    style={styles.gradient}
                />
            </View>
            <View style={styles.infoContainer}>
                <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-between', paddingRight: 10 }}>
                    <View>
                        <Text style={styles.textColor}>
                            {gamePage?.name}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.textColor2}>
                            {gamePage?.involved_companies?.[0]?.company?.name}
                            {gamePage?.involved_companies?.length && gamePage.involved_companies.length > 1 && ', '}
                            {gamePage?.involved_companies?.[1]?.company?.name}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.textColor2}>
                            {gamePage?.first_release_date
                                ? new Date(gamePage.first_release_date * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : null
                            }
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Image
                        source={{ uri: 'https:' + gamePage?.cover?.url?.replace('t_thumb', 't_cover_big_2x') }}
                        style={styles.displayImage}
                        resizeMode="cover"
                    />
                </View>

            </View>
            <Text numberOfLines={3} style={styles.textColor3}>
                {gamePage?.summary}
            </Text>
            <View style={{ margin: 16 }}>
                <Text style={styles.textColor2}>
                    {playtime?.normally ? `${(playtime.normally / 3600).toFixed(0)} hours` : ''}
                </Text>
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
    },
    textColor2: {
        color: 'beige',
        fontSize: 15,
        fontWeight: 'bold',
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
        flexDirection: 'row',
        color: 'white',
        justifyContent: 'space-between',
        margin: 16,
    },
    displayImage: {
        width: 110,
        height: 149.6,
        borderWidth: 1,
        borderColor: 'gray',
    }
});