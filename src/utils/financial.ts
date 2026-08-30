import type { Transaction } from "@/types/transaction";

export function calculateIncome(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.value, 0);
}

export function calculateExpense(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.value, 0);
}

export function calculateBalance(transactions: Transaction[]) {
  return (
    calculateIncome(transactions) -
    calculateExpense(transactions)
  );
}

export function calculateSavings(transactions: Transaction[]) {
  return calculateBalance(transactions);
}