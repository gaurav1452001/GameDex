import React, { useCallback, useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { StyleSheet, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSignIn, useSignUp, useSSO, SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient';
import { View, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
    useWarmUpBrowser()
    const { user } = useUser()
    const { signIn, setActive, isLoaded } = useSignIn()
    const { signUp, setActive: setActiveSignUp, isLoaded: isLoadedSignUp } = useSignUp()

    // Form states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Email verification states
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')

    // Social sign-in
    const { startSSOFlow: startGoogleSSO } = useSSO()

    const onEmailSignIn = async () => {
        if (!isLoaded) return
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            })

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId })
                router.replace('/(drawer)/(tabs)')
            } else {
                console.error(JSON.stringify(completeSignIn, null, 2))
                Alert.alert('Error', 'Sign in failed. Please try again.')
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Error', err.errors?.[0]?.message || 'Sign in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const onEmailSignUp = async () => {
        if (!isLoadedSignUp) return
        if (!email.trim() || !password.trim() || !username.trim()) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        // Basic username validation
        if (username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters long')
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            Alert.alert('Error', 'Username can only contain letters, numbers, and underscores')
            return
        }

        setLoading(true)
        try {
            await signUp.create({
                emailAddress: email,
                password,
                username: username,
            })

            // Send the email verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Error', err.errors?.[0]?.message || 'Sign up failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const onPressVerify = async () => {
        if (!isLoadedSignUp) return
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter the verification code')
            return
        }

        setLoading(true)
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActiveSignUp({ session: completeSignUp.createdSessionId })
                router.replace('/(drawer)/(tabs)')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
                Alert.alert('Error', 'Verification failed. Please try again.')
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const resendCode = async () => {
        if (!isLoadedSignUp) return

        setLoading(true)
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            Alert.alert('Success', 'Verification code sent to your email')
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Error', 'Failed to resend code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const onGooglePress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startGoogleSSO({
                strategy: 'oauth_google',
                redirectUrl: AuthSession.makeRedirectUri({ path: '/' }),
            })

            if (createdSessionId) {
                setActive!({ session: createdSessionId })
                router.replace('/(drawer)/(tabs)')
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert('Error', 'Google sign in failed. Please try again.')
        }
    }, [])


    return (
        <ScrollView style={styles.view}>
            <View>
                <Image
                    source={require('../../../assets/images/halocoverart.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#181818']}
                    style={styles.gradient}
                />
            </View>

            <SignedOut>
                <View style={styles.formContainer}>
                    {!pendingVerification ? (
                        <>
                            <Text style={styles.title}>
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {isSignUp
                                    ? 'Sign up to start tracking your games'
                                    : 'Sign in to continue discovering games'
                                }
                            </Text>

                            {/* Username Input - Only show for Sign Up */}
                            {isSignUp && (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        placeholderTextColor="#666"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        maxLength={20}
                                    />
                                </View>
                            )}

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#666"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Username requirements text for sign up */}
                            {isSignUp && (
                                <Text style={styles.requirementText}>
                                    Username must be 3-20 characters (letters, numbers, underscore only)
                                </Text>
                            )}

                            {/* Sign In/Up Button */}
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={isSignUp ? onEmailSignUp : onEmailSignIn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        {isSignUp ? 'Sign Up' : 'Sign In'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            {/* Toggle Sign In/Up */}
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={() => {
                                    setIsSignUp(!isSignUp)
                                    // Clear username when switching to sign in
                                    if (!isSignUp) {
                                        setUsername('')
                                    }
                                }}
                            >
                                <Text style={styles.toggleText}>
                                    {isSignUp
                                        ? 'Already have an account? Sign In'
                                        : "Don't have an account? Sign Up"
                                    }
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Social Sign In Buttons */}
                            <View style={{ flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={onGooglePress}
                                >
                                    <Image style={{ height: 40 }} source={require('@/assets/images/google.png')} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        /* Email Verification Form */
                        <>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => {
                                    setPendingVerification(false)
                                    setCode('')
                                }}
                            >
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>

                            <Text style={styles.title}>Verify Your Email</Text>
                            <Text style={styles.subtitle}>
                                We sent a verification code to {email}
                            </Text>

                            {/* Verification Code Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter verification code"
                                    placeholderTextColor="#666"
                                    value={code}
                                    onChangeText={setCode}
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    maxLength={6}
                                />
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={onPressVerify}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify Email</Text>
                                )}
                            </TouchableOpacity>

                            {/* Resend Code */}
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={resendCode}
                                disabled={loading}
                            >
                                <Text style={styles.toggleText}>
                                    Didn't receive the code? Resend
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </SignedOut>

            <SignedIn>
                <View style={styles.signedInContainer}>
                    <Image
                        source={{ uri: user?.imageUrl }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.welcomeText}>Welcome, {user?.firstName}!</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => router.replace('/(drawer)/(tabs)')}
                    >
                        <Text style={styles.buttonText}>Continue to App</Text>
                    </TouchableOpacity>
                </View>
            </SignedIn>
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, backgroundColor: '#00000080', padding: 10, borderRadius: 50 }} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fcfcfcff" />
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#181818',
    },
    image: {
        width: '100%',
        height: 280, // Reduced from 350
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingTop: 16, // Reduced from 20
        paddingBottom: 16, // Reduced from 20
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 12, // Reduced from 20
        padding: 8,
    },
    title: {
        fontSize: 26, // Reduced from 28
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 6, // Reduced from 8
    },
    subtitle: {
        fontSize: 15, // Reduced from 16
        color: '#999',
        textAlign: 'center',
        marginBottom: 24, // Reduced from 32
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        marginBottom: 10, // Reduced from 16
        paddingHorizontal: 16,
        paddingVertical: 5, // Increased slightly from 5 for better touch area
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    requirementText: {
        color: '#999',
        fontSize: 11, // Reduced from 12
        marginTop: -8, // Negative margin to pull closer to input
        marginBottom: 12, // Reduced from default
        textAlign: 'center',
    },
    button: {
        paddingVertical: 14, // Reduced from 16
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: '#4a90e2',
        marginBottom: 12, // Reduced from 16
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    toggleButton: {
        alignItems: 'center',
        marginBottom: 16, // Reduced from 24
    },
    toggleText: {
        color: '#4a90e2',
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16, // Reduced from 24
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#666',
        fontSize: 13, // Reduced from 14
        marginHorizontal: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        backgroundColor: '#333',
        gap: 8,
    },
    socialButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    signedInContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20, // Reduced from 40
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 24,
    },
});