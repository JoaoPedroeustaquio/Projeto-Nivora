import { type ReactNode } from "react";


interface ChartCardProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function ChartCard({
  children,
  title,
  description,
}: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-(--card-border) bg-(--card) p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-(--foreground)">
          {title}
        </h2>

        <p className="mt-1 text-sm text-(--muted)">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}