import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import { basicOperation, type BasicOp, type Solution } from "@/lib/math/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "Calculadora básica com passos — MathSolver" },
      {
        name: "description",
        content:
          "Soma, subtração, multiplicação e divisão de dois números, com proteção contra divisão por zero e resolução explicada.",
      },
      { property: "og:title", content: "Calculadora básica com passos — MathSolver" },
      { property: "og:description", content: "As quatro operações com resolução passo a passo." },
      { property: "og:url", content: "/calculadora" },
    ],
    links: [{ rel: "canonical", href: "/calculadora" }],
  }),
  component: Calculadora,
});

const ops: { id: BasicOp; label: string; symbol: string }[] = [
  { id: "soma", label: "Soma", symbol: "+" },
  { id: "subtracao", label: "Subtração", symbol: "−" },
  { id: "multiplicacao", label: "Multiplicação", symbol: "×" },
  { id: "divisao", label: "Divisão", symbol: "÷" },
];

function Calculadora() {
  const [a, setA] = useState("12");
  const [b, setB] = useState("4");
  const [op, setOp] = useState<BasicOp>("soma");
  const [solution, setSolution] = useState<Solution | null>(null);

  const calcular = () => {
    const na = Number(a.replace(",", "."));
    const nb = Number(b.replace(",", "."));
    if (!Number.isFinite(na) || !Number.isFinite(nb)) {
      setSolution({ result: "—", steps: [], error: "Introduz dois números válidos." });
      return;
    }
    setSolution(basicOperation(na, nb, op));
  };

  return (
    <SiteLayout>
      <PageHeader
        title="Calculadora básica"
        subtitle="As quatro operações fundamentais, com a fórmula e o cálculo mostrados."
      />

      <CalculatorCard title="Calcular" description="Insere dois números e escolhe a operação.">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Número a</label>
            <Input value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" className="mt-1 font-mono" />
          </div>
          <div className="pb-2 text-center font-mono text-2xl text-primary">
            {ops.find((o) => o.id === op)?.symbol}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Número b</label>
            <Input value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" className="mt-1 font-mono" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ops.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOp(o.id)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm transition-colors",
                o.id === op
                  ? "border-primary bg-primary/15 font-medium text-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              <span className="font-mono">{o.symbol}</span> {o.label}
            </button>
          ))}
        </div>

        <Button onClick={calcular} className="w-full sm:w-auto">
          Calcular
        </Button>

        <StepsResult solution={solution} />

        <FormulaBlock
          formulas={["a + b = c", "a − b = c", "a × b = c", "a ÷ b = c, com b ≠ 0"]}
        />
      </CalculatorCard>
    </SiteLayout>
  );
}
