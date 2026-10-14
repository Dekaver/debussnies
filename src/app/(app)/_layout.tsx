import HomeHeader from '@/components/home/header';
import { CashOutProvider } from '@/data/cash-out-context';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CashOutProvider>
                <Drawer
                    screenOptions={{
                        header: () => <HomeHeader />,
                        headerTransparent: false,
                        drawerActiveTintColor: '#1b4d3e',
                        drawerActiveBackgroundColor: '#e8f1ed',
                        drawerInactiveTintColor: '#64748b',
                        drawerLabelStyle: { fontWeight: '600' },
                        drawerItemStyle: { borderRadius: 10, marginHorizontal: 10 },
                        headerShadowVisible: true,
                    }}
                >
                    <Drawer.Screen
                        name="home"
                        options={{
                            title: 'Beranda',
                            drawerLabel: 'Beranda',
                            drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                        }}
                    />

                    <Drawer.Screen
                        name="cash-in"
                        options={{
                            title: 'Kas masuk',
                            drawerLabel: 'Kas masuk',
                            drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
                        }}
                    />
                    <Drawer.Screen
                        name="cash-out"
                        options={{
                            title: 'Kas keluar',
                            drawerLabel: 'Kas keluar',
                            drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
                        }}
                    />
                    <Drawer.Screen
                        name="cash-out/add"
                        options={{
                            title: 'Tambah kas keluar',
                            drawerItemStyle: { display: 'none' },
                        }}
                    />
                    <Drawer.Screen
                        name="cash-out/[id]"
                        options={{
                            title: 'Detail kas keluar',
                            drawerItemStyle: { display: 'none' },
                        }}
                    />
                    <Drawer.Screen
                        name="cash-in/[id]"
                        options={{
                            title: 'Detail kas masuk',
                            drawerItemStyle: { display: 'none' },
                        }}
                    />
                    <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' } }} />
                </Drawer>
            </CashOutProvider>
        </SafeAreaView>
    );
}
