// import { Tabs } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ProfileScreen from './login';
const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
      tabBarItemStyle: { width: 80 },
      tabBarStyle: { backgroundColor: '#181818' },
      tabBarLabelStyle: { color: '#fff',fontSize: 15 },
      tabBarActiveTintColor: '#fff',
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
