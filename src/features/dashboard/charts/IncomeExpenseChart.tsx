import { useTransactions } from "@/hooks/useTransactions";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  dia: string;
  entradas: number;
  saidas: number;
};

export default function IncomeExpenseChart() {
  const { transactions } = useTransactions();

  if (transactions.length === 0) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <p className="text-sm text-(--muted)">
          Cadastre um lançamento para visualizar entradas e saídas.
        </p>
      </div>
    );
  }

  const orderedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  );

  const dailyData = orderedTransactions.reduce<
    Record<string, { entradas: number; saidas: number }>
  >((result, transaction) => {
    if (!result[transaction.date]) {
      result[transaction.date] = {
        entradas: 0,
        saidas: 0,
      };
    }

    if (transaction.type === "income") {
      result[transaction.date].entradas += transaction.value;
    }

    if (transaction.type === "expense") {
      result[transaction.date].saidas += transaction.value;
    }

    return result;
  }, {});

  const data: ChartData[] = Object.entries(dailyData)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, values]) => ({
      dia: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }).format(new Date(`${date}T00:00:00`)),
      entradas: values.entradas,
      saidas: values.saidas,
    }));

  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="dia" />

          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Number(value))
            }
          />

          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(value))
            }
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="entradas"
            stroke="var(--income)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Entradas"
          />

          <Line
            type="monotone"
            dataKey="saidas"
            stroke="var(--expense)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Saídas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}