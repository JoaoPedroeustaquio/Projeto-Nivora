import { createContext } from "react";

import type { Transaction } from "@/types/transaction";

export interface TransactionContextData {
  transactions: Transaction[];

  loading: boolean;

  addTransaction: (
    transaction: Omit<Transaction, "id">,
  ) => Promise<void>;

  removeTransaction: (id: string) => Promise<void>;

  updateTransaction: (
    transaction: Transaction,
  ) => Promise<void>;
}

export const TransactionContext =
  createContext<TransactionContextData | undefined>(undefined);