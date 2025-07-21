import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from 'expo-router';


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          title: "Popular",
          headerStyle: { backgroundColor: "#181818",shadowOpacity: 0, elevation: 0 },
          headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: "#181818" },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#734949ff",
          headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(drawer)/searchGame')}>
                    <Ionicons style={{ marginRight: 20, marginTop: 2, width: 30, height: 30, padding: 5 }} name="search-outline" size={23} color="#fff" />
          </TouchableOpacity>
        ),
        
      }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: true, drawerLabel: 'Home', }} />
        <Drawer.Screen name="searchGame"  options={{ headerShown: false, drawerLabel: 'Search', }} />
        <Drawer.Screen name="signIn" options={{ headerShown: false, drawerLabel: 'Sign In', }} />
        <Drawer.Screen name="gameInfo" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </GestureHandlerRootView>
    
  );
}


