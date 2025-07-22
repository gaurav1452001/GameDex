import { Slot, Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot/>
    </GestureHandlerRootView>
  );
}