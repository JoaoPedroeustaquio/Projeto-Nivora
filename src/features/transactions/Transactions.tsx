import { useMemo, useState } from "react";

import { useTransactions } from "@/hooks/useTransactions";

import TransactionDialog from "@/features/transactions/compontes/TransactionDialog";

export default function Transactions() {
  const { transactions, removeTransaction } = useTransactions();

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "all" | "income" | "expense"
  >("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [monthFilter, setMonthFilter] = useState("all");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions
          .map((transaction) => transaction.category.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [transactions]);

  const months = useMemo(() => {
    return Array.from(
      new Set(
        transactions
          .map((transaction) => transaction.date.slice(0, 7))
          .filter(Boolean),
      ),
    ).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");

    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(
      new Date(Number(year), Number(monthNumber) - 1, 1),
    );
  };

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const matchesSearch =
          normalizedSearch === "" ||
          transaction.category
            .toLowerCase()
            .includes(normalizedSearch) ||
          transaction.description
            .toLowerCase()
            .includes(normalizedSearch) ||
          transaction.payment
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesType =
          typeFilter === "all" ||
          transaction.type === typeFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          transaction.category === categoryFilter;

        const matchesMonth =
          monthFilter === "all" ||
          transaction.date.startsWith(monthFilter);

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesMonth
        );
      })
      .slice()
      .reverse();
  }, [
    transactions,
    search,
    typeFilter,
    categoryFilter,
    monthFilter,
  ]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-(--foreground)">
            Lançamentos
          </h1>

          <p className="mt-2 text-(--muted)">
            Gerencie suas entradas e saídas.
          </p>
        </div>

        <TransactionDialog />
      </section>

      {/* Filtros */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Busca */}
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-(--foreground)"
          >
            Buscar
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Categoria, descrição ou pagamento..."
            className="h-10 w-full rounded-md border border-(--card-border) bg-(--card) px-3 text-sm outline-none transition focus:border-(--primary)"
          />
        </div>

        {/* Tipo */}
        <div>
          <label
            htmlFor="type-filter"
            className="mb-2 block text-sm font-medium text-(--foreground)"
          >
            Tipo
          </label>

          <select
            id="type-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value as
                  | "all"
                  | "income"
                  | "expense",
              )
            }
            className="h-10 w-full rounded-md border border-(--card-border) bg-(--card) px-3 text-sm outline-none transition focus:border-(--primary)"
          >
            <option value="all">Todos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium text-(--foreground)"
          >
            Categoria
          </label>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="h-10 w-full rounded-md border border-(--card-border) bg-(--card) px-3 text-sm outline-none transition focus:border-(--primary)"
          >
            <option value="all">Todas as categorias</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Mês */}
        <div>
          <label
            htmlFor="month-filter"
            className="mb-2 block text-sm font-medium text-(--foreground)"
          >
            Mês
          </label>

          <select
            id="month-filter"
            value={monthFilter}
            onChange={(event) =>
              setMonthFilter(event.target.value)
            }
            className="h-10 w-full rounded-md border border-(--card-border) bg-(--card) px-3 text-sm outline-none transition focus:border-(--primary)"
          >
            <option value="all">Todos os meses</option>

            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Lista */}
      <section className="rounded-2xl border border-(--card-border) bg-(--card) p-6 shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center">
            <div className="text-center">
              <p className="font-medium text-(--foreground)">
                Nenhum lançamento encontrado.
              </p>

              <p className="mt-1 text-sm text-(--muted)">
                Tente alterar os filtros ou cadastrar um novo
                lançamento.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
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
                  className="rounded-xl border border-(--card-border) p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-(--foreground)">
                        {transaction.category || "Entrada"}
                      </h2>

                      {transaction.description && (
                        <p className="wrap-break-word mt-1 text-sm text-(--muted)">
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

                    <div className="flex flex-col gap-3 md:items-end">
                      <span
                        className={
                          isIncome
                            ? "font-bold text-green-600"
                            : "font-bold text-red-600"
                        }
                      >
                        {isIncome ? "+" : "-"}{" "}
                        {formattedValue}
                      </span>

                      <div className="flex items-center gap-2">
                        <TransactionDialog
                          transaction={transaction}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeTransaction(transaction.id)
                          }
                          className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}