import "@/global.css";

import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAxiosInstance } from "@/utils/instance";

export default function RootLayout() {
  useAxiosInstance();
  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
      </Stack>
    </GluestackUIProvider>
  );
}
