import Dashboard from '@/components/home/dashboard';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        // 1. Background layar utama (warna hijau)
        <View style={styles.screenContainer}>
            {/* 3. Kontainer Putih dengan sudut atas melengkung */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <Dashboard />
                    {/* Sisa konten dashboard kamu di sini */}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#0bcc48',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff', // Warna putih untuk kartu utama
        borderTopLeftRadius: 20, // Membuat lengkungan di kiri atas
        borderTopRightRadius: 20, // Membuat lengkungan di kanan atas
        overflow: 'hidden', // Memastikan konten di dalamnya ikut melengkung
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000000',
    },
});
