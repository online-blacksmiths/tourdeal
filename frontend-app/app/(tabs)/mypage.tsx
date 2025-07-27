import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { ROUTES } from "@/constants/routes";

export default function MyPage() {
  // TODO 로그인 체크 필요
  const isLoggedIn = false;
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>MyPage</Text>
    </View>
  );
}
