import { StyleSheet, Text, View } from 'react-native';

const menus = [
    { id: '1', title: 'Home' },
    { id: '2', title: 'Profile' },
    { id: '3', title: 'Settings' },
];

export default function Dashboard() {
    return (
        <View style={styles.gridContainer}>
            {menus.map((menu) => (
                <View key={menu.id} style={styles.box}>
                    <Text style={styles.text1}>{menu.title}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Memungkinkan item turun ke baris berikutnya
        gap: 12, // Memberi jarak antar item secara horisontal & vertikal (didukung RN 0.71+)
    },
    box: {
        width: '48%', // Mengatur lebar item agar pas 2 kolom per baris
        height: 100,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    text1: {},
    text2: {},
});
