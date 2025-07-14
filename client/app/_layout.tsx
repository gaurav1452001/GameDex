import { Stack } from "expo-router";
// import {DrawerContentScrollView,DrawerItemList,} from '@react-navigation/drawer';
import { Image, Text, StyleSheet } from 'react-native';
import GameInfo from './gameInfo';
import SearchGame from './searchGame';
import SignIn from './signIn';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen
    //     name="(tabs)"
    //     options={{
    //       headerShown: true,
    //       title: "Popular",
    //       headerTitleAlign: "left",
    //       headerStyle: { backgroundColor: "#181818" },
    //       headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
    //       headerTintColor: "#fff",
    //       headerShadowVisible: false,
    //     }}
    //   />
    //   <Stack.Screen name="gameInfo" options={{headerShown:false}} />
    // </Stack>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          title: "Popular",
          headerStyle: { backgroundColor: "#181818" },
          headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: "#181818" },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#b0b0b0",
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: true, drawerLabel: 'Home', }} />
        <Drawer.Screen name="searchGame"  options={{ headerShown: false, drawerLabel: 'Search', }} />
        <Drawer.Screen name="signIn" options={{ headerShown: false, drawerLabel: 'Sign In', }} />
        <Drawer.Screen name="gameInfo" options={{headerShown: false,drawerItemStyle:{display:'none'}}} />
      </Drawer>
    </GestureHandlerRootView>
  );
}


