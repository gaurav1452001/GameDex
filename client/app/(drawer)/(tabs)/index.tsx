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
  const [sortOrder, setSortOrder] = useState(2);

  const renderLoader = () => {
    // if (!isLoading || !hasMoreData) return null;
    return (
      <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <ActivityIndicator size="large" color="#4692d0ff" />
        <Text style={{ color: '#61d76fff', fontSize: 13, marginTop: 10 }}>
          Loading more games...
        </Text>
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
            sortOrder: sortOrder,
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
  }, [Offset, sortOrder]);


  return (
    <View style={styles.view}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 3,paddingVertical:5,gap:4, backgroundColor: '#181818', }}>
        <TouchableOpacity
          onPress={() => { setGamePages([]); setSortOrder(2); }}
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingVertical: 5,
            marginHorizontal: 2,
            backgroundColor: sortOrder === 2 ? '#2e3d27' : '#2d2d2dff',
            borderRadius: 6,
            borderWidth: sortOrder === 2 ? 2 : 0,
            borderColor: sortOrder === 2 ? '#61d76f' : 'transparent',
          }}
        >
          <Text style={{
            color: sortOrder === 2 ? '#61d76f' : '#fff',
            textAlign: 'center',
            fontSize: 10,
          }}>
            Want To Play
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setGamePages([]); setSortOrder(3); }}
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingVertical: 5,
            marginHorizontal: 2,
            backgroundColor: sortOrder === 3 ? '#2e3d27' : '#2d2d2dff',
            borderRadius: 6,
            borderWidth: sortOrder === 3 ? 2 : 0,
            borderColor: sortOrder === 3 ? '#61d76f' : 'transparent',
          }}
        >
          <Text style={{
            color: sortOrder === 3 ? '#61d76f' : '#fff',
            textAlign: 'center',
            fontSize: 10,
          }}>
            Playing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setGamePages([]); setSortOrder(4); }}
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingVertical: 5,
            marginHorizontal: 2,
            backgroundColor: sortOrder === 4 ? '#2e3d27' : '#2d2d2dff',
            borderRadius: 6,
            borderWidth: sortOrder === 4 ? 2 : 0,
            borderColor: sortOrder === 4 ? '#61d76f' : 'transparent',
          }}
        >
          <Text style={{
            color: sortOrder === 4 ? '#61d76f' : '#fff',
            textAlign: 'center',
            fontSize: 10,
          }}>
            Played
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setGamePages([]); setSortOrder(5); }}
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingVertical: 5,
            marginHorizontal: 2,
            backgroundColor: sortOrder === 5 ? '#2e3d27' : '#2d2d2dff',
            borderRadius: 6,
            borderWidth: sortOrder === 5 ? 2 : 0,
            borderColor: sortOrder === 5 ? '#61d76f' : 'transparent',
          }}
        >
          <Text style={{
            color: sortOrder === 5 ? '#61d76f' : '#fff',
            textAlign: 'center',
            fontSize: 10,
          }}>
            24hr Peak Players
          </Text>
        </TouchableOpacity>
      </View>
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