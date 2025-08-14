import { useUser } from '@clerk/clerk-expo';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet } from 'react-native';
import { SignOutModal } from './signOutModal';
import * as Linking from 'expo-linking';
import { Authenticated, Unauthenticated } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function CustomDrawerContent(props: any) {
    const { user } = useUser();
    const convexUser = useQuery(
        api.users.getUserByExternalId,
        user?.id ? { externalId: user.id } : "skip"
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#191919ff' }}>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <Unauthenticated>
                    <View style={{ backgroundColor: '#191919ff', alignItems: 'flex-start', marginBottom: 30, marginTop:30 }}>
                        <Image
                            source={require('../assets/images/gamedexlogo2.png')}
                            resizeMode='contain'
                            style={{ width: 200, height: 100, }}
                        />
                    </View>
                </Unauthenticated>

                <Authenticated>
                    <View style={{ backgroundColor: '#191919ff', marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 }}>
                        <Image
                            source={{ uri: convexUser?.imageUrl }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: '#4d4d4dff',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
                            {convexUser?.name}
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
                        onPress={() => router.replace({
                            pathname: '/(drawer)/user_profile',
                            params: { externalId: user?.id }
                        })}
                        icon={({ color, size }) => (
                            <Ionicons name="person-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Games"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.replace({
                            pathname: '/(drawer)/user_games',
                            params: { externalId: user?.id }
                        })}
                        icon={({ color, size }) => (
                            <Ionicons name="game-controller-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Reviews"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.replace({
                            pathname: '/(drawer)/user_reviews',
                            params: { externalId: user?.id }
                        })}
                        icon={({ color, size }) => (
                            <Ionicons name="star-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Lists"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.replace({
                            pathname: '/(drawer)/user_lists',
                            params: { externalId: user?.id }
                        })}
                        icon={({ color, size }) => (
                            <Ionicons name="list" size={17} color={'#9f9f9fff'} />
                        )}
                    />

                    <DrawerItem
                        label="Settings"
                        labelStyle={{ color: '#9f9f9fff', fontSize: 14 }}
                        onPress={() => router.replace({
                            pathname: '/(drawer)/private/settings',
                            params: { externalId: user?.id }
                        })}
                        icon={({ color, size }) => (
                            <Ionicons name="settings-outline" size={17} color={'#9f9f9fff'} />
                        )}
                    />
                </Authenticated>

                <Authenticated>
                    <SignOutModal />
                </Authenticated>
            </DrawerContentScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight:10, alignContent:'center' }}>
                <Text
                    style={{ fontWeight: 'bold', color: '#c1c1c1ff', fontSize: 15, textAlign: 'center', paddingLeft: 30, marginBottom: 20 }}
                    onPress={() => Linking.openURL('https://kumargaurav.me')}
                >
                    About Dev
                </Text>
                <Text style={{ fontStyle: 'italic', color: '#9a9a9aff', fontSize: 12, textAlign: 'center', paddingLeft: 30, marginBottom: 20 }}>
                    Powered By IGDB
                </Text>
            </View>
        </View>
    );
}
