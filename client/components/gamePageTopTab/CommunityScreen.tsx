import { View, Text, StyleSheet } from 'react-native';

export default function CommunityScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>Community content will go here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        backgroundColor: '#181818',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    tabText: {
        color: '#fff',
        fontSize: 16,
    },
});
