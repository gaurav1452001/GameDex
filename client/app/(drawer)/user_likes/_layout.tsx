import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import Lists from './lists';
import Reviews from '.';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function PrivateTabs() {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0bff', paddingTop: 45 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/(drawer)/(tabs)")} style={{ marginRight: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                    Likes
                </Text>
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarItemStyle: { flex: 1 },
                    tabBarStyle: { backgroundColor: '#0b0b0bff' },
                    tabBarLabelStyle: { color: '#fff', fontSize: 13, letterSpacing: 0.5 },
                    tabBarActiveTintColor: '#ffffffff',
                    tabBarIndicatorStyle: { backgroundColor: '#4692d0ff' },
                }}
            >
                <Tab.Screen name="Lists" component={Lists} options={{ title: "Liked Lists" }} />
                <Tab.Screen name="Reviews" component={Reviews} options={{ title: "Liked Reviews" }} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
        paddingLeft: 12,
        paddingVertical: 12,
        backgroundColor: '#0b0b0bff',
    },
});

