import { Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput, Modal, FlatList, Alert } from "react-native";
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ScrollView } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import React, { useRef, useState, useEffect } from 'react'
import LottieView from "lottie-react-native";
import axios from 'axios';
import { SearchGameType } from '@/types/gameTypes';

const Settings = () => {
  const params = useLocalSearchParams();
  const animation = useRef<LottieView>(null);
  const userExternalId = params?.externalId as string;
  const { isLoaded } = useUser();
  const UserData = useQuery(api.users.getUserByExternalId, { externalId: userExternalId as string });

  // State variables for editing
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [fourFavorites, setFourFavorites] = useState<{game_id: string, game_cover_url?: string}[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [gamePages, setGamePages] = useState<SearchGameType[]>([]);
  const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState<number>(-1);
  
  // Bio modal state
  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const updateUser = useMutation(api.users.updateUser);

  // Initialize state with user data
  useEffect(() => {
    if (UserData) {
      setName(UserData.name || '');
      setBio(UserData.bio || '');
      setFourFavorites(UserData.fourFavorites || []);
    }
  }, [UserData]);

  // Game search effect
  useEffect(() => {
    const fetchGames = async () => {
      if (searchText.trim()) {
        try {
          const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
          const response = await axios.get(`http://${ip_address}:8000/posts/search`, {
            params: {
              searchText: searchText
            }
          });
          setGamePages(response.data);
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      } else {
        setGamePages([]);
      }
    };
    fetchGames();
  }, [searchText]);

  const handleUpdateUser = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateUser({
        externalId: userExternalId,
        name: name.trim() || UserData?.name || '',
        bio: bio.trim(),
        fourFavorites: fourFavorites.filter(fav => fav.game_id && fav.game_id.trim() !== ''), // Remove empty objects
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddFavoriteGame = (game: SearchGameType, index: number) => {
    const gameImageUrl = game.cover?.url
      ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big_2x')
      : 'https://placehold.co/400x600';
    const gameIdStr = game.id.toString();

    // Check if already added
    if (fourFavorites.some(fav => fav.game_id === gameIdStr)) {
      Alert.alert('Already Added', 'This game is already in your favorites.');
      return;
    }

    const updatedFavorites = [...fourFavorites];
    // Ensure we have enough slots
    while (updatedFavorites.length <= index) {
      updatedFavorites.push({ game_id: '', game_cover_url: 'https://placehold.co/70x105' });
    }

    updatedFavorites[index] = {
      game_id: gameIdStr,
      game_cover_url: gameImageUrl
    };

    setFourFavorites(updatedFavorites);
    setModalVisible(false);
    setSearchText("");
    setGamePages([]);
  };

  const handleRemoveFavorite = (index: number) => {
    const updatedFavorites = [...fourFavorites];
    updatedFavorites.splice(index, 1); // Remove the item completely
    setFourFavorites(updatedFavorites);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181818' }}>
      {/* Game Search Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setGamePages([]);
          setSearchText("");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.secondaryModalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', paddingHorizontal: 16, paddingVertical: 5, }}>
              <TextInput
                style={{ fontSize: 17, color: '#d4d4d4ff', flex: 3.2, }}
                placeholder="Search Game..."
                placeholderTextColor="#7e7e7eff"
                autoCapitalize='none'
                autoCorrect={false}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType='done'
                maxLength={100}
              />
              <TouchableOpacity
                onPress={() => {
                  setGamePages([]);
                  setSearchText("");
                  setModalVisible(false);
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}
              >
                <Ionicons name="close" size={22} color="#9a9a9aff" />
              </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: '#5e5e5eff' }} />
            <FlatList
              data={gamePages}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10, }}
              renderItem={({ item: gamePage }) => (
                <TouchableOpacity onPress={() => handleAddFavoriteGame(gamePage, selectedFavoriteIndex)} key={gamePage.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    {gamePage.cover?.url ? (
                      <Image
                        source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                        style={styles.displayImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.displayImage}>
                        <Text style={{ color: '#f0f0f0', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
                          {gamePage.name}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>
                        {gamePage?.name}{' '}
                        <Text style={{ color: '#aaa', fontSize: 11, fontWeight: 'normal' }}>
                          {gamePage?.first_release_date
                            ? new Date(gamePage.first_release_date * 1000).getFullYear()
                            : null
                          }
                        </Text>
                      </Text>
                      <Text style={{ color: '#aaa', fontSize: 12, fontWeight: 'bold' }}>
                        {gamePage?.involved_companies?.[0]?.company?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 1, backgroundColor: '#3e3e3eff', marginVertical: 3 }} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
                  {searchText ? 'No games found.' : 'Start typing to search games...'}
                </Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Name Edit Modal */}
      <Modal visible={nameModalVisible} animationType="slide" transparent={true} onRequestClose={() => setNameModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: 200 }]}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Edit Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#666"
              maxLength={50}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#484848ff' }]}
                onPress={() => {
                  setName(UserData?.name || '');
                  setNameModalVisible(false);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4a90e2' }]}
                onPress={() => setNameModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bio Edit Modal */}
      <Modal visible={bioModalVisible} animationType="slide" transparent={true} onRequestClose={() => setBioModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: 250 }]}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Edit Bio</Text>
            <TextInput
              style={[styles.textInput, { height: 100 }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#666"
              multiline
              maxLength={100}
            />
            <Text style={{ color: '#666', fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
              {bio.length}/100
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#484848ff' }]}
                onPress={() => {
                  setBio(UserData?.bio || '');
                  setBioModalVisible(false);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4a90e2' }]}
                onPress={() => setBioModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header with Update Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1 }}>Settings</Text>
        <TouchableOpacity
          onPress={handleUpdateUser}
          disabled={isUpdating}
          style={{
            backgroundColor: isUpdating ? '#666' : '#2771c7ff',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Update</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Picture and Name */}
        <View style={styles.profileHeader}>
          <View>
            <Image
              source={{ uri: UserData?.imageUrl || 'https://placehold.co/80x120' }}
              style={{ width: 120, height: 120, borderRadius: 60, borderColor: '#535353ff', borderWidth: 1 }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 20}}>
            <TouchableOpacity onPress={() => setNameModalVisible(true)}>
              <Text style={styles.displayText}>{name || 'Your Name'}</Text>
              <Text style={{ color: '#bcbcbc', fontSize: 12, marginTop: 4 }}>Edit Name</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={{ marginVertical: 16 }}>
          <Text style={{ color: '#bcbcbc', fontSize: 13, marginBottom: 4 }}>Bio</Text>
          <TouchableOpacity onPress={() => setBioModalVisible(true)}>
            <Text style={styles.bioText}>
              {bio || 'Add a bio...'}
            </Text>
            <Text style={{ color: '#bcbcbc', fontSize: 13, marginTop: 4 }}>Edit Bio</Text>
          </TouchableOpacity>
        </View>

        {/* Favorite Games Section */}
        <View style={{ marginVertical: 16 }}>
          <Text style={{ color: '#bcbcbc', fontSize: 13, marginBottom: 8 }}>Favorite Games</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[0, 1, 2, 3].map(idx => (
              <View key={idx} style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.favoriteGameSlot}
                  onPress={() => {
                    setSelectedFavoriteIndex(idx);
                    setModalVisible(true);
                  }}
                >
                  {fourFavorites[idx]?.game_cover_url ? (
                    <Image
                      source={{ uri: fourFavorites[idx].game_cover_url }}
                      style={{ width: 60, height: 80, borderRadius: 8 }}
                    />
                  ) : (
                    <Ionicons name="add" size={36} color="#bcbcbc" />
                  )}
                </TouchableOpacity>
                {fourFavorites[idx]?.game_cover_url && (
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(idx)}
                    style={{ marginTop: 4 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#404040',
    borderWidth: 1,
    borderColor: '#535353ff',
  },
  displayText: {
    color: '#f0f0f0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bioText: {
    color: '#f0f0f0',
    fontSize: 15,
    backgroundColor: '#232323',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
  },
  favoriteGameSlot: {
    width: 70,
    height: 90,
    backgroundColor: '#232323',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(3, 3, 3, 0.65)",
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: "#2f2f2fff",
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  secondaryModalView: {
    marginHorizontal: 20,
    backgroundColor: "#363636ff",
    borderRadius: 5,
    height: '80%',
    overflow: "hidden",
    },
  textInput: {
    backgroundColor: '#232323',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  displayImage: {
    width: 57,
    height: 84.873,
    borderColor: '#535353ff',
    backgroundColor: '#404040',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
  },
});