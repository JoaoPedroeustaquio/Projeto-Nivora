import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import { TransactionContext } from "@/contexts/TransactionContext";
import { useAuth } from "@/hooks/useAuth";

import type { Transaction } from "@/types/transaction";

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({
  children,
}: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const userId = user.id;

    async function loadTransactions() {
      setLoading(true);

      const { data, error } = await supabase
        .from("transactions")
        .select(
          "id, user_id, type, value, category, payment, description, date, created_at",
        )
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erro ao carregar transações:",
          error,
        );

        setLoading(false);
        return;
      }

      const normalizedTransactions: Transaction[] = (
        data ?? []
      ).map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        value: Number(transaction.value),
        category: transaction.category ?? "",
        payment: transaction.payment ?? "",
        description: transaction.description ?? "",
        date: transaction.date,
      }));

      setTransactions(normalizedTransactions);
      setLoading(false);
    }

    void loadTransactions();
  }, [user, authLoading]);

  async function addTransaction(
    transaction: Omit<Transaction, "id">,
  ) {
    if (!user) {
      throw new Error(
        "É necessário estar autenticado para criar uma transação.",
      );
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: transaction.type,
        value: transaction.value,
        category: transaction.category || null,
        payment: transaction.payment || null,
        description: transaction.description || null,
        date: transaction.date,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao criar transação:",
        error,
      );

      throw error;
    }

    const normalizedTransaction: Transaction = {
      id: data.id,
      type: data.type,
      value: Number(data.value),
      category: data.category ?? "",
      payment: data.payment ?? "",
      description: data.description ?? "",
      date: data.date,
    };

    setTransactions((previous) => [
      normalizedTransaction,
      ...previous,
    ]);
  }

  async function removeTransaction(id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Erro ao excluir transação:",
        error,
      );

      throw error;
    }

    setTransactions((previous) =>
      previous.filter(
        (transaction) => transaction.id !== id,
      ),
    );
  }

  async function updateTransaction(
    transaction: Transaction,
  ) {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        type: transaction.type,
        value: transaction.value,
        category: transaction.category || null,
        payment: transaction.payment || null,
        description: transaction.description || null,
        date: transaction.date,
      })
      .eq("id", transaction.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar transação:",
        error,
      );

      throw error;
    }

    const normalizedTransaction: Transaction = {
      id: data.id,
      type: data.type,
      value: Number(data.value),
      category: data.category ?? "",
      payment: data.payment ?? "",
      description: data.description ?? "",
      date: data.date,
    };

    setTransactions((previous) =>
      previous.map((item) =>
        item.id === transaction.id
          ? normalizedTransaction
          : item,
      ),
    );
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        removeTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}