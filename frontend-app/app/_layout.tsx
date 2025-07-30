import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryProvider } from "@/providers/react-query";
import { useAxiosInstance } from "@/utils/instance";

export default function RootLayout() {
  useAxiosInstance();

  const [loaded, error] = useFonts({
    PretendardVariable: require("@/assets/fonts/PretendardVariable.ttf"),
  });

  console.log(loaded);

  if (!loaded) return null;

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
