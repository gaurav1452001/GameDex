// import { Tabs } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ProfileScreen from './login';
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
      <Tab.Screen name="Reviews" component={ProfileScreen} options={{ title: "REVIEWS" }} />
      <Tab.Screen name="Lists" component={ProfileScreen} options={{ title: "LISTS" }} />
      <Tab.Screen name="News" component={ProfileScreen} options={{ title: "NEWS" }} />
    </Tab.Navigator>
  );
}

