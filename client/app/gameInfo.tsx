import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function GameInfo() {
    const route = useRoute();
    const { gamePage } = route?.params || {};

    const hasScreenshot = gamePage?.screenshots && gamePage.screenshots[0]?.url;
    console.log('Has screenshot:', hasScreenshot);

    return (
        <ScrollView style={{ backgroundColor: '#181818' }}>
            <View style={styles.container}>
                <Image
                    source={hasScreenshot
                        ? { uri: 'https:' + gamePage.screenshots[0].url.replace('t_thumb', 't_1080p_2x') }
                        : require('../assets/images/login_screen_image.png')
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
                    <View style={{ flex:2,flexDirection: 'column', justifyContent: 'space-between',paddingRight: 10 }}>
                        <View>
                            <Text style={styles.textColor}>
                                {gamePage?.name}
                            </Text>
                        </View>
                        <View>
                            
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <Image
                            source={{ uri: 'https:' + gamePage?.cover?.url?.replace('t_thumb', 't_cover_big_2x') }}
                            style={styles.displayImage}
                            resizeMode="cover"
                        />
                    </View>
                   
                </View>
                 <Text numberOfLines={3} style={styles.textColor2}>
                            {gamePage?.summary}
                 </Text>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#232323',
        justifyContent: 'center'
    },
    textColor:{
        color: 'white',
        fontSize: 25,
    },
    textColor2:{
        color: 'beige',
        fontSize: 13,
        margin:16
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
    displayImage:{
        width: 110,
        height: 149.6,
        borderWidth: 1,
        borderColor: 'gray',
    }
});