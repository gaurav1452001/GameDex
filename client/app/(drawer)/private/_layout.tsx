import { useUser } from '@clerk/clerk-expo';
import { Slot, Redirect, Stack } from 'expo-router';
import { Authenticated } from 'convex/react';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
    const { isSignedIn, isLoaded } = useUser();

    // // Show loading while auth state is being determined
    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
                <ActivityIndicator size="large" color="#61d76fff" />
            </View>
        );
    }

    // // Redirect to sign in if not authenticated
    if (!isSignedIn) {
        return <Redirect href="/(drawer)/(auth)/signIn" />;
    }

    // Only render children when fully authenticated
    return (
        <Authenticated>
            <Slot />
        </Authenticated>
    );
}