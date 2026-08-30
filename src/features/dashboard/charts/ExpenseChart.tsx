import { useTransactions } from "@/hooks/useTransactions";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart() {
  const { transactions } = useTransactions();

  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const totals: Record<string, number> = {};

  expenses.forEach((transaction) => {
    if (totals[transaction.category]) {
      totals[transaction.category] += transaction.value;
    } else {
      totals[transaction.category] = transaction.value;
    }
  });

  const data = Object.entries(totals).map(([categoria, valor]) => ({
    categoria,
    valor,
  }));

  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="categoria" />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(value))
            }
          />

          <Bar
            dataKey="valor"
            fill="var(--expense)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}