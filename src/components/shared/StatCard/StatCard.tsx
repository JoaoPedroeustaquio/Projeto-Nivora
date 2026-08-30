import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

type StatCardVariant = "default" | "income" | "expense";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  variant?: StatCardVariant;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: StatCardProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  const iconColor = {
    default: "text-(--primary)",
    income: "text-(--income)",
    expense: "text-(--expense)",
  }[variant];

  return (
    <Card className="rounded-2xl border-(--card-border) shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-(--muted)">
          {title}
        </CardTitle>

        <div className={iconColor}>
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-3xl font-bold text-(--foreground)">
          {formattedValue}
        </h2>

        <p className="mt-2 text-sm text-(--muted)">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}