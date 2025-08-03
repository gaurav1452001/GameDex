import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'

const Languages = () => {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    return (
        <View style={{ marginTop: 6 }}>
            {gamePage?.language_supports && gamePage.language_supports.length > 0 && (
                <>
                    <View style={styles.hLine} />
                    <Text style={{ fontSize: 15, color: 'white', marginVertical: 10 }}>
                        SUPPORTED LANGUAGES
                    </Text>
                </>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {Array.from(new Set(gamePage?.language_supports?.map(language => language.language.name)))
                        .map((languageName) => (
                            <View key={languageName} style={{ backgroundColor: '#404040', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, marginRight: 6 }}>
                                <Text style={{ color: '#ffffff', fontSize: 12 }}>{languageName}</Text>
                            </View>
                        ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default Languages;

const styles = {
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 20,
        marginHorizontal: -16
    },
};