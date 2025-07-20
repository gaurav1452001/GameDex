import { Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, Button, Image, TouchableOpacity } from "react-native";
export default function Index() {
    return (
        <View style={styles.view}>
            <View>
                <Image
                    source={require('../assets/images/landingpage.jpg')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#181818']} // Replace #ffffff with your background color
                    style={styles.gradient}
                />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <Text style={styles.mainText}>
                    GameDex
                </Text>
                <Text style={styles.introText}>
                    Discover and explore games like never before.
                </Text>
                <Link href="/(drawer)/(tabs)" asChild>
                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={styles.ButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/(drawer)/(tabs)" asChild>
                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={styles.ButtonText}>Skip this step</Text>
                    </TouchableOpacity>
                </Link>
                <Text style={styles.infoText}>
                    You can browse content without an account, but some features will be limited.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        
    },
    introText: {
        color: '#b1b1b1ff',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    skipButton: {
        backgroundColor: '#373a42ff',
        padding: 10,
        marginVertical: 6,
        borderRadius: 5,
        
    },
    ButtonText: {
        color: '#d3ceceff',
        fontSize: 16,
        textAlign: 'center',
        
    },
    infoText: {
        color: '#747373ff',
        fontSize: 12,
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    view: {
        flex: 1,
        backgroundColor: '#181818',
    },
    image: {
        width: '100%',
        height: 400,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
    },

})
