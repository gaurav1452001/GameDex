import { Link } from "expo-router";
import React from "react";
import { Text, View, Button, Image, TouchableOpacity } from "react-native";
export default function Index() {
    return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require('../assets/images/landingpage.jpg')}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                    resizeMode="cover"
                    blurRadius={3}
                />
                <Link href="/(drawer)/(tabs)" asChild>
                    <Button title="Go to Home" />
                </Link>
            </View>
    );
}
