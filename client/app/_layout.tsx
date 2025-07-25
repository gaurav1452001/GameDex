import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot, Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
console.log('Clerk Publishable Key:', clerkPublishableKey);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
}