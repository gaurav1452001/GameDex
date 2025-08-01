import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux/store'

export default function AboutScreen() {
    const count = useSelector((state: RootState) => state.counter.value)
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>About content will go here</Text>
            <Text style={styles.tabText}>Counter Value: {count}</Text>
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
