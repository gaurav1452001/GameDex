import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsScreen from './DetailsScreen';
import MediaScreen from './MediaScreen';
import RelatedScreen from './RelatedScreen';
import ReleasesScreen from './ReleasesScreen';
import { StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function GamePageTopTab() {

    return (

        <Tab.Navigator
            screenOptions={{
                tabBarItemStyle: { width: 'auto' },
                tabBarStyle: {
                    backgroundColor: '#181818', borderBottomWidth: 1,
                    borderBottomColor: '#333'
                },
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#666',
                tabBarIndicatorStyle: { backgroundColor: '#54e868ff', },
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 14 },
                lazy: true,
            }}
        >
            <Tab.Screen name="DETAILS" component={DetailsScreen} />
            <Tab.Screen name="MEDIA" component={MediaScreen} />
            <Tab.Screen name="RELATED" component={RelatedScreen} />
            <Tab.Screen name="RELEASES" component={ReleasesScreen} />

        </Tab.Navigator>

    );
}

const styles = StyleSheet.create({
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 20,
        marginHorizontal: -16
    },
});