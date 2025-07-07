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
                <View style={styles.infoContainer}>

                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
    backgroundColor: '#232323', 
    justifyContent: 'center' 
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
  },
  infoContainer:{
    flexDirection:'row',
    color: 'white'
  }
});