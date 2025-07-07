import { Text, View, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function GameInfo() {
    const route = useRoute();
    const { gamePage } = route.params || {};

    return (
        <ScrollView>
            <View style={{ backgroundColor: '#fff', justifyContent: 'center', }}>
                <Image
                    source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                    style={{
                        width: 200,
                        height: 280,
                        margin: 20,
                        borderWidth: 1,
                        borderColor: 'gray',
                    }}
                    resizeMode="cover"
                />
                <Text>

                {gamePage.name}
                {gamePage.summary}
                {gamePage.rating}
                {gamePage.cover.url}
                </Text>
            </View>
        </ScrollView>
    );
}