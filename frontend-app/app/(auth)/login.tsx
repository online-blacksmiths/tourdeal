import { ROUTES } from "@/constants/routes";
import { screen } from "@/styles/common";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Login() {
  return (
    <View style={screen.container}>
      <Text>Login</Text>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.SIGNUP}>Signup</Link>
    </View>
  );
}
