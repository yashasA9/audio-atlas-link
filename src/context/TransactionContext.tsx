import React, { createContext, useContext, useState, useCallback } from "react";

export interface Transaction {
  id: string;
  type: "tip" | "publish";
  txHash: string;
  amount?: string;
  recipient?: string;
  recipientName?: string;
  trackTitle?: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (txHash: string, updates: Partial<Transaction>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...tx, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateTransaction = useCallback((txHash: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.txHash === txHash ? { ...tx, ...updates } : tx))
    );
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}
