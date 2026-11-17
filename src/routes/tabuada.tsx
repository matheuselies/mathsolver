import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tabuada")({
  head: () => ({
    meta: [
      { title: "Tabuada interativa de 1 a 10 — MathSolver" },
      {
        name: "description",
        content: "Vê a tabuada completa de qualquer número de 1 a 10 em tabela, ou a grelha inteira.",
      },
      { property: "og:title", content: "Tabuada interativa de 1 a 10 — MathSolver" },
      { property: "og:description", content: "Tabuada de 1 a 10 em tabela, com grelha completa." },
      { property: "og:url", content: "/tabuada" },
    ],
    links: [{ rel: "canonical", href: "/tabuada" }],
  }),
  component: Tabuada,
});

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

function Tabuada() {
  const [n, setN] = useState(5);

  return (
    <SiteLayout>
      <PageHeader
        title="Tabuada interativa"
        subtitle="Escolhe um número de 1 a 10 e vê a multiplicação de 1 até 10."
      />

      <CalculatorCard title={`Tabuada do ${n}`} description="Clica num número para mudar.">
        <div className="flex flex-wrap gap-2">
          {numbers.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setN(v)}
              className={cn(
                "h-11 w-11 rounded-lg border font-mono text-base transition-colors",
                v === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/60",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {numbers.map((i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-2 font-mono text-sm"
            >
              <span className="text-muted-foreground">
                {n} × {i}
              </span>
              <span className="font-semibold text-primary">{n * i}</span>
            </li>
          ))}
        </ul>

        <FormulaBlock formulas={["a × b = c", "Comutativa: a × b = b × a"]} />
      </CalculatorCard>

      <div className="mt-6">
        <CalculatorCard title="Grelha completa (1 a 10)" description="Todas as tabuadas de uma vez.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-center font-mono text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted/60 p-2 text-muted-foreground">×</th>
                  {numbers.map((c) => (
                    <th key={c} className="border border-border bg-muted/60 p-2 text-primary">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numbers.map((r) => (
                  <tr key={r}>
                    <th className="border border-border bg-muted/60 p-2 text-primary">{r}</th>
                    {numbers.map((c) => (
                      <td
                        key={c}
                        className={cn(
                          "border border-border p-2",
                          r === n || c === n ? "bg-primary/15 text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {r * c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
