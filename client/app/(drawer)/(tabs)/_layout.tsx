// import { Tabs } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ReviewsScreen from './global_reviews';
import ListsScreen from './global_lists';
const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
      tabBarItemStyle: { width: 'auto' },
      tabBarStyle: { backgroundColor: '#181818' },
      tabBarLabelStyle: { color: '#fff',fontSize: 14 },
      tabBarActiveTintColor: '#fff',
      }}
    >
      <Tab.Screen name="Games" component={HomeScreen} options={{ title: "GAMES" }} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} options={{ title: "REVIEWS" }} />
      <Tab.Screen name="Lists" component={ListsScreen} options={{ title: "LISTS" }} />
    </Tab.Navigator>
  );
}

