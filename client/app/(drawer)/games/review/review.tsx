import { View, Image, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'

const Review = () => {

    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)

    return (
        <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>
                        {gamePage?.name}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'white' }}>
                        {gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear() : ''}
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                    <Image
                        source={{ uri: 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_cover_big_2x') }}
                        style={{ width: 30, height: 50, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default Review