import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HomeHeader from '@/components/home/header'; // Komponen top bar yang tadi
import Dashboard from '@/components/home/dashboard'

export default function HomeScreen() {
  return (
    // 1. Background layar utama (warna hijau)
    <View style={styles.screenContainer}>
      
      {/* 2. Top Bar berada di dalam area hijau */}
      <HomeHeader />

      {/* 3. Kontainer Putih dengan sudut atas melengkung */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <Dashboard></Dashboard>
          {/* Sisa konten dashboard kamu di sini */}
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1b4d3e', // Warna background hijau tua keseluruhan layar
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // Warna putih untuk kartu utama
    borderTopLeftRadius: 30,    // Membuat lengkungan di kiri atas
    borderTopRightRadius: 30,   // Membuat lengkungan di kanan atas
    marginTop: 10,              // Beri sedikit jarak dari top bar (atau 0 agar langsung nempel)
    overflow: 'hidden',         // Memastikan konten di dalamnya ikut melengkung
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
