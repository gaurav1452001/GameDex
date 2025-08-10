import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import React, { useRef } from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LottieView from 'lottie-react-native';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ListAddButton from '@/components/listAddButton';

const Lists = () => {
  const animation = useRef<LottieView>(null);
  const { user, isLoaded } = useUser();
  const lists = useQuery(api.lists.getListByUserId, {
    externalId: user?.id as string
  });
  if (!isLoaded) {
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
  if (!lists) {
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


  if (lists.length === 0) {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
            {((user?.firstName || user?.fullName || 'User').slice(0, 15))}'s Lists
          </Text>
        </View>
        <View style={styles.loadingContainer}>

          <Text style={{ color: '#bcbcbcff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5, paddingHorizontal: 20 }}>
            You don't have any lists yet.
            {'\n'}Start by creating one!
          </Text>
          <TouchableOpacity onPress={() => router.push('/(drawer)/private/createList')} style={{ position: 'absolute', bottom: 35, right: 20 }}>
            <ListAddButton />
          </TouchableOpacity>
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
          {((user?.firstName || user?.fullName || 'User').slice(0, 15))}'s Lists
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10, backgroundColor: '#181818' }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >

        {lists?.map((list) => (
          <View key={list._id} style={{ marginTop: 15 }}>
            <TouchableOpacity onPress={() => router.push(`/lists/${list._id}`)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ color: '#c7c7c7ff', fontSize: 15, fontWeight: 900, flex: 2 }}>
                {list.listName}
              </Text>
              <Text style={{ color: '#9b9b9bff', fontSize: 11, flex: 1, textAlign: 'right' }} numberOfLines={1}>
                {list.list_game_ids.length} {list.list_game_ids.length === 1 ? 'game' : 'games'}
              </Text>
            </TouchableOpacity>
            <ScrollView style={{ marginRight: -16 }} horizontal showsHorizontalScrollIndicator={false}>
              {list.list_game_ids.map((game, index) => (
                <TouchableWithoutFeedback key={index} onPress={() => router.push(`/lists/${list._id}`)}>
                  <Image
                    source={{ uri: 'https:' + game?.game_cover_url?.replace('t_thumb', 't_cover_big_2x') }}
                    style={{ width: 65, height: 98.5 }}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => router.push(`/lists/${list._id}`)}>
              <Text style={{ color: '#bababaff', fontSize: 13, marginTop: 5, marginBottom: 10 }} numberOfLines={2}>
                {list.listDesc}
              </Text>
            </TouchableOpacity>
            <View style={styles.hLine} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => router.push('/(drawer)/private/createList')} style={{ position: 'absolute', bottom: 35, right: 20 }}>
        <ListAddButton />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Lists

const styles = StyleSheet.create({
  hLine: {
    height: 1,
    backgroundColor: '#333',
    marginTop: 10,
    marginHorizontal: -16
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