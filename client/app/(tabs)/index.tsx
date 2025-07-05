import { Text, View, StyleSheet, ScrollView ,Image} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Index() {
  type Art = { id: string | number; url: string };
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
      <View style={{ padding: 1 ,flexDirection: 'row', flexWrap: 'wrap',backgroundColor: 'black',justifyContent: 'center',}}>
        {arts.map((art) => (
          <>
          <Image
            key={art.id}
            source={{ uri: 'https:' + art.url.replace('t_thumb', 't_cover_big_2x') }}
            style={{ width: 85, height: 140, margin: 2 }}
            resizeMode="cover"
            />
            <Text style={{color: 'white', textAlign: 'center', width: 85}}>{art.url}</Text>
          </>
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