import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import axios from "axios";

export default function GameInfo() {
    const route = useRoute();
    const { gamePage } = route?.params || {};

    type Play = {
        completely: number;
        game_id: number;
        hastily: number;
        normally: number;
    }
    const [playtime, setPlaytime] = useState<Play>();

    useEffect(() => {
        const fetchPlaytime = async () => {
            try {
                const gameId = gamePage?.id;
                const response = await axios.get(`http://172.19.98.130:8000/posts/playtime`, {
                    params: { game_id: gameId }
                });
                setPlaytime(response.data[0]); // API returns array, get first item
                console.log('Playtime data:', response.data);
            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchPlaytime();
    }, []);

    const hasScreenshot = gamePage?.screenshots && gamePage.screenshots[0]?.url;
    // console.log('Has screenshot:', hasScreenshot);

    return (
        <ScrollView style={{ backgroundColor: '#181818' }}>
            <View style={styles.container}>
                <Image
                    source={hasScreenshot
                        ? { uri: 'https:' + gamePage.screenshots[0].url.replace('t_thumb', 't_1080p_2x') }
                        : require('../../assets/images/login_screen_image.png')
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
                            {gamePage?.involved_companies?.length > 1 && ', '}
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