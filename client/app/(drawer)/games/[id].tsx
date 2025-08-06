import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Linking, Modal, Touchable } from "react-native";
import { SignedIn, useUser } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from "react";
import LottieView from 'lottie-react-native';
import axios from "axios";
import { useNavigation } from '@react-navigation/native'
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { PlaytimeType } from "@/types/gameTypes";
import type { RootState } from '@/redux/store'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { update, clearData } from '@/redux/gameData/gameDataSlice'
import { clearLogger, updateLogger } from '@/redux/gameLogger/gameLoggerSlice';
import DetailsScreen from '@/components/gamePageTopTab/DetailsScreen';
import MediaScreen from '@/components/gamePageTopTab/MediaScreen';
import ReleasesScreen from '@/components/gamePageTopTab/ReleasesScreen';
import RelatedScreen from '@/components/gamePageTopTab/RelatedScreen';
import LoggerButton from "@/components/loggerButton";
import LoggerModal from "@/components/loggerModal";
import Languages from "@/components/gamePageInfo/languages";
import Platforms from "@/components/gamePageInfo/platforms";
import Websites from "@/components/gamePageInfo/websites";



export default function GameInfo() {
    const dispatch = useAppDispatch();
    const animation = useRef<LottieView>(null);
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [playtime, setPlaytime] = useState<PlaytimeType>();
    const [modalVisible, setModalVisible] = useState(false);
    const loggerVisible = useAppSelector((state: RootState) => state.gamePageLogger.data);
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const { user } = useUser();
    useEffect(() => {
        const fetchGameInfo = async () => {
            dispatch(clearData());
            dispatch(clearLogger());
            setActiveTab('details');
            setExpanded(false);
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/search/${id}`);
                const responsePlaytime = await axios.get(`http://${ip_address}:8000/posts/playtime/${id}`);
                dispatch(update(response.data));
                setPlaytime(responsePlaytime.data[0]);

            } catch (error) {
                console.error('Error fetching playtime:', error);
            }
        };
        fetchGameInfo();
    }, [id]);
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    const openYouTubeLink = () => {
        const url = `https://www.youtube.com/watch?v=${gamePage?.videos?.[0]?.video_id}`;
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    };
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
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#181818' }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalContainer}>
                        <Image
                            source={{ uri: 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_1080p_2x') }}
                            style={styles.modalImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </Modal>

                <View style={styles.container}>
                    {gamePage?.screenshots ? (
                        <Image
                            source={{ uri: 'https:' + gamePage.screenshots[0].url.replace('t_thumb', 't_screenshot_huge') }}
                            style={{
                                width: '100%',
                                height: 200,
                                borderColor: 'gray',
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../../../assets/images/login_screen_image.png')}
                            style={{
                                width: '100%',
                                height: 200,
                                borderColor: 'gray',
                            }}
                            resizeMode="cover"
                        />
                    )}
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
                            {gamePage?.cover?.url ? (
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Image
                                        source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                                        style={styles.displayImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.displayImage}>
                                    <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                        {gamePage?.name}
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
                    <TouchableOpacity onPress={() => { dispatch(updateLogger()) }}>
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
                            <View style={styles.hLine} />
                        </SignedIn>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, borderBottomWidth: 1, borderBottomColor: '#333', marginHorizontal: -16 }}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'details' && styles.activeTab]}
                            onPress={() => setActiveTab('details')}
                        >
                            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>DETAILS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'media' && styles.activeTab]}
                            onPress={() => setActiveTab('media')}
                        >
                            <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>MEDIA</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'releases' && styles.activeTab]}
                            onPress={() => setActiveTab('releases')}
                        >
                            <Text style={[styles.tabText, activeTab === 'releases' && styles.activeTabText]}>RELEASES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'related' && styles.activeTab]}
                            onPress={() => setActiveTab('related')}
                        >
                            <Text style={[styles.tabText, activeTab === 'related' && styles.activeTabText]}>RELATED</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'details' && <DetailsScreen />}
                    {activeTab === 'media' && <MediaScreen />}
                    {activeTab === 'releases' && <ReleasesScreen />}
                    {activeTab === 'related' && <RelatedScreen />}
                    <View style={styles.hLine} />
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
                                    <Text style={{ color: '#c3c3c3ff', fontSize: 19, fontWeight: 'bold' }}>
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
                                <View style={styles.hLine} />
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
                    <Websites />
                    <Platforms />
                    <Languages />
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
                                        <View key={keyword.id} style={{ backgroundColor: '#353535ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, marginRight: 6 }}>
                                            <Text style={{ color: '#ffffff', fontSize: 12 }}>{keyword.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 50, left: 20 }}>
                <Ionicons name="arrow-back" size={24} color="#ffffffff" />
            </TouchableOpacity>
            <SignedIn>
                <TouchableOpacity onPress={() => { dispatch(updateLogger()) }} style={{ position: 'absolute', bottom: 35, right: 20 }}>
                    <LoggerButton />
                </TouchableOpacity>
                {loggerVisible && <LoggerModal />}
            </SignedIn>

        </View>
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
        height: '20%',
        width: '100%',
    },
    infoContainer: {
        flexDirection: 'row',
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalImage: {
        width: '100%',
        height: '70%',
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
    },
    tabButton: {
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#54e868ff',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
    },
    activeTabText: {
        color: '#ffffffff',
    }
})
