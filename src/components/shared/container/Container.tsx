import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}