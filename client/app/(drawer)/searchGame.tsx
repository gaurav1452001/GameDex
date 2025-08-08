import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, FlatList, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { router } from 'expo-router'
import { SearchGameType } from '@/types/gameTypes'


export default function SearchGame() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation();
  
  useEffect(() => {
    const handleBackPress = () => {
      setSearchQuery("");
      navigation.goBack();
      return true; 
    };
    
    const unsubscribeFocus = navigation.addListener('focus', () => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      
      const unsubscribeBlur = navigation.addListener('blur', () => {
        backHandler.remove();
      });
      
      return unsubscribeBlur;
    });

    return unsubscribeFocus;
  }, [navigation]);

  const [gamePages, setGamePages] = useState<SearchGameType[]>([]);

  useEffect(() => {
    const fetchArts = async () => {

      try {
        const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
        const response = await axios.get(`http://${ip_address}:8000/posts/search`, {
          params: {
            searchText: searchQuery
          }
        });
        setGamePages(response.data);
      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => { setSearchQuery(""); navigation.goBack() }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#666"
          autoCapitalize='none'
          autoFocus={true}
          autoCorrect={false}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => {
            if (searchQuery.trim()) {
              console.log('Searching for:', searchQuery)
            }
          }}
          returnKeyType="search"
        />
      </View>
      <View style={styles.view}>
        <FlatList
          data={gamePages}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainView}
          renderItem={({ item: gamePage }) => (
            <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${gamePage.id}`)} key={gamePage.id}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {gamePage.cover?.url ? (
                  <Image
                    source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                    style={styles.displayImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.displayImage}>
                    <Text style={{ color: '#f0f0f0', fontSize: 10, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }}>
                      {gamePage.name}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{gamePage?.name}</Text>
                  <Text style={{ color: '#aaa', fontSize: 12, fontWeight: 'bold' }}>
                    {gamePage?.involved_companies?.[0]?.company?.name}
                    {gamePage?.involved_companies?.length > 1 && ', '}
                    {gamePage?.involved_companies?.[1]?.company?.name}
                  </Text>
                  <Text style={{ color: '#aaa', fontSize: 12 }}>
                    {gamePage?.first_release_date
                      ? new Date(gamePage?.first_release_date * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      : null
                    }
                  </Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: '#333', marginVertical: 15 }} />
            </TouchableOpacity>
          )}
        />
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#181818',
    padding: 16,
  },
  mainView: {
    backgroundColor: '#181818',
    flexDirection: 'column',
    justifyContent: 'center',
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 25,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    color: '#fff',
    fontSize: 15,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#333',
  },
  tabContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00d4aa',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  searchItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchTerm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  categoryTag: {
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
})
