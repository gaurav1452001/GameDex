import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'

// Static mapping of website type IDs to logo imports
const websiteLogos: { [key: number]: any } = {
    1: require('@/assets/images/website_logos/1.png'),
    2: require('@/assets/images/website_logos/2.png'),
    3: require('@/assets/images/website_logos/3.png'),
    4: require('@/assets/images/website_logos/4.png'),
    5: require('@/assets/images/website_logos/5.png'),
    6: require('@/assets/images/website_logos/6.png'),
    8: require('@/assets/images/website_logos/8.png'),
    9: require('@/assets/images/website_logos/9.png'),
    10: require('@/assets/images/website_logos/10.png'),
    11: require('@/assets/images/website_logos/11.png'),
    12: require('@/assets/images/website_logos/12.png'),
    13: require('@/assets/images/website_logos/13.png'),
    14: require('@/assets/images/website_logos/14.png'),
    15: require('@/assets/images/website_logos/15.png'),
    16: require('@/assets/images/website_logos/16.png'),
    17: require('@/assets/images/website_logos/17.png'),
    18: require('@/assets/images/website_logos/18.png'),
    19: require('@/assets/images/website_logos/19.png'),
    22: require('@/assets/images/website_logos/22.png'),
    23: require('@/assets/images/website_logos/23.png'),
    24: require('@/assets/images/website_logos/24.png'),
    
    // Add more mappings as needed for other website types
}

const Websites = () => {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)

    const getWebsiteLogo = (typeId: number) => {
        return websiteLogos[typeId] || require('@/assets/images/website_logos/1.png')
    }

    return (
        <View style={{ marginTop: 6 }}>
            {gamePage?.websites && gamePage.websites.length > 0 && (
                <>
                    <View style={styles.hLine} />
                    <Text style={{ fontSize: 15, color: 'white', marginVertical: 10 }}>
                        LINKS
                    </Text>
                </>
            )}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap',  }}>
                    {gamePage?.websites?.map((website) => (
                            <View key={website.id} style={{ backgroundColor: '#1d1d1dff', marginRight: 10, marginTop: 10, padding: 2 }}>
                                <TouchableOpacity onPress={() => Linking.openURL(website.url)}>
                                    <Image source={getWebsiteLogo(website.type.id)} 
                                        style={{ width: 28, height: 28 }} 
                                        resizeMode='cover'
                                        />
                                </TouchableOpacity>
                            </View>
                    ))}
                </View>
        </View>
    )
}

export default Websites;

const styles = {
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 20,
        marginHorizontal: -16
    },
};