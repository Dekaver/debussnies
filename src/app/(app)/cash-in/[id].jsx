import { cashOutTransactions, getCashOutTotal } from '@/data/cash-out';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function DetailRow({ label, value }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

export default function CashOutDetailPage() {
    const { id } = useLocalSearchParams();
    const transactionId = Array.isArray(id) ? id[0] : id;
    const transaction = cashOutTransactions.find((item) => item.id === transactionId);

    if (!transaction) {
        return (
            <View style={styles.screen}>
                <View style={styles.notFound}>
                    <Text style={styles.title}>Transaksi tidak ditemukan</Text>
                    <Link href="/cash-out" asChild>
                        <Pressable accessibilityRole="button">
                            <Text style={styles.backLink}>Kembali ke kas keluar</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        );
    }

    const total = getCashOutTotal(transaction);

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Link href="/cash-out" asChild>
                <Pressable style={styles.backButton} accessibilityRole="button">
                    <Text style={styles.backLink}>‹  Kembali ke kas keluar</Text>
                </Pressable>
            </Link>

            <View style={styles.summaryCard}>
                <Text style={styles.eyebrow}>Rincian pengeluaran</Text>
                <Text style={styles.summaryTitle}>{transaction.title}</Text>
                <Text style={styles.total}>-{formatCurrency(total)}</Text>
                <Text style={styles.summaryCaption}>
                    {formatDate(transaction.date)} · {transaction.time}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Informasi transaksi</Text>
                <DetailRow label="Kategori" value={transaction.category} />
                <DetailRow label="Dibayarkan kepada" value={transaction.merchant} />
                <DetailRow label="Metode pembayaran" value={transaction.paymentMethod} />
                <DetailRow label="Nomor referensi" value={transaction.reference} />
                <DetailRow label="Catatan" value={transaction.note} />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Rincian barang</Text>
                {transaction.items.map((item, index) => {
                    const itemTotal = item.quantity * item.unitPrice;

                    return (
                        <View
                            key={`${item.name}-${index}`}
                            style={[styles.itemRow, index === transaction.items.length - 1 && styles.lastItemRow]}
                        >
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemCalculation}>
                                    {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                                </Text>
                            </View>
                            <Text style={styles.itemTotal}>{formatCurrency(itemTotal)}</Text>
                        </View>
                    );
                })}
                <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>Total pengeluaran</Text>
                    <Text style={styles.grandTotal}>{formatCurrency(total)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        marginBottom: 12,
    },
    backLink: {
        color: '#1b4d3e',
        fontSize: 14,
        fontWeight: '600',
    },
    summaryCard: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#1b4d3e',
    },
    eyebrow: {
        color: '#d1e4dc',
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        marginTop: 6,
        color: '#0f172a',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    summaryTitle: {
        marginTop: 6,
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    total: {
        marginTop: 12,
        color: '#ffffff',
        fontSize: 26,
        fontWeight: '700',
    },
    summaryCaption: {
        marginTop: 5,
        color: '#d1e4dc',
        fontSize: 12,
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    card: {
        marginTop: 14,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionTitle: {
        marginBottom: 10,
        color: '#0f172a',
        fontSize: 15,
        fontWeight: '700',
    },
    detailRow: {
        paddingVertical: 9,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e2e8f0',
    },
    detailLabel: {
        color: '#64748b',
        fontSize: 12,
    },
    detailValue: {
        marginTop: 3,
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '500',
    },
    itemRow: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e2e8f0',
    },
    lastItemRow: {
        borderBottomWidth: 0,
    },
    itemDetails: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '500',
    },
    itemCalculation: {
        marginTop: 4,
        color: '#64748b',
        fontSize: 12,
    },
    itemTotal: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '600',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 14,
    },
    grandTotalLabel: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '600',
    },
    grandTotal: {
        color: '#b42318',
        fontSize: 14,
        fontWeight: '700',
    },
    notFound: {
        padding: 24,
    },
});
