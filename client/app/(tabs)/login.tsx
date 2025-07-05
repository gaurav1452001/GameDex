import {Text,View, Button} from "react-native";
export default function Login() {
  return ( 
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login Screen</Text>  
      <Button title="Go to Home" onPress={() => console.log("Navigate to Home")} />
    </View>
  );
}