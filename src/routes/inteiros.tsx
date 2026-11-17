import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import { integerOperation, type BasicOp, type Solution } from "@/lib/math/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inteiros")({
  head: () => ({
    meta: [
      { title: "Números inteiros e regra de sinais — MathSolver" },
      {
        name: "description",
        content:
          "Operações com números positivos e negativos, regra de sinais, valor absoluto, oposto e comparação.",
      },
      { property: "og:title", content: "Números inteiros e regra de sinais — MathSolver" },
      { property: "og:description", content: "Inteiros positivos e negativos explicados passo a passo." },
      { property: "og:url", content: "/inteiros" },
    ],
    links: [{ rel: "canonical", href: "/inteiros" }],
  }),
  component: Inteiros,
});

const ops: { id: BasicOp; symbol: string; label: string }[] = [
  { id: "soma", symbol: "+", label: "Soma" },
  { id: "subtracao", symbol: "−", label: "Subtração" },
  { id: "multiplicacao", symbol: "×", label: "Multiplicação" },
  { id: "divisao", symbol: "÷", label: "Divisão" },
];

function Inteiros() {
  const [a, setA] = useState("-5");
  const [b, setB] = useState("3");
  const [op, setOp] = useState<BasicOp>("subtracao");
  const [sol, setSol] = useState<Solution | null>(null);

  const int = (s: string) => Math.trunc(Number(s) || 0);
  const na = int(a);
  const nb = int(b);

  return (
    <SiteLayout>
      <PageHeader
        title="Números inteiros"
        subtitle="Operar com positivos e negativos, valor absoluto e comparação."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Operações com inteiros">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Inteiro a</label>
              <Input value={a} onChange={(e) => setA(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Inteiro b</label>
              <Input value={b} onChange={(e) => setB(e.target.value)} className="mt-1 font-mono" />
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
          <Button onClick={() => setSol(integerOperation(na, nb, op))}>Calcular</Button>
          <StepsResult solution={sol} />
          <FormulaBlock
            formulas={[
              "a − b = a + (−b)",
              "(+)×(+) = + ; (−)×(−) = +",
              "(+)×(−) = − ; (−)×(+) = −",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard title="Valor absoluto, oposto e comparação">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { k: "|a|", v: Math.abs(na) },
              { k: "|b|", v: Math.abs(nb) },
              { k: "Oposto de a", v: -na },
              { k: "Oposto de b", v: -nb },
            ].map((x) => (
              <div key={x.k} className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{x.k}</p>
                <p className="font-mono text-lg text-primary">{x.v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 font-mono text-lg">
            {na} {na > nb ? ">" : na < nb ? "<" : "="} {nb}
          </div>
          <FormulaBlock formulas={["|a| = a se a ≥ 0", "|a| = −a se a < 0", "Oposto de a = −a"]} />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
