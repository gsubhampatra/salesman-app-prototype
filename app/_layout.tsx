import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { Provider as TinyBaseProvider } from "tinybase/ui-react";


export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  });

  return (
    <TinyBaseProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }} >;
          <Stack.Screen name="(auth)/login" options={{ presentation: "card" }} />
        </Stack >
      </QueryClientProvider>
    </TinyBaseProvider>
  )
}
