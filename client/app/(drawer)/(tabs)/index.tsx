import { View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  type Game = {
    id: number;
    cover: {
      id: number;
      url: string;
    };
    name: string;
    rating: number;
    screenshots: Array<{
      id: number;
      url: string;
    }>;
    involved_companies: Array<{
      id: number;
      company: {
        id: number;
        name: string;
      };
    }>;
    first_release_date:number;
    summary: string;
  };
  const [gamePages, setGamePages] = useState<Game[]>([]);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        //get the ip of the device running the server
        const ipAddress = process.env.ip_address||'';
        const response = await axios.get(`http://172.19.98.130:8000/posts/popular`);
        // Set arts from response
        setGamePages(response.data);
      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.view}>
    <FlatList
      data={gamePages}
      keyExtractor={(item) => item.id.toString()}
      numColumns={4}
      contentContainerStyle={styles.mainView}
      renderItem={({ item: gamePage }) => (
      <TouchableOpacity onPress={() => navigation.navigate('gameInfo', { gamePage })} key={gamePage.id}>
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
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
  },
  displayImage: {
    width: 85,
    height: 126.6,
    margin: 2.4,
    borderWidth: 1,
    borderColor: 'gray',
  }
})