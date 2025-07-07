// import { Tabs } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ProfileScreen from './login';
const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
      tabBarStyle: { backgroundColor: '#181818' },
      tabBarLabelStyle: { color: '#fff' },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen name="Games" component={HomeScreen} options={{ title: "Games" }} />
      <Tab.Screen name="Reviews" component={ProfileScreen} options={{ title: "Reviews" }} />
      <Tab.Screen name="Lists" component={ProfileScreen} options={{ title: "Lists" }} />
      <Tab.Screen name="News" component={ProfileScreen} options={{ title: "News" }} />
    </Tab.Navigator>
  );
}

// export default function TabsLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen name="index" options={{ title:"Home"}} />
//       <Tabs.Screen name="login" options={{ title:"Login"}} />
//     </Tabs>
//   );
// }
