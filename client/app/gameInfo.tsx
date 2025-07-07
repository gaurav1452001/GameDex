import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GameInfo() {
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
            <View style={{ backgroundColor: '#232323', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}>
                

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