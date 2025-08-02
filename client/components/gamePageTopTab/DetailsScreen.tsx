import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';

export default function DetailsScreen() {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data);    // Function to categorize companies
    const animation = useRef<LottieView>(null);
    const categorizeCompanies = () => {
        if (!gamePage?.involved_companies) return null;

        const categories = {
            mainDevelopers: [] as string[],
            publishers: [] as string[],
            portingDevelopers: [] as string[],
            supportingDevelopers: [] as string[]
        };

        gamePage.involved_companies.forEach(company => {
            const companyName = company.company?.name;
            if (!companyName) return;

            if (company.developer) {
                categories.mainDevelopers.push(companyName);
            }
            if (company.publisher) {
                categories.publishers.push(companyName);
            }
            if (company.porting) {
                categories.portingDevelopers.push(companyName);
            }
            if (company.supporting) {
                categories.supportingDevelopers.push(companyName);
            }
        });

        return categories;
    };

    const companies = categorizeCompanies();

    if (!companies && !gamePage?.genres && !gamePage?.themes && !gamePage?.game_modes && !gamePage?.player_perspectives) {
        return (
            <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Text style={{ letterSpacing: 0.8, color: '#d4d4d4ff', fontSize: 15, marginBottom: 10, paddingHorizontal: 20, textAlign: 'center' }}>
                    Details for this game are shrouded in mystery.
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
        <ScrollView style={styles.mainView}>
            <View style={{ flex:1,flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.tabContent}>
                    {companies && companies.mainDevelopers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>MAIN DEVELOPERS</Text>
                            <Text style={styles.companyList}>{companies.mainDevelopers.join(', ')}</Text>
                        </View>
                    )}

                    {companies && companies.publishers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>PUBLISHERS</Text>
                            <Text style={styles.companyList}>{companies.publishers.join(', ')}</Text>
                        </View>
                    )}

                    {companies && companies.portingDevelopers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>PORTING DEVELOPERS</Text>
                            <Text style={styles.companyList}>{companies.portingDevelopers.join(', ')}</Text>
                        </View>
                    )}

                    {companies && companies.supportingDevelopers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SUPPORTING DEVELOPERS</Text>
                            <Text style={styles.companyList}>{companies.supportingDevelopers.join(', ')}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.tabContent}>
                    {gamePage?.genres && gamePage.genres.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle2}>GENRES</Text>
                            <Text style={styles.List}>{gamePage.genres.map(genre => genre.name).join(', ')}</Text>
                        </View>
                    )}
                    {gamePage?.themes && gamePage.themes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle2}>THEMES</Text>
                            <Text style={styles.List}>{gamePage.themes.map(theme => theme.name).join(', ')}</Text>
                        </View>
                    )}
                    {gamePage?.game_modes && gamePage.game_modes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle2}>GAME MODES</Text>
                            <Text style={styles.List}>{gamePage.game_modes.map(mode => mode.name).join(', ')}</Text>
                        </View>
                    )}
                    {gamePage?.player_perspectives && gamePage.player_perspectives.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle2}>PLAYER PERSPECTIVES</Text>
                            <Text style={styles.List}>{gamePage.player_perspectives.map(perspective => perspective.name).join(', ')}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#181818',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#181818',
        paddingTop: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#92dc9cff',
        fontSize: 12,
        letterSpacing: 1,
    },
    companyList: {
        color: 'beige',
        fontSize: 15,
        letterSpacing: 0.3,
        marginTop: 5,
    },
    sectionTitle2: {
        color: '#b59ae6ff',
        fontSize: 12,
        letterSpacing: 1,
        textAlign: 'right',
    },
    List: {
        color: 'beige',
        fontSize: 15,
        letterSpacing: 0.3,
        marginTop: 5,
        textAlign: 'right',
    },
    tabText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
