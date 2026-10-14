import { cashOutTransactions, getCashOutTotal } from '@/data/cash-out';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { Link } from 'expo-router';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

const sections = Object.entries(
    cashOutTransactions.reduce((groups, transaction) => {
        groups[transaction.date] ??= [];
        groups[transaction.date].push(transaction);
        return groups;
    }, {}),
)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([date, data]) => ({
        date,
        title: formatDate(date),
        data: data.sort((a, b) => b.time.localeCompare(a.time)),
    }));

export default function CashOutPage() {
    return (
        <View style={styles.screen}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>Transaksi</Text>
                    <Text style={styles.title}>Kas masuk</Text>
                    <Text style={styles.subtitle}>Pilih transaksi untuk melihat rincian pemasukan</Text>
                </View>

                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Belum ada transaksi kas masuk.</Text>}
                    renderSectionHeader={({ section }) => <Text style={styles.dateHeading}>{section.title}</Text>}
                    renderItem={({ item }) => (
                        <Link href={`/cash-out/${item.id}`} asChild>
                            <Pressable style={styles.card} accessibilityRole="button">
                                <View style={styles.cardTop}>
                                    <View style={styles.transactionDetails}>
                                        <Text style={styles.transactionTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.merchant} numberOfLines={1}>
                                            {item.merchant} · {item.time}
                                        </Text>
                                    </View>
                                    <Text style={styles.amount} numberOfLines={1}>
                                        -{formatCurrency(getCashOutTotal(item))}
                                    </Text>
                                </View>
                                <View style={styles.cardBottom}>
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryText}>{item.category}</Text>
                                    </View>
                                    <Text style={styles.itemCount}>{item.items.length} item</Text>
                                    <Text style={styles.chevron}>›</Text>
                                </View>
                            </Pressable>
                        </Link>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
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
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    eyebrow: {
        color: '#1b4d3e',
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        marginTop: 2,
        color: '#0f172a',
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 3,
        color: '#64748b',
        fontSize: 13,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    dateHeading: {
        marginTop: 8,
        marginBottom: 8,
        color: '#64748b',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    card: {
        marginBottom: 10,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transactionDetails: {
        flex: 1,
        marginRight: 10,
    },
    transactionTitle: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '600',
    },
    merchant: {
        marginTop: 4,
        color: '#64748b',
        fontSize: 12,
    },
    amount: {
        color: '#b42318',
        fontSize: 14,
        fontWeight: '700',
    },
    cardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    categoryBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
    },
    categoryText: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '500',
    },
    itemCount: {
        flex: 1,
        marginLeft: 9,
        color: '#64748b',
        fontSize: 12,
    },
    chevron: {
        color: '#94a3b8',
        fontSize: 24,
        lineHeight: 24,
    },
    emptyText: {
        paddingVertical: 20,
        color: '#64748b',
        fontSize: 14,
        textAlign: 'center',
    },
});
