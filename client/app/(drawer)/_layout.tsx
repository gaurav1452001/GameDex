import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CustomDrawerContent from '../../components/CustomDrawerContent';
import { useUser } from '@clerk/clerk-expo';
import { HeaderBackButton } from '@react-navigation/elements';


export default function AppLayout() {
  const { isSignedIn } = useUser();
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
      drawerInactiveTintColor: "#9f9f9fff",
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

      <Drawer.Screen name="(protected)/profile" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="person-outline" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Profile',
      drawerItemStyle: { display: isSignedIn ? 'flex' : 'none' },
      }} />

      <Drawer.Screen name="(protected)/wishlist" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="heart-outline" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Wishlist',
      drawerItemStyle: { display: isSignedIn ? 'flex' : 'none' },
      }} />

      <Drawer.Screen name="(protected)/diary" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="bookmark" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Diary',
      drawerItemStyle: { display: isSignedIn ? 'flex' : 'none' },
      }} />

      <Drawer.Screen name="(protected)/lists" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="list-outline" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Lists',
      drawerItemStyle: { display: isSignedIn ? 'flex' : 'none' },
      }} />

      <Drawer.Screen name="(protected)/reviews" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="create" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Reviews',
      drawerItemStyle: { display: isSignedIn ? 'flex' : 'none' },
      }} />

      <Drawer.Screen name="signIn" options={{
      drawerIcon: ({ color, size }) => (
        <Ionicons name="log-in-outline" color={color} size={17} />
      ),
      headerShown: false,
      drawerLabel: 'Sign In',
      drawerItemStyle: { display: isSignedIn ? 'none' : 'flex' },
      }} />
      

      <Drawer.Screen name="games/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' }}} />
      <Drawer.Screen name="events/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="keywords/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="games/review/review" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
    </Drawer>

  );
}


