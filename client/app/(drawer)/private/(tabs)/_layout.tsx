import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, SafeAreaView, TouchableOpacity,StyleSheet } from 'react-native';
import Finished from './index';
import Playing from './playing';
import Wishlist from './wishlist';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const Tab = createMaterialTopTabNavigator();


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

export default function PrivateTabs() {
    const { user } = useUser();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0bff', paddingTop: 45 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                    {user?.firstName}'s Games
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
                <Tab.Screen name="FINISHED" component={Finished} options={{ title: "FINISHED" }} />
                <Tab.Screen name="PLAYING" component={Playing} options={{ title: "PLAYING" }} />
                <Tab.Screen name="WISHLIST" component={Wishlist} options={{ title: "WISHLIST" }} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

