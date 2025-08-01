import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutScreen from './AboutScreen';
import CommunityScreen from './CommunityScreen';
import MediaScreen from './MediaScreen';
import RelatedScreen from './RelatedScreen';
import ReleasesScreen from './ReleasesScreen';

const Tab = createMaterialTopTabNavigator();

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