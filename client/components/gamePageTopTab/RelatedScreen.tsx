import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import { ScrollView } from 'react-native-gesture-handler';
import { useRef } from 'react';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

interface RelatedGame {
    id: number;
    cover: {
        id: number;
        url: string;
    };
}

export default function RelatedScreen() {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data);
    const animation = useRef<LottieView>(null);

    const renderSection = (title: string, data: RelatedGame[]) => {
        if (!data || data.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {data?.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => router.push(`/(drawer)/games/${item.id}`)}>
                            <Image
                                source={{ uri: 'https:' + item?.cover?.url?.replace('t_thumb', 't_cover_big_2x') }}
                                style={styles.displayImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    // Check if any related content exists
    const hasRelatedContent = gamePage?.ports?.length ||
        gamePage?.bundles?.length ||
        gamePage?.dlcs?.length ||
        gamePage?.expansions?.length ||
        gamePage?.remakes?.length ||
        gamePage?.standalone_expansions?.length ||
        gamePage?.expanded_games?.length ||
        gamePage?.forks?.length ||
        gamePage?.franchise?.games?.length ||
        gamePage?.remasters?.length;

    if (!hasRelatedContent) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    There are no games related to this game.
                </Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={styles.animation}
                    source={require('../../assets/animations/ghost.json')}
                />
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            {renderSection('PARENT GAME', [gamePage?.parent_game].filter(Boolean))}
            {gamePage?.collections?.map((collection) => 
                renderSection(`COLLECTION: ${collection.name?.toUpperCase()}`, collection.games || [])
            )}
            {renderSection(`FRANCHISE: ${gamePage?.franchise?.name.toUpperCase()}`, gamePage?.franchise?.games || [])}
            {renderSection('PORTS', gamePage?.ports || [])}
            {renderSection('BUNDLES', gamePage?.bundles || [])}
            {renderSection('DLCS', gamePage?.dlcs || [])}
            {renderSection('EXPANSIONS', gamePage?.expansions || [])}
            {renderSection('REMAKES', gamePage?.remakes || [])}
            {renderSection('REMASTERS', gamePage?.remasters || [])}
            {renderSection('STANDALONE EXPANSIONS', gamePage?.standalone_expansions || [])}
            {renderSection('EXPANDED GAMES', gamePage?.expanded_games || [])}
            {renderSection('FORKS', gamePage?.forks || [])}
        </View>
    );
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        backgroundColor: '#181818',
        paddingTop: 20,
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
    emptyContainer: {
        backgroundColor: '#181818',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        flex: 1,
    },
    emptyText: {
        letterSpacing: 0.8,
        color: '#d4d4d4ff',
        fontSize: 15,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    animation: {
        width: 200,
        height: 150,
        backgroundColor: '#181818',
    },
    section: {
        marginBottom: 25,
        marginRight: -16
    },
    sectionTitle: {
        color: '#e0e0e0ff',
        fontSize: 14,
        marginBottom: 15,
        letterSpacing: 1,
    },
    gameItem: {
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gameImage: {
        width: 80,
        height: 110,
        borderRadius: 8,
    },
});
