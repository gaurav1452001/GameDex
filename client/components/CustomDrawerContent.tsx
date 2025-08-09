import { useUser } from '@clerk/clerk-expo';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet } from 'react-native';
import { SignOutModal } from './signOutModal';
import { Authenticated, Unauthenticated } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CustomDrawerContent(props: any) {
    const { user } = useUser();

    return (
        <View style={{ flex: 1, backgroundColor: '#191919ff' }}>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <Unauthenticated>
                    <View style={{ backgroundColor: '#191919ff', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={{ width: 200, height: 150 }}
                        />
                        <Text style={{ color: '#ffffff', fontSize: 35, fontWeight: 'bold', marginBottom: 10 }}>
                            GameDex
                        </Text>
                    </View>
                </Unauthenticated>

                <Authenticated>
                    <View style={{ backgroundColor: '#191919ff', marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 }}>
                        <Image
                            source={{ uri: user?.imageUrl }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: '#4d4d4dff',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
                            {user?.fullName || user?.firstName || 'User'}
                        </Text>
                    </View>
                </Authenticated>

                {/* Default drawer items (only show public ones) */}
                <DrawerItemList {...props} />

                {/* Protected routes section - only visible when authenticated */}
                <Authenticated>
                    <DrawerItem
                        label="Profile"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private/profile')}
                        icon={({ color, size }) => (
                            <Ionicons name="person-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Activity"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private')}
                        icon={({ color, size }) => (
                            <Ionicons name="person-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />
                    <DrawerItem
                        label="Diary"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private/diary')}
                        icon={({ color, size }) => (
                            <Ionicons name="bookmark-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Wishlist"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private/wishlist')}
                        icon={({ color, size }) => (
                            <Ionicons name="heart-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Reviews"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private/reviews')}
                        icon={({ color, size }) => (
                            <Ionicons name="star-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Lists"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.push('/(drawer)/private/lists')}
                        icon={({ color, size }) => (
                            <Ionicons name="list" size={17} color={'#9f9f9fff'} />
                        )}
                    />
                </Authenticated>
                <Authenticated>
                    <SignOutModal />
                </Authenticated>
            </DrawerContentScrollView>
        </View>
    );
}
