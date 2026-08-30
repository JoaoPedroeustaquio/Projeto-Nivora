import { useContext } from "react";

import { TransactionContext } from "@/contexts/TransactionContext";

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions deve ser utilizado dentro de TransactionProvider.",
    );
  }

  return context;
}