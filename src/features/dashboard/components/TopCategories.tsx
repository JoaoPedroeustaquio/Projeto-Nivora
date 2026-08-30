import { useTransactions } from "@/hooks/useTransactions";

export default function TopCategories() {
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

  const totalExpense = expenses.reduce(
    (total, transaction) => total + transaction.value,
    0,
  );

  const categories = Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-(--card-border) bg-(--card) p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-(--foreground)">
          Top categorias
        </h2>

        <p className="mt-1 text-sm text-(--muted)">
          Categorias com maior gasto no mês
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-(--muted)">
          Nenhuma despesa cadastrada.
        </p>
      ) : (
        <div className="space-y-5">
          {categories.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-(--foreground)">
                  {item.name}
                </p>

                <p className="text-sm text-(--muted)">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.value)}
                </p>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-(--expense)"
                  style={{
                    width: `${item.percent}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}