import {
    StyleSheet,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoggerButton() {
    
    return (
        <View style={styles.view}>
            <Ionicons name="add-outline" size={25} color="white" />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#3eb92dff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: 55,
        height: 55,
    }
});
