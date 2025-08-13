import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router, useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

const UserFollowing = () => {
  const params = useLocalSearchParams();
  const animation = useRef<LottieView>(null);
  const userExternalId = params?.externalId as string;
  const UserData = useQuery(api.users.getUserByExternalId, { externalId: userExternalId as string });
  const following = useQuery(api.follows.getFollowing, { userId: UserData?._id as Id<'users'> });

  if (!userExternalId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No userId provided.</Text>
      </View>
    );
  }

  if (following === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#181818',
          }}
          source={require('@/assets/animations/batman.json')}
        />
      </View>
    );
  }

  if (following.length === 0) {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
            {UserData?.name}
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
          <Text style={{ color: '#b8b8b8ff', fontSize: 16 }}>This user is not following any accounts.</Text>
        </View>
      </>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
          {UserData?.name || 'User'}'s Following
        </Text>
      </View>
      <View style={{ flex: 1, padding: 16, backgroundColor: '#181818' }}>
        {following.map((following) => (
          <TouchableOpacity onPress={() => {
            router.push({
              pathname: '/(drawer)/user_profile',
              params: { externalId: following?.externalId }
            })
          }} key={following?._id} style={{ flexDirection: 'column', marginTop: 15, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: following?.imageUrl || 'https://placehold.co/40x40' }}
                style={{ width: 40, height: 40, borderRadius: 50, borderWidth: 1, borderColor: '#6e6e6eff' }}
              />
              <Text style={{ marginLeft: 12, color: '#b8b8b8ff', fontSize: 15 }}>
                {following?.name || 'Unnamed User'}
              </Text>
              <View>
                <Ionicons name="chevron-forward" size={20} color="#b8b8b8ff" style={{ marginTop: 5 }} />
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#545454ff', marginTop: 15, marginHorizontal: -16 }} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default UserFollowing;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2a2a2a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
  },
});