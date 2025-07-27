import { ROUTES } from "@/constants/routes";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Login</Text>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.SIGNUP}>Signup</Link>
    </View>
  );
}
