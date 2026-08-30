import { useTransactions } from "@/hooks/useTransactions";

import TransactionDialog from "@/features/transactions/compontes/TransactionDialog";

export default function LastTransactions() {
  const { transactions, removeTransaction } = useTransactions();

  return (
    <div className="rounded-2xl border border-(--card-border) bg-(--card) p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-(--foreground)">
          Últimos lançamentos
        </h2>

        <p className="mt-1 text-sm text-(--muted)">
          Suas movimentações mais recentes
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center">
          <p className="text-sm text-(--muted)">
            Nenhum lançamento cadastrado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((transaction) => {
              const formattedDate =
                new Intl.DateTimeFormat("pt-BR").format(
                  new Date(`${transaction.date}T00:00:00`),
                );

              const formattedValue =
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(transaction.value);

              const isIncome =
                transaction.type === "income";

              return (
                <div
                  key={transaction.id}
                  className="rounded-xl border border-(--card-border) bg-(--background) p-4 transition-colors hover:border-(--primary)"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium text-(--foreground)">
                        {transaction.category || "Entrada"}
                      </h3>

                      {transaction.description && (
                        <p className="mt-1 truncate text-sm text-(--muted)">
                          {transaction.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-(--muted)">
                        {formattedDate}

                        {transaction.payment && (
                          <> • {transaction.payment}</>
                        )}
                      </p>
                    </div>

                    <span
                      className={
                        isIncome
                          ? "shrink-0 font-bold text-(--income)"
                          : "shrink-0 font-bold text-(--expense)"
                      }
                    >
                      {isIncome ? "+" : "-"}{" "}
                      {formattedValue}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-end gap-2 border-t border-(--card-border) pt-3">
                    <TransactionDialog
                      transaction={transaction}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeTransaction(transaction.id)
                      }
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}