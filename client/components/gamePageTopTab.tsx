import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

// Simple placeholder components for each tab
function AboutScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>About content will go here</Text>
        </View>
    );
}

function CommunityScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>Community content will go here</Text>
        </View>
    );
}

function MediaScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>Media content will go here</Text>
        </View>
    );
}

function RelatedScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>Related content will go here</Text>
        </View>
    );
}

function ReleasesScreen() {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabText}>Releases content will go here</Text>
        </View>
    );
}

export default function GamePageTopTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarItemStyle: { width: 'auto' },
                tabBarStyle: { backgroundColor: '#181818' },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#666',
                tabBarIndicatorStyle: { backgroundColor: '#54e868ff' },
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 14},
            }}
        >
            <Tab.Screen name="ABOUT" component={AboutScreen} />
            <Tab.Screen name="COMMUNITY" component={CommunityScreen} />
            <Tab.Screen name="MEDIA" component={MediaScreen} />
            <Tab.Screen name="RELATED" component={RelatedScreen} />
            <Tab.Screen name="RELEASES" component={ReleasesScreen} />
        </Tab.Navigator>
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