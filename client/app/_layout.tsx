import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
console.log('Clerk Publishable Key:', clerkPublishableKey);

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar translucent={true} backgroundColor="transparent"/>
              <Slot />
            </GestureHandlerRootView>
          </ClerkLoaded>
      </ClerkProvider>
    </Provider>
  );
}