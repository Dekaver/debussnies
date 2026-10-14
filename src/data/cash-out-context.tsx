import type { PropsWithChildren } from 'react';
import { createContext, use, useState } from 'react';

import { cashOutTransactions, type CashOutTransaction } from './cash-out';

type CashOutContextValue = {
    transactions: CashOutTransaction[];
    addTransaction: (transaction: CashOutTransaction) => void;
};

const CashOutContext = createContext<CashOutContextValue | null>(null);

export function CashOutProvider({ children }: PropsWithChildren) {
    const [transactions, setTransactions] = useState(cashOutTransactions);

    const addTransaction = (transaction: CashOutTransaction) => {
        setTransactions((current) => [...current, transaction]);
    };

    return (
        <CashOutContext.Provider value={{ transactions, addTransaction }}>
            {children}
        </CashOutContext.Provider>
    );
}

export function useCashOutTransactions() {
    const context = use(CashOutContext);
    if (!context) {
        throw new Error('useCashOutTransactions must be used within a CashOutProvider');
    }

    return context;
}
