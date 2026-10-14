import { useCashOutTransactions } from '@/data/cash-out-context';
import type { CashOutItem, CashOutTransaction } from '@/data/cash-out';
import { formatCurrency } from '@/utils/currency';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type ItemDraft = {
    name: string;
    quantity: string;
    unit: string;
    unitPrice: string;
};

type FormDraft = {
    title: string;
    category: string;
    merchant: string;
    paymentMethod: string;
    reference: string;
    note: string;
};

function getLocalDateAndTime() {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');

    return {
        date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    };
}

function isValidDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    multiline = false,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad';
    multiline?: boolean;
}) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                accessibilityLabel={label}
                style={[styles.input, multiline && styles.multilineInput]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
}

export default function AddCashOutPage() {
    const { addTransaction } = useCashOutTransactions();
    const initialDateTime = getLocalDateAndTime();
    const [date, setDate] = useState(initialDateTime.date);
    const [time, setTime] = useState(initialDateTime.time);
    const [form, setForm] = useState<FormDraft>({
        title: '',
        category: '',
        merchant: '',
        paymentMethod: '',
        reference: '',
        note: '',
    });
    const [items, setItems] = useState<ItemDraft[]>([
        { name: '', quantity: '1', unit: '', unitPrice: '' },
    ]);
    const [error, setError] = useState('');

    const total = items.reduce((sum, item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        return sum + (Number.isFinite(quantity) && Number.isFinite(unitPrice) ? quantity * unitPrice : 0);
    }, 0);

    const updateForm = (key: keyof FormDraft, value: string) => {
        setError('');
        setForm((current) => ({ ...current, [key]: value }));
    };

    const updateItem = (index: number, key: keyof ItemDraft, value: string) => {
        setError('');
        setItems((current) => current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [key]: value } : item,
        ));
    };

    const saveTransaction = () => {
        const requiredFields = [
            ['judul transaksi', form.title],
            ['kategori', form.category],
            ['penerima/vendor', form.merchant],
            ['metode pembayaran', form.paymentMethod],
            ['tanggal', date],
            ['waktu', time],
        ];
        const missingField = requiredFields.find(([, value]) => !value.trim());
        if (missingField) {
            setError(`Mohon isi ${missingField[0]}.`);
            return;
        }
        if (!isValidDate(date.trim())) {
            setError('Tanggal harus menggunakan format YYYY-MM-DD yang valid.');
            return;
        }
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim())) {
            setError('Waktu harus menggunakan format 24 jam HH:mm yang valid.');
            return;
        }

        const parsedItems: CashOutItem[] = [];
        for (const [index, item] of items.entries()) {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unitPrice);
            if (
                !item.name.trim() ||
                !item.unit.trim() ||
                !item.quantity.trim() ||
                !item.unitPrice.trim() ||
                !Number.isFinite(quantity) ||
                quantity <= 0 ||
                !Number.isFinite(unitPrice) ||
                unitPrice <= 0
            ) {
                setError(`Lengkapi nama, jumlah, satuan, dan harga item ${index + 1} dengan nilai yang valid.`);
                return;
            }

            parsedItems.push({
                name: item.name.trim(),
                quantity,
                unit: item.unit.trim(),
                unitPrice,
            });
        }

        const transaction: CashOutTransaction = {
            id: `kas-keluar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            date: date.trim(),
            time: time.trim(),
            title: form.title.trim(),
            category: form.category.trim(),
            merchant: form.merchant.trim(),
            paymentMethod: form.paymentMethod.trim(),
            reference: form.reference.trim(),
            note: form.note.trim(),
            items: parsedItems,
        };

        addTransaction(transaction);
        router.replace('/cash-out');
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                >
                    <Text style={styles.backText}>‹  Kembali ke kas keluar</Text>
                </Pressable>

                <View style={styles.header}>
                    <Text style={styles.eyebrow}>Transaksi baru</Text>
                    <Text style={styles.title}>Tambah kas keluar</Text>
                    <Text style={styles.subtitle}>Isi informasi pengeluaran dan rincian barang.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Informasi transaksi</Text>
                    <FormField
                        label="Judul transaksi"
                        value={form.title}
                        onChangeText={(value) => updateForm('title', value)}
                        placeholder="Contoh: Belanja bulanan"
                    />
                    <FormField
                        label="Kategori"
                        value={form.category}
                        onChangeText={(value) => updateForm('category', value)}
                        placeholder="Contoh: Operasional"
                    />
                    <FormField
                        label="Dibayarkan kepada"
                        value={form.merchant}
                        onChangeText={(value) => updateForm('merchant', value)}
                        placeholder="Nama toko atau penerima"
                    />
                    <FormField
                        label="Metode pembayaran"
                        value={form.paymentMethod}
                        onChangeText={(value) => updateForm('paymentMethod', value)}
                        placeholder="Contoh: Tunai atau transfer bank"
                    />
                    <View style={styles.inlineFields}>
                        <View style={styles.inlineField}>
                            <FormField
                                label="Tanggal (YYYY-MM-DD)"
                                value={date}
                                onChangeText={(value) => {
                                    setError('');
                                    setDate(value);
                                }}
                                placeholder="2026-10-14"
                            />
                        </View>
                        <View style={styles.inlineField}>
                            <FormField
                                label="Waktu (HH:mm)"
                                value={time}
                                onChangeText={(value) => {
                                    setError('');
                                    setTime(value);
                                }}
                                placeholder="09:35"
                            />
                        </View>
                    </View>
                    <FormField
                        label="Nomor referensi (opsional)"
                        value={form.reference}
                        onChangeText={(value) => updateForm('reference', value)}
                        placeholder="Nomor bukti atau referensi"
                    />
                    <FormField
                        label="Catatan (opsional)"
                        value={form.note}
                        onChangeText={(value) => updateForm('note', value)}
                        placeholder="Keterangan tambahan"
                        multiline
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Rincian barang</Text>
                    {items.map((item, index) => (
                        <View key={index} style={styles.itemCard}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>Item {index + 1}</Text>
                                {items.length > 1 && (
                                    <Pressable
                                        onPress={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Hapus item ${index + 1}`}
                                    >
                                        <Text style={styles.removeText}>Hapus</Text>
                                    </Pressable>
                                )}
                            </View>
                            <FormField
                                label="Nama barang"
                                value={item.name}
                                onChangeText={(value) => updateItem(index, 'name', value)}
                                placeholder="Contoh: Beras premium"
                            />
                            <View style={styles.inlineFields}>
                                <View style={styles.inlineField}>
                                    <FormField
                                        label="Jumlah"
                                        value={item.quantity}
                                        onChangeText={(value) => updateItem(index, 'quantity', value)}
                                        keyboardType="decimal-pad"
                                        placeholder="1"
                                    />
                                </View>
                                <View style={styles.inlineField}>
                                    <FormField
                                        label="Satuan"
                                        value={item.unit}
                                        onChangeText={(value) => updateItem(index, 'unit', value)}
                                        placeholder="pcs, kg, liter"
                                    />
                                </View>
                            </View>
                            <FormField
                                label="Harga satuan (Rp)"
                                value={item.unitPrice}
                                onChangeText={(value) => updateItem(index, 'unitPrice', value)}
                                keyboardType="numeric"
                                placeholder="15000"
                            />
                        </View>
                    ))}

                    <Pressable
                        style={styles.addItemButton}
                        onPress={() => setItems((current) => [
                            ...current,
                            { name: '', quantity: '1', unit: '', unitPrice: '' },
                        ])}
                        accessibilityRole="button"
                    >
                        <Text style={styles.addItemText}>+ Tambah item</Text>
                    </Pressable>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total pengeluaran</Text>
                        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                    </View>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={styles.saveButton}
                    onPress={saveTransaction}
                    accessibilityRole="button"
                >
                    <Text style={styles.saveButtonText}>Simpan kas keluar</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 20,
        paddingBottom: 36,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        marginBottom: 12,
    },
    backText: {
        color: '#1b4d3e',
        fontSize: 14,
        fontWeight: '600',
    },
    header: {
        marginBottom: 14,
    },
    eyebrow: {
        color: '#1b4d3e',
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        marginTop: 3,
        color: '#0f172a',
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 4,
        color: '#64748b',
        fontSize: 13,
    },
    card: {
        marginBottom: 14,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionTitle: {
        marginBottom: 14,
        color: '#0f172a',
        fontSize: 15,
        fontWeight: '700',
    },
    field: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 6,
        color: '#334155',
        fontSize: 12,
        fontWeight: '600',
    },
    input: {
        minHeight: 44,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 9,
        color: '#0f172a',
        fontSize: 14,
        backgroundColor: '#ffffff',
    },
    multilineInput: {
        minHeight: 82,
        paddingTop: 11,
    },
    inlineFields: {
        flexDirection: 'row',
        gap: 10,
    },
    inlineField: {
        flex: 1,
    },
    itemCard: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemTitle: {
        color: '#0f172a',
        fontSize: 13,
        fontWeight: '700',
    },
    removeText: {
        color: '#b42318',
        fontSize: 12,
        fontWeight: '600',
    },
    addItemButton: {
        alignItems: 'center',
        padding: 11,
        borderWidth: 1,
        borderColor: '#1b4d3e',
        borderRadius: 9,
    },
    addItemText: {
        color: '#1b4d3e',
        fontSize: 13,
        fontWeight: '600',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cbd5e1',
    },
    totalLabel: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '600',
    },
    totalValue: {
        color: '#b42318',
        fontSize: 15,
        fontWeight: '700',
    },
    errorText: {
        marginBottom: 12,
        color: '#b42318',
        fontSize: 13,
    },
    saveButton: {
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#1b4d3e',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
});
