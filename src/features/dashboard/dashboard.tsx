import StatCard from "../../components/shared/StatCard";
import BalanceChart from "./charts/BalanceChart";
import ChartCard from "../../components/shared/ChartCard";
import ExpenseChart from "./charts/ExpenseChart";
import IncomeExpenseChart from "./charts/IncomeExpenseChart";
import LastTransactions from "./components/LastTransactions";
import TopCategories from "./components/TopCategories";
import { useTransactions } from "@/hooks/useTransactions";

import {
  calculateIncome,
  calculateExpense,
  calculateBalance,
  calculateSavings,
} from "@/utils/financial";

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export default function Dashboard() {
  const { transactions } = useTransactions();

  const income = calculateIncome(transactions);
  const expense = calculateExpense(transactions);
  const balance = calculateBalance(transactions);
  const savings = calculateSavings(transactions);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <section>
        <h1 className="text-3xl font-bold text-(--foreground)">Dashboard</h1>

        <p className="mt-2 text-(--muted)">Bem-vindo de volta 👋</p>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Saldo Atual"
          value={balance}
          description="Saldo disponível"
          icon={<Wallet size={20} />}
        />

        <StatCard
          title="Entradas"
          value={income}
          description="Recebimentos"
          icon={<TrendingUp size={20} />}
        />

        <StatCard
          title="Saídas"
          value={expense}
          description="Despesas"
          icon={<TrendingDown size={20} />}
        />

        <StatCard
          title="Economia"
          value={savings}
          description="Saldo economizado"
          icon={<PiggyBank size={20} />}
        />
      </section>

      {/* Evolução do saldo */}
      <section className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Evolução do saldo"
          description="Acompanhe a evolução do seu saldo ao longo do mês"
        >
          <BalanceChart />
        </ChartCard>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Gastos por categoria"
          description="Veja onde seu dinheiro está sendo gasto"
        >
          <ExpenseChart />
        </ChartCard>

        <ChartCard
          title="Entradas x Saídas"
          description="Compare seus recebimentos e despesas ao longo do mês"
        >
          <IncomeExpenseChart />
        </ChartCard>
      </section>

      {/* Últimos lançamentos + Categorias */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LastTransactions />

        <TopCategories />
      </section>
    </div>
  );
}