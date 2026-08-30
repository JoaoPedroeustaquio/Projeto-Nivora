import { useTransactions } from "@/hooks/useTransactions";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  dia: string;
  saldo: number;
};

export default function BalanceChart() {
  const { transactions } = useTransactions();

  if (transactions.length === 0) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <p className="text-sm text-(--muted)">
          Cadastre um lançamento para visualizar a evolução do saldo.
        </p>
      </div>
    );
  }

  const orderedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  );

  const dailyChanges: Record<string, number> = {};

  orderedTransactions.forEach((transaction) => {
    const currentDay = dailyChanges[transaction.date] ?? 0;

    dailyChanges[transaction.date] =
      transaction.type === "income"
        ? currentDay + transaction.value
        : currentDay - transaction.value;
  });

  const data = Object.entries(dailyChanges)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .reduce<ChartData[]>((result, [date, dailyChange], index) => {
      const previousBalance =
        index === 0 ? 0 : result[index - 1].saldo;

      const newBalance = previousBalance + dailyChange;

      result.push({
        dia: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }).format(new Date(`${date}T00:00:00`)),
        saldo: newBalance,
      });

      return result;
    }, []);

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

          <Line
            type="monotone"
            dataKey="saldo"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Saldo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}