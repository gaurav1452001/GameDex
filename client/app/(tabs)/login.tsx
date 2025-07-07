import {Text,View, Button, Image} from "react-native";
export default function ProfileScreen() {
  return ( 
    <View
      style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      }}
    >
      <Image
      source={require('../../assets/images/login_screen_image.png')}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      resizeMode="cover"
      />
      <Button title="Go to Home" onPress={() => console.log("Navigate to Home")} />
    </View>
  );
}