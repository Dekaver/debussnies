export interface CashOutItem {
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
}

export interface CashOutTransaction {
    id: string;
    date: string;
    time: string;
    title: string;
    category: string;
    merchant: string;
    paymentMethod: string;
    reference: string;
    note: string;
    items: CashOutItem[];
}

export const cashOutTransactions: CashOutTransaction[] = [
    {
        id: 'belanja-bulanan',
        date: '2026-10-14',
        time: '09:35',
        title: 'Belanja bulanan',
        category: 'Kebutuhan rumah tangga',
        merchant: 'Toko Sembako Makmur',
        paymentMethod: 'Tunai',
        reference: 'KK-2026-014',
        note: 'Persediaan kebutuhan dapur untuk bulan ini.',
        items: [
            { name: 'Beras premium', quantity: 5, unit: 'kg', unitPrice: 15000 },
            { name: 'Minyak goreng', quantity: 2, unit: 'liter', unitPrice: 18000 },
            { name: 'Gula pasir', quantity: 2, unit: 'kg', unitPrice: 17000 },
            { name: 'Telur ayam', quantity: 2, unit: 'kg', unitPrice: 29000 },
            { name: 'Kopi bubuk', quantity: 2, unit: 'bungkus', unitPrice: 12000 },
        ],
    },
    {
        id: 'tagihan-listrik',
        date: '2026-10-13',
        time: '16:20',
        title: 'Tagihan listrik',
        category: 'Utilitas',
        merchant: 'PLN',
        paymentMethod: 'Transfer bank',
        reference: 'PLN-1026-8831',
        note: 'Pembayaran tagihan listrik bulan Oktober.',
        items: [
            { name: 'Token / tagihan listrik', quantity: 1, unit: 'tagihan', unitPrice: 425000 },
        ],
    },
    {
        id: 'ongkos-kirim',
        date: '2026-10-12',
        time: '11:05',
        title: 'Ongkos pengiriman',
        category: 'Operasional',
        merchant: 'Kurir Jaya',
        paymentMethod: 'Tunai',
        reference: 'KJ-1026-019',
        note: 'Pengiriman pesanan ke pelanggan.',
        items: [
            { name: 'Pengiriman paket', quantity: 3, unit: 'paket', unitPrice: 12000 },
        ],
    },
];

export const getCashOutTotal = (transaction: CashOutTransaction) =>
    transaction.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
