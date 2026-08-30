import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

export const stats = [
  {
    title: "Saldo Atual",
    value: "R$ 8.520,45",
    description: "Saldo disponível",
    icon: Wallet,
    variant: "default",
  },
  {
    title: "Entradas",
    value: "R$ 5.200,00",
    description: "Recebimentos do mês",
    icon: TrendingUp,
    variant: "income",
  },
  {
    title: "Saídas",
    value: "R$ 2.150,00",
    description: "Despesas do mês",
    icon: TrendingDown,
    variant: "expense",
  },
  {
    title: "Economia",
    value: "R$ 3.050,00",
    description: "Economia do mês",
    icon: PiggyBank,
    variant: "income",
  },
];