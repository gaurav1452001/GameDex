import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from 'expo-router';
import CustomDrawerContent from '../../components/CustomDrawerContent';


export default function AppLayout() {
  return (
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: true,
          title: "Popular",
          headerStyle: { backgroundColor: "#181818", shadowOpacity: 0, elevation: 0 },
          headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: "#191919ff", },
          drawerActiveTintColor: "#ffffffff",
          drawerInactiveTintColor: "#7f7f7fff",
          drawerActiveBackgroundColor: '#2d2d2dff',
          drawerHideStatusBarOnOpen: true,
          drawerItemStyle: {
            borderRadius: 9,
            marginVertical: 5,
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/(drawer)/searchGame')}>
              <Ionicons style={{ marginRight: 20, marginTop: 2, width: 30, height: 30, padding: 5 }} name="search-outline" size={23} color="#fff" />
            </TouchableOpacity>
          ),

        }}
      >
        
        <Drawer.Screen name="(tabs)" options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={17} />
          ),
          headerShown: true,
          drawerLabel: 'Home',
        }} />
        <Drawer.Screen name="searchGame" options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={17} />
          ),
          headerShown: false,
          drawerLabel: 'Search',
        }} />
        <Drawer.Screen name="signIn" options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" color={color} size={17} />
          ),
          headerShown: false,
          drawerLabel: 'Sign In',
        }} />
        <Drawer.Screen name="games/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      </Drawer>

  );
}


