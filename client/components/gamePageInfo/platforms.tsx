import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'

const Platforms = () => {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    return (
        <View style={{ marginTop: 6 }}>
            {gamePage?.platforms && gamePage.platforms.length > 0 && (
                <>
                    <View style={styles.hLine} />
                    <Text style={{ fontSize: 15, color: 'white', marginVertical: 10 }}>
                        PLATFORMS
                    </Text>
                </>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap',   }}>
                    {gamePage?.platforms?.map((platform) => (
                            <View key={platform.id} style={{ backgroundColor: '#353535ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, marginRight: 6,marginTop: 10 }}>
                                <Text style={{ color: 'white', letterSpacing: 0.5 }}>{platform.name}</Text>
                            </View>
                    ))}
            </View>
        </View>
    )
}

export default Platforms;

const styles = {
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 20,
        marginHorizontal: -16
    },
};