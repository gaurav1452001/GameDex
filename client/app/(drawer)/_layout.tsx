import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CustomDrawerContent from '../../components/CustomDrawerContent';
import { useUser } from '@clerk/clerk-expo';


export default function AppLayout() {
  const { isSignedIn } = useUser();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#0b0b0bff", shadowOpacity: 0, elevation: 0 },
        headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#191919ff", },
        drawerActiveTintColor: "#ffffffff",
        drawerInactiveTintColor: "#9f9f9fff",
        drawerActiveBackgroundColor: '#2d2d2dff',
        drawerHideStatusBarOnOpen: true,
        drawerItemStyle: {
          borderRadius: 9,
          marginVertical: 4,
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(drawer)/searchGame')}>
            <Ionicons style={{ marginRight: 20, marginTop: 2, width: 30, height: 30, padding: 5 }} name="search-outline" size={23} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Public routes - always visible */}
      <Drawer.Screen name="(tabs)" options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={17} />
        ),
        headerShown: true,
        drawerLabel: 'Home',
        headerTitle: 'GameDex',
      }} />



      <Drawer.Screen name="searchGame" options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="search-outline" color={color} size={17} />
        ),
        headerShown: false,
        drawerLabel: 'Search',
      }} />

      <Drawer.Screen name="profile" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      {/* Auth routes - only show when not signed in */}
      <Drawer.Screen name="(auth)/signIn" options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="log-in-outline" color={color} size={17} />
        ),
        headerShown: false,
        drawerLabel: 'Sign In',
        drawerItemStyle: { display: isSignedIn ? 'none' : 'flex' },
      }} />

      <Drawer.Screen name="(auth)/signUp" options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="person-add-outline" color={color} size={17} />
        ),
        headerShown: false,
        drawerLabel: 'Sign Up',
        drawerItemStyle: { display: isSignedIn ? 'none' : 'flex' },
      }} />

      {/* Private routes - hide from default drawer, handle in CustomDrawerContent */}
      <Drawer.Screen name="private" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      <Drawer.Screen name="private/(tabs)" options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={17} />
        ),
        headerShown: false,
      }} />

      <Drawer.Screen name="private/profile" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      <Drawer.Screen name="private/diary" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      <Drawer.Screen name="private/lists" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      <Drawer.Screen name="private/createList" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      <Drawer.Screen name="private/activity" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

        <Drawer.Screen name="private/reviews" options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
      }} />

      {/* Hidden routes */}
      <Drawer.Screen name="games/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="events/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="keywords/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="reviews/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="lists/[id]" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />

      <Drawer.Screen name="games/review/reviewScreen" options={{
        headerShown: true,
        drawerItemStyle: { display: 'none' },
        title: '    I  Played',
      }} />

      <Drawer.Screen name="games/review/reviewEdit" options={{
        headerShown: true,
        drawerItemStyle: { display: 'none' },
      }} />
    </Drawer>
  );
} 

