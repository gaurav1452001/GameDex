import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: "Popular",
          headerTitleAlign: "left",
          headerStyle: { backgroundColor: "#181818" },
          headerTitleStyle: { color: "#fff", fontWeight: "bold", fontSize: 21 },
          headerTintColor: "#fff",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="gameInfo" options={{headerShown:false}} />
    </Stack>
  );
}
