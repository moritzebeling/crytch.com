import type { ReactNode } from "react";

type StatSectionProps = {
  title: string;
  children: ReactNode;
};

export function StatSection({ title, children }: StatSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl">{title}</h2>
      {children}
    </section>
  );
}
