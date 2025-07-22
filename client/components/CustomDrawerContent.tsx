import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router'
import { View ,Image,Text} from 'react-native';
export default function CustomDrawerContent(props: any) {
    return (
        <View style={{ flex: 1, backgroundColor: '#181818' }}>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <View style={{ backgroundColor: '#181818', alignItems: 'center',marginBottom: 20 }}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{ width: 200, height: 150 }}
                    />
                    <Text style={{ color: '#ffffff', fontSize: 35, fontWeight: 'bold', marginBottom: 10 }}>
                        GameDex
                    </Text>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
}