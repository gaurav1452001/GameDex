import { useUser } from '@clerk/clerk-expo';
import { Slot, Redirect, router } from 'expo-router';
// import { useConvexAuth } from 'convex/react'; // Uncomment if you have this

export function AppLayout() {
    return <Slot />;
}