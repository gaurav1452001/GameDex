import React, { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { StyleSheet } from "react-native";
import { useSSO, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient';
import { View, Button, Image } from 'react-native'
import { SignOutModal } from '../../components/signOutModal'


export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  useWarmUpBrowser()
  const { user } = useUser()



  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()
  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri({ path: '/' }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View style={styles.view}>
      <View>
        <Image
          source={require('../../assets/images/halocoverart.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#181818']} // Replace #ffffff with your background color
          style={styles.gradient}
        />
      </View>

      <View style={styles.lowerView}>
        <SignedOut>
          <Button title="Sign in with Google" onPress={onPress} />
        </SignedOut>
        <SignedIn>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
        </SignedIn>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#181818',

  },
  lowerView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  image: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%',
  },
});