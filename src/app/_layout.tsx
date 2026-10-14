import { Stack } from 'expo-router';

import { SessionProvider, useSession } from '@/ctx';
import { SplashScreenController } from '@/splash';

function RootNavigator() {
    const { session } = useSession();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Protected guard={!session}>
                <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Protected guard={!!session}>
                <Stack.Screen name="sign-in" />
            </Stack.Protected>
        </Stack>
    );
}

export default function Root() {
    // Set up the auth context and render your layout inside of it.
    return (
        <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
        </SessionProvider>
    );
}
