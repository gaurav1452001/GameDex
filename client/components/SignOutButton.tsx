import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            // Redirect to your desired page
            router.replace('/')
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut}>
            <View style={{ padding: 10, backgroundColor: '#c8c8c8ff', borderRadius: 10 }}>
                <Text>Sign out</Text>
            </View>
        </TouchableOpacity>
    )
}