import { View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { HomePageGameType } from '@/types/gameTypes';


export default function HomeScreen() {
  const animation = useRef<LottieView>(null);
  const [gamePages, setGamePages] = useState<HomePageGameType[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchArts = async () => {
      setIsLoading(true);
      try {
        //get the ip of the device running the server
        const ip_Address = process.env.EXPO_PUBLIC_IP_ADDRESS||'';
        const response = await axios.get(`http://${ip_Address}:8000/posts/popular`);
        // Set arts from response
        setGamePages(response.data);
      } catch (error) {
        console.error('Error fetching arts:', error);
      } finally{
        setIsLoading(false);
      }
    };

    fetchArts();
  }, []);

  if (isLoading) {
          return (
              <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <LottieView
                      autoPlay
                      ref={animation}
                      style={{
                          width: 200,
                          height: 200,
                          backgroundColor: '#181818',
                      }}
                      source={require('../../../assets/animations/loading2.json')}
                  />
              </View>
          );
  }

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