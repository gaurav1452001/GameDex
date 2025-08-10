// import { Tabs } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ReviewsScreen from './global_reviews';
import ListsScreen from './global_lists';
import GamingEvents from './gaming_events';
const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
      tabBarItemStyle: { flex: 1 },
      tabBarStyle: { backgroundColor: '#0b0b0bff' },
      tabBarLabelStyle: { color: '#fff', fontSize: 13, letterSpacing: 0.5 },
      tabBarActiveTintColor: '#ffffffff',
      tabBarIndicatorStyle: { backgroundColor: '#4692d0ff' },
      }}
    >
      <Tab.Screen name="Games" component={HomeScreen} options={{ title: "GAMES" }} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} options={{ title: "REVIEWS" }} />
      <Tab.Screen name="Lists" component={ListsScreen} options={{ title: "LISTS" }} />
      <Tab.Screen name="GamingEvents" component={GamingEvents} options={{ title: "EVENTS" }} />
    </Tab.Navigator>
  );
}

