import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import {
  divisors,
  factorString,
  gcdSolution,
  lcmSolution,
  type Solution,
} from "@/lib/math/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mdc-mmc")({
  head: () => ({
    meta: [
      { title: "MDC, MMC e fatoração em primos — MathSolver" },
      {
        name: "description",
        content:
          "Calcula o MDC pelo algoritmo de Euclides, o MMC, a fatoração em fatores primos e os divisores de um número.",
      },
      { property: "og:title", content: "MDC, MMC e fatoração em primos — MathSolver" },
      { property: "og:description", content: "MDC, MMC, fatoração e divisores passo a passo." },
      { property: "og:url", content: "/mdc-mmc" },
    ],
    links: [{ rel: "canonical", href: "/mdc-mmc" }],
  }),
  component: MdcMmc,
});

function MdcMmc() {
  const [a, setA] = useState("12");
  const [b, setB] = useState("18");
  const [sol, setSol] = useState<Solution | null>(null);
  const [n, setN] = useState("60");

  const int = (s: string) => Math.trunc(Number(s) || 0);
  const nn = int(n);
  const divs = Math.abs(nn) <= 10000 ? divisors(nn) : [];

  return (
    <SiteLayout>
      <PageHeader
        title="MDC, MMC e fatoração"
        subtitle="Máximo divisor comum, mínimo múltiplo comum, fatores primos e divisibilidade."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="MDC e MMC" description="Entre dois números inteiros.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Número a</label>
              <Input value={a} onChange={(e) => setA(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Número b</label>
              <Input value={b} onChange={(e) => setB(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSol(gcdSolution(int(a), int(b)))}>Calcular MDC</Button>
            <Button variant="secondary" onClick={() => setSol(lcmSolution(int(a), int(b)))}>
              Calcular MMC
            </Button>
          </div>
          <StepsResult solution={sol} />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fatoração de a</p>
              <p className="font-mono text-primary">{factorString(int(a))}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fatoração de b</p>
              <p className="font-mono text-primary">{factorString(int(b))}</p>
            </div>
          </div>
          <FormulaBlock
            formulas={[
              "MDC(a, b) = MDC(b, a mod b)",
              "MMC(a, b) = |a × b| / MDC(a, b)",
              "MDC(a,b) × MMC(a,b) = a × b",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard title="Fatoração e divisores" description="Decompõe um número em fatores primos.">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Número</label>
            <Input value={n} onChange={(e) => setN(e.target.value)} className="mt-1 font-mono" />
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fatoração em primos</p>
            <p className="font-mono text-xl text-foreground">
              {nn} = {factorString(nn)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Divisores ({divs.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {divs.map((d) => (
                <span
                  key={d}
                  className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Divisibilidade</p>
            <ul className="mt-2 grid grid-cols-2 gap-1 font-mono text-xs sm:grid-cols-3">
              {[2, 3, 4, 5, 6, 9, 10].map((k) => (
                <li key={k} className={nn % k === 0 ? "text-accent" : "text-muted-foreground"}>
                  {nn % k === 0 ? "✓" : "✕"} divisível por {k}
                </li>
              ))}
            </ul>
          </div>
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
