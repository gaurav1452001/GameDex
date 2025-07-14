import { Stack } from "expo-router";
// import {DrawerContentScrollView,DrawerItemList,} from '@react-navigation/drawer';
import {Drawer} from 'expo-router/drawer';
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
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: true}} />
        <Drawer.Screen name="gameInfo" options={{ headerShown: false }} />
        <Drawer.Screen name="Profile" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
