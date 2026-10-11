import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Sembunyikan header untuk semua router utama, termasuk group (drawer) */}
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
