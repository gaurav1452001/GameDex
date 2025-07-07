import { Text, View, StyleSheet, ScrollView ,Image} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  type Art = {
    id: number;
    cover: {
      id: number;
      url: string;
    };
    name: string;
    rating: number;
  };
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await axios.get('http://172.19.97.212:8000/posts');
        // Set arts from response
        setArts(response.data.arts);
        console.log(arts);
      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();
  }, []);
  
  return (
      <ScrollView>
      <View style={{ backgroundColor: '#232323' ,flexDirection: 'row', flexWrap: 'wrap',justifyContent: 'center',}}>
        {arts.map((art) => (
          <Image
            key={art.id}
            source={{ uri: 'https:' + art.cover.url.replace('t_thumb', 't_cover_big_2x') }}
            style={{
              width: 85,
              height: 115.6,
              margin: 2.4,
              borderWidth: 1,
              borderColor: 'gray',
            }}
            resizeMode="cover"
          />
        ))}
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 20,
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center"
  }
})