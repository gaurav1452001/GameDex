import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { SignedIn, useUser } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import GamePageTopTab from '../../../components/gamePageTopTab';
import { useEffect, useState, useRef } from "react";
import LottieView from 'lottie-react-native';
import axios from "axios";
import Ionicons from "@expo/vector-icons/build/Ionicons";


export default function GameInfo() {
    const animation = useRef<LottieView>(null);
    const { id } = useLocalSearchParams();
    // Define types for Play and Game
    type Play = {
        completely: number;
        game_id: number;
        hastily: number;
        normally: number;
        count: number;
    }
    type Game = {
        id: number;
        cover: {
            id: number;
            url: string;
        };
        name: string;
        keywords: Array<{
            id: number;
            name: string;
        }>;
        rating: number;
        rating_count: number;
        aggregated_rating: number;
        aggregated_rating_count: number;
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
    const { user } = useUser()

    useEffect(() => {
        const fetchGameInfo = async () => {
            setGamePage(undefined); // Clear previous game data
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/search/${id}`);
                const responsePlaytime = await axios.get(`http://${ip_address}:8000/posts/playtime/${id}`);
                console.log('Playtime:', responsePlaytime.data);
                setGamePage(response.data);
                setPlaytime(responsePlaytime.data[0]);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchGameInfo();
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
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                        <Text numberOfLines={expanded ? undefined : 3} style={styles.textColor3}>
                            {gamePage?.summary}
                        </Text>
                        <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                            {expanded ? '' : <Ionicons name="ellipsis-horizontal" color={'#d6d6d6ff'} size={23} />}
                        </Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.hLine} />
                <View style={{ marginTop: 6 }}>
                    <Text style={styles.textColor3}>
                        RATINGS
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Ionicons name="star" color={'#54e868ff'} size={32} />
                                <Text style={{ fontSize: 25, color: 'white' }}>
                                    {gamePage?.aggregated_rating ? (gamePage.aggregated_rating / 10).toFixed(1) : 'N / A'}
                                </Text>
                            </View>
                            <Text style={styles.textColor3}>
                                {gamePage?.aggregated_rating_count ? gamePage.aggregated_rating_count : 'No'} critic ratings
                            </Text>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Ionicons name="star" color={'#54e868ff'} size={32} />
                                <Text style={{ fontSize: 25, color: 'white' }}>
                                    {gamePage?.aggregated_rating ? (gamePage.rating / 10).toFixed(1) : 'N / A'}
                                </Text>
                            </View>
                            <Text style={styles.textColor3}>
                                {gamePage?.aggregated_rating_count ? gamePage.rating_count : 'No'} user ratings
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.hLine} />
                <View>
                    <SignedIn>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 9, backgroundColor: '#3e3e3eff' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image
                                    source={{ uri: user?.imageUrl }}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 40,
                                    }}
                                />
                                <Text style={{ color: '#ffffffff', fontSize: 12, letterSpacing: 0.3 }}>
                                    Rate, log, review or add to list
                                </Text>
                            </View>
                            <View>
                                <Ionicons name="ellipsis-horizontal" color={'#d6d6d6ff'} size={23} />
                            </View>
                        </View>
                    </SignedIn>
                </View>
                <View style={styles.hLine} />
                <View style={{ height: 300 }}>
                    <GamePageTopTab/>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.textColor3}>
                        TIME TO BEAT
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ color: '#d8d8d8ff', fontSize: 12, marginTop: 8 }}>
                                Completely
                            </Text>
                            <View style={styles.playtime}>
                                <Text style={{ color: '#e2e2e2ff', fontSize: 19, fontWeight: 'bold' }}>
                                    {playtime?.completely ? `${Math.round(playtime.completely / 3600)}H` : 'N/A'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ color: '#d8d8d8ff', fontSize: 12, marginTop: 8 }}>
                                Normally
                            </Text>
                            <View style={styles.playtime}>
                                <Text style={{ color: '#c3c3c3ff', fontSize: 19, fontWeight: 'bold' }}>
                                    {playtime?.normally ? `${Math.round(playtime.normally / 3600)}H` : 'N/A'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ color: '#d8d8d8ff', fontSize: 12, marginTop: 8 }}>
                                Hastily
                            </Text>
                            <View style={styles.playtime}>
                                <Text style={{ color: '#c3c3c3ff', fontSize: 19, fontWeight: 'bold' }}>
                                    {playtime?.hastily ? `${Math.round(playtime.hastily / 3600)}H` : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{ color: '#959595ff', fontSize: 12, marginTop: 8 }}>
                        {playtime?.count ? `Based on ${playtime.count} ratings` : ''}
                    </Text>
                </View>
                <View style={{ marginTop: 6, marginRight: -16 }}>
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
                <View style={{ marginTop: 6 }}>
                    {gamePage?.keywords && gamePage.keywords.length > 0 && (
                        <>
                            <View style={styles.hLine} />
                            <Text style={{ fontSize: 15, color: 'white', marginVertical: 10 }}>
                                KEYWORDS
                            </Text>
                        </>
                    )}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -16 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {gamePage?.keywords?.map((keyword) => (
                                <TouchableOpacity key={keyword.id} onPress={() => router.push(`/(drawer)/keywords/${keyword.id}`)}>
                                    <View key={keyword.id} style={{ backgroundColor: '#404040', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, marginRight: 6 }}>
                                        <Text style={{ color: '#ffffff', fontSize: 12 }}>{keyword.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
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
        marginTop: 8,
        letterSpacing: 0.3,
    },
    playtime: {
        flexDirection: 'column',
        alignItems: 'center', 
        backgroundColor: '#000000ff', 
        borderWidth: 1, 
        borderColor: '#333333ff', 
        paddingVertical: 15, 
        paddingHorizontal: 20, 
        borderRadius: 10, 
        marginTop: 10
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
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 20,
        marginHorizontal: -16
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