import { Stack } from "expo-router";

import { SessionProvider, useSession } from "@/ctx";
import { SplashScreenController } from "@/splash";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuthStore } from "../../stores/useAuthStore";

function RootNavigator() {
	const { session, isLoading } = useSession();

	if (isLoading) {
		return (
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		);
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="(app)" />
			</Stack.Protected>

			<Stack.Protected guard={!session}>
				<Stack.Screen name="sign-in" />
			</Stack.Protected>
		</Stack>
	);
}

export default function Root() {
	const isLoading = useAuthStore((state) => state.isLoading);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializeAuth = useAuthStore((state) => state.initializeAuth);

	// Jalankan pengecekan token saat aplikasi pertama kali dibuka
	useEffect(() => {
		initializeAuth();
	}, []);

	// 1. Tampilkan Loading Screen selama SecureStore sedang membaca data (beberapa milidetik)
	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text style={{ marginTop: 10 }}>Memuat Sesi...</Text>
			</View>
		);
	}

	// Set up the auth context and render your layout inside of it.
	return (
		<SessionProvider>
			<SplashScreenController />
			<RootNavigator />
		</SessionProvider>
	);
}
