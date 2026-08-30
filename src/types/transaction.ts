export interface Transaction {
  id: string;
  type: "income" | "expense";

  value: number;

  category: string;

  payment: string;

  description: string;

  date: string;
}