import { View, StyleSheet, Image, Text, Modal, TouchableOpacity, Touchable } from 'react-native';
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import { ScrollView } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import LottieView from 'lottie-react-native';

export default function ReleasesScreen() {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data);
    const animation = useRef<LottieView>(null);

    if (!gamePage?.release_dates) {
        return (
            <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                <Text style={{ letterSpacing: 0.8, color: '#d4d4d4ff', fontSize: 15, paddingHorizontal: 20, textAlign: 'center' }}>
                    Release Dates Unavailable for this game.
                </Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 250,
                        height: 250,
                        backgroundColor: '#181818',
                    }}
                    source={require('../../assets/animations/ghost.json')}
                />
            </View>
        );
    }


    return (
        <ScrollView style={styles.tabContent}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ddddddff', marginBottom: 10}}>RELEASE DATES</Text>
            {gamePage.release_dates.map((release) => (
                <View key={release.id} style={styles.releaseItem}>
                    <Text style={styles.platformName}>{release.platform.name}</Text>

                    <Text style={styles.releaseDate}>
                        {new Date(release.date * 1000).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        backgroundColor: '#181818',
        paddingVertical: 20,
    },
    releaseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    platformName: {
        color: '#7feb8dff',
        fontSize: 15,
    },
    releaseDate: {
        color: '#e5e5e5ff',
        fontSize: 16,
    },
});
