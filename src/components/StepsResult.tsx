import type { Solution } from "@/lib/math/core";

export function StepsResult({ solution }: { solution: Solution | null }) {
  if (!solution) return null;

  if (solution.error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {solution.error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Resultado
      </p>
      <p className="mt-1 font-mono text-xl font-semibold text-foreground md:text-2xl">
        {solution.result}
      </p>
      {solution.steps.length > 0 && (
        <ol className="mt-4 space-y-2 border-t border-border/60 pt-3">
          {solution.steps.map((s, i) => (
            <li key={`${s.label}-${i}`} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <span className="min-w-[9rem] text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <span className="font-mono text-sm text-foreground">{s.expr}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
