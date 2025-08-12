import { Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ScrollView } from "react-native-gesture-handler";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { useUser } from "@clerk/clerk-expo";
import React from "react";

const Reviews = () => {
  const params = useLocalSearchParams();
  const userExternalId = params?.externalId as string;
  const animation = useRef<LottieView>(null);
  const {isLoaded } = useUser();
  const UserData = useQuery(api.users.getUserByExternalId, { externalId: userExternalId as string });
  const reviews = useQuery(api.reviews.getUserReviews, { externalId: userExternalId as string });

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#61d76fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  if (!reviews) {
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


  if (reviews.length === 0) {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
            {(UserData?.name ? UserData.name.slice(0, 15) : 'User')}'s Reviews
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: '#bcbcbcff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>
            You don't have any reviews yet.
            {'\n'}Start reviewing games to see them here!
          </Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181818' }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
          {(UserData?.name ? UserData.name.slice(0, 15) : 'User')}'s Reviews
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#181818' }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >

        {reviews?.map((review) => (
          <TouchableOpacity onPress={() => router.push(`/reviews/${review._id}`)} key={review._id} style={{ marginTop: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <Text style={{ color: '#c7c7c7ff', fontSize: 15, fontWeight: 900, flex: 1.7 }}>
                {review.gameName}
                <Text style={styles.reviewGameDate}>
                  {review.gameYear ? `  ${review.gameYear}` : ''}
                </Text>
              </Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8 }}>
              <StarRatingDisplay
                rating={review.starRating}
                emptyColor="#181818"
                color="#61d76fff"
                starSize={13}
                starStyle={{ marginHorizontal: -0.5 }}
              />
              {review.isLiked && (
                <Ionicons
                  name="heart"
                  size={13}
                  color="#d98138ff"
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              {review?.gameCover ? (
                <Image
                  source={{ uri: review.gameCover }}
                  style={{ width: 80, height: 120, marginRight: 12, borderColor: '#535353ff', borderWidth: 1 }}
                />
              ) : (
                <View style={styles.displayImage}>
                  <Text style={styles.displayText}>
                    {review.gameName}
                  </Text>
                </View>
              )}
              <View style={{ flex: 2 }}>
                <Text style={{ color: '#aaaaaaff', fontSize: 12, letterSpacing: 0.5 }} numberOfLines={8}>{review.reviewText}</Text>
              </View>
            </View>
            <View style={styles.hLine} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
export default Reviews;

const styles = StyleSheet.create({
  hLine: {
    height: 1,
    backgroundColor: '#333',
    marginTop: 15,
    marginRight: -16
  },
  reviewGameDate: {
    color: '#7a7a7aff',
    fontSize: 11,
    fontWeight: '500',
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
  displayText: {
    color: '#f0f0f0',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2a2a2a',
  },
  displayImage: {
    borderColor: '#535353ff',
    backgroundColor: '#404040',
    justifyContent: 'center',
    width: 80,
    height: 120,
    marginRight: 12,
    borderWidth: 1,
  }
})