import { Text, View, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ScrollView } from "react-native-gesture-handler";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRef } from "react";

export default function ReviewsScreen() {
  const animation = useRef<LottieView>(null);
  const reviews = useQuery(api.reviews.getAllReviews);

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


 if(reviews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#bcbcbcff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>
          No reviews available at the moment.
        </Text>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#181818',
          }}
          source={require('@/assets/animations/ghost.json')}
        />
      </View>
    );
 }

  return (
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#181818' }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={{ fontSize: 18, color: '#61d76fff', fontWeight: 'bold', marginBottom: 5 }}>
            Popular Reviews
          </Text>
        </View>

        {reviews?.filter(review => review.reviewText && review.reviewText.trim() !== "").map((review) => (
          <TouchableOpacity onPress={() => router.push(`/reviews/${review._id}`)} key={review._id} style={{ marginTop: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <Text style={{ color: '#c7c7c7ff', fontSize: 15, fontWeight: 900, flex: 1.7 }}>
                {review.gameName}
                <Text style={styles.reviewGameDate}>
                  {review.gameYear ? `  ${review.gameYear}` : ''}
                </Text>
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end' }}>
                <Text style={{ color: '#828282ff', marginRight: 8, fontSize: 12, fontWeight: 'bold' }} numberOfLines={1}>
                  {review.name?.length > 9 ? `${review.name.substring(0, 9)}...` : review.name}
                </Text>
                <Image
                  source={{ uri: review.imageUrl }}
                  style={{ width: 28, height: 28, borderRadius: 50, borderWidth: 1, borderColor: '#404040' }}
                />
              </View>
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
  );
}

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
  displayText: {
    color: '#f0f0f0',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center'
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