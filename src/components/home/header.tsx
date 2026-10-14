import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSegments } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const titles: Record<string, string> = {
    'cash-in': 'Kas Masuk',
    'cash-out': 'Kas Keluar',
    profile: 'Profil Pengguna',
    settings: 'Pengaturan',
};

export default function HomeHeader() {
    const segments = useSegments();
    const currentRoute = segments[segments.length - 1] ?? 'index';
    const title = titles[currentRoute] ?? 'My App';

    console.log('Current title:', title);
    return (
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#1b4d3e' }}>
            <LinearGradient colors={['#1b4d3e', '#0bcc48']} style={styles.headerContainer}>
                <View style={styles.leftSection}>
                    <DrawerToggleButton tintColor="#ffffff" />
                    {/* <View style={styles.logoPlaceholder}> <Ionicons name="leaf" size={20} color="#1b4d3e" /> </View> */}
                    <Text style={styles.appTitle}>{title}</Text>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <Ionicons name="notifications" size={18} color="#ffffff" />
                    </TouchableOpacity>

                    <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }} style={styles.profileImage} />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#1b4d3e',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
});
