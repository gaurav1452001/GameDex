import { View, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Text } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { router } from 'expo-router';
import { HomePageGameType } from '@/types/gameTypes';


export default function HomeScreen() {
  const [gamePages, setGamePages] = useState<HomePageGameType[]>([]);
  const [Offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const renderLoader = () => {
    if (!isLoading || !hasMoreData) return null;
    return (
      <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <ActivityIndicator size="large" color="#4692d0ff" />
      </View>
    )
  }

  const renderEndMessage = () => {
    if (hasMoreData || gamePages.length === 0) return null;
    return (
      <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 60 }}>
        <Text style={{ color: '#61d76fff', fontSize: 16 }}>You reached the end!</Text>
      </View>
    );
  };

  const loadMoreGames = () => {
    if (!isLoading && hasMoreData) {
      setOffset(Offset + 52);
    }
  }

  const fetchGames = async () => {
    if (isLoading) return; // Prevent multiple calls
    setIsLoading(true);
    try {
        const ip_Address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
        const response = await axios.get(`http://${ip_Address}:8000/posts/popular`, {
          params: {
            currentOffset: Offset,
          },
        });

        const newGames = response.data;
        
        // Check if we reached the end
        if (!newGames || newGames.length === 0 || newGames.length < 52) {
          setHasMoreData(false);
        }

        setGamePages((gamePages) => [...gamePages, ...newGames]);
    } catch (error) {
        console.error('Error fetching arts:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [Offset]);


  return (
    <View style={styles.view}>
      <FlatList
        data={gamePages}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={styles.mainView}
        renderItem={({ item: gamePage }) => (
          <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${gamePage.id}`)} key={gamePage.id}>
            <Image
              source={{ uri: 'https:' + gamePage?.cover?.url?.replace('t_thumb', 't_cover_big_2x') }}
              style={styles.displayImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <>
            {renderLoader()}
            {renderEndMessage()}
          </>
        )}
        onEndReached={loadMoreGames}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#181818',
  },
  button: {
    width: 100,
    height: 20,
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center"
  },
  mainView: {
    backgroundColor: '#232323',
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