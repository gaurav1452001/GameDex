import { View, StyleSheet, Image, TouchableOpacity, FlatList, Text, ActivityIndicator,SafeAreaView } from "react-native";
import {useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LottieView from "lottie-react-native";
import { useRef } from "react";



export default function Finished() {
  const animation = useRef<LottieView>(null);
  const { user, isLoaded } = useUser();

  const user_track = useQuery(api.user_game_tracks.getUserGameTrack, { externalId: user?.id as string});
  const wishlistGames = user_track?.finishedPlaying || [];

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#61d76fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  if (!user_track) {
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


  if (wishlistGames?.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#bcbcbcff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>
          You don't have any games in your wishlist yet.
          {'\n'}Start adding games to see them here!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={wishlistGames}
        keyExtractor={(item) => item.game_id.toString()}
        numColumns={4}
        contentContainerStyle={styles.mainView}
        renderItem={({ item: gamePage }) => (
          <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${gamePage.game_id}`)} key={gamePage.game_id}>
            <Image
              source={{ uri: 'https:' + gamePage?.game_cover_url?.replace('t_thumb', 't_cover_big_2x') }}
              style={styles.displayImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#181818',
  },
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

  loadingText: {
    color: '#bcbcbcff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 12,
  },
  button: {
    width: 100,
    height: 20,
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center"
  },
  mainView: {
    justifyContent: 'center',
  },
  displayImage: {
    width: 85,
    height: 126.6,
    margin: 2.4,
    borderWidth: 0.4,
    borderColor: 'gray',
    backgroundColor: '#404040',
  }
})