import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CalculatorCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur md:p-6",
        className,
      )}
    >
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
        {title}
      </h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function FormulaBlock({ formulas }: { formulas: string[] }) {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
        Fórmula usada
      </p>
      <ul className="mt-2 space-y-1">
        {formulas.map((f) => (
          <li key={f} className="font-mono text-sm text-foreground">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
