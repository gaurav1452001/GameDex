import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
        similar_games: Array<{
            id: number;
            cover: {
                id: number;
                url: string;
            };
        }>;
        videos: Array<{
            id: number;
            video_id: string;
        }>;
    };

    const [playtime, setPlaytime] = useState<Play>();
    const [gamePage, setGamePage] = useState<Game>();
    const [expanded, setExpanded] = useState(false);

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

    const openYouTubeLink = () => {
        const url = `https://www.youtube.com/watch?v=${gamePage?.videos?.[0]?.video_id}`;
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    };

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
            <View style={{ margin: 16 }}>
                <View style={styles.infoContainer}>
                    <View style={{ flex: 2, flexDirection: 'column', marginRight: 10 }}>
                        <View>
                            <Text style={styles.textColor}>
                                {gamePage?.name}
                            </Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.textColor2}>
                                <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                                    {gamePage?.involved_companies && 'by  '}
                                </Text>
                                {gamePage?.involved_companies?.[0]?.company?.name}
                                {gamePage?.involved_companies?.length && gamePage.involved_companies.length > 1 && ', '}
                                {gamePage?.involved_companies?.[1]?.company?.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 50, marginTop: 20, alignItems: 'center' }} >
                            <Text style={styles.textColor2}>
                                {gamePage?.first_release_date
                                    ? new Date(gamePage.first_release_date * 1000).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                    })
                                    : null
                                }
                            </Text>
                            {gamePage?.videos && (
                                <TouchableOpacity onPress={openYouTubeLink}>
                                    <Text style={{ color: 'white', letterSpacing: 2, fontSize: 13 }}>
                                        TRAILER
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        {gamePage.cover?.url ? (
                            <Image
                                source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                                style={styles.displayImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.displayImage}>
                                <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                    {gamePage.name}
                                </Text>
                            </View>
                        )}
                    </View>

                </View>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                        <Text numberOfLines={expanded ? undefined : 3} style={styles.textColor3}>
                            {gamePage?.summary}
                        </Text>
                        <Text style={{ color: 'white',marginTop: 5, fontWeight: '900', justifyContent: 'center', textAlign: 'center' }}>
                            {expanded ? '' : '. . .'}
                        </Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 1, backgroundColor: '#333', marginTop: 20 }} />
                <View style={{ marginTop: 20 }} />
                {gamePage?.similar_games &&
                    (<>
                        <Text style={{ fontSize: 15, color: 'white', marginVertical: 10 }}>
                            SIMILAR GAMES
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {gamePage?.similar_games?.filter(game => game.cover?.url).map((game) => (
                                <TouchableOpacity key={game.id} onPress={() => router.push(`/(drawer)/games/${game.id}`)}>
                                    <Image
                                        source={{ uri: 'https:' + game.cover.url.replace('t_thumb', 't_cover_big_2x') }}
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
    },
    giveMargin: {
        marginVertical: 9,
    },
    textColor2: {
        color: 'beige',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textColor3: {
        color: 'beige',
        fontSize: 13,
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
    },
    displayImage: {
        width: 100, // IGDB t_cover_big_2x is 264x374
        height: 141.66,
        borderWidth: 1,
        borderColor: '#404040',
        backgroundColor: '#404040',
        justifyContent: 'center',
        marginRight: 6,
    }
});
