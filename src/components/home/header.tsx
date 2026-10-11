import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Contoh jika pakai Expo untuk ikon lonceng

export default function HomeHeader() {
  return (
    <View style={styles.headerContainer}>
      {/* Bagian Kiri: Logo & Nama Aplikasi */}
      <View style={styles.leftSection}>
        {/* Ganti dengan komponen logo atau gambar kamu */}
        <View style={styles.logoPlaceholder}>
          <Ionicons name="leaf" size={20} color="#1b4d3e" />
        </View>
        <Text style={styles.appTitle}>My Wisdom</Text>
      </View>

      {/* Bagian Kanan: Tombol Notifikasi & Profil */}
      <View style={styles.rightSection}>
        {/* Tombol Notifikasi */}
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="notifications" size={18} color="#ffffff" />
        </TouchableOpacity>

        {/* Foto Profil */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }} 
          style={styles.profileImage} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    // Sesuaikan background dengan tema halaman (misal: warna hijau tua seperti di gambar)
    backgroundColor: '#1b4d3e', 
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Jarak antara logo dan teks (pastikan React Native kamu mendukung gap, atau pakai marginRight)
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Efek transparan semi-transparan (glassmorphism tipis)
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
