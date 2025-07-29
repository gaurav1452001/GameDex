import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text, Touchable, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SignOutModal } from './signOutModal';
export default function CustomDrawerContent(props: any) {
    const { user } = useUser()
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#181818' }}>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <SignedOut>
                    <View style={{ backgroundColor: '#181818', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={{ width: 200, height: 150 }}
                        />
                        <Text style={{ color: '#ffffff', fontSize: 35, fontWeight: 'bold', marginBottom: 10 }}>
                            GameDex
                        </Text>
                    </View>
                </SignedOut>

                <SignedIn>
                    <View style={{ backgroundColor: '#181818', marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>
                        <Image
                            source={{ uri: user?.imageUrl }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                marginBottom: 10,
                                borderColor: '#4d4d4dff',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>
                            {user?.fullName || user?.firstName || 'User'}
                        </Text>
                    </View>
                </SignedIn>
                <DrawerItemList {...props} />
                <SignedIn>
                        <SignOutModal/>
                </SignedIn>
            </DrawerContentScrollView>
        </View>
    );
}