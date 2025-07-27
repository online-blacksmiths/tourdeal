import "@/global.css";

import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAxiosInstance } from "@/utils/instance";
import { QueryProvider } from "@/providers/react-query";

export default function RootLayout() {
  useAxiosInstance();
  return (
    <GluestackUIProvider mode="light">
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/signup" />
        </Stack>
      </QueryProvider>
    </GluestackUIProvider>
  );
}
