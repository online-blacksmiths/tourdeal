import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="/" options={{ title: "Home" }} />
      <Tabs.Screen name="/mypage" options={{ title: "MyPage" }} />
    </Tabs>
  );
}
