import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import type { Solution } from "@/lib/math/core";
import { fractionOperation, simplify, fracText, mixedText, type FracOp } from "@/lib/math/fractions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fracoes")({
  head: () => ({
    meta: [
      { title: "Calculadora de frações — MathSolver" },
      {
        name: "description",
        content:
          "Soma, subtrai, multiplica e divide frações, simplifica pelo MDC e converte em fração mista e decimal.",
      },
      { property: "og:title", content: "Calculadora de frações — MathSolver" },
      { property: "og:description", content: "Operações com frações com todos os passos." },
      { property: "og:url", content: "/fracoes" },
    ],
    links: [{ rel: "canonical", href: "/fracoes" }],
  }),
  component: Fracoes,
});

const ops: { id: FracOp; symbol: string; label: string }[] = [
  { id: "soma", symbol: "+", label: "Somar" },
  { id: "subtracao", symbol: "−", label: "Subtrair" },
  { id: "multiplicacao", symbol: "×", label: "Multiplicar" },
  { id: "divisao", symbol: "÷", label: "Dividir" },
];

function FractionInput({
  n,
  d,
  setN,
  setD,
  label,
}: {
  n: string;
  d: string;
  setN: (v: string) => void;
  setD: (v: string) => void;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-col items-center gap-1">
        <Input value={n} onChange={(e) => setN(e.target.value)} className="w-24 text-center font-mono" />
        <span className="h-px w-24 bg-foreground/60" />
        <Input value={d} onChange={(e) => setD(e.target.value)} className="w-24 text-center font-mono" />
      </div>
    </div>
  );
}

function Fracoes() {
  const [an, setAn] = useState("1");
  const [ad, setAd] = useState("2");
  const [bn, setBn] = useState("1");
  const [bd, setBd] = useState("3");
  const [op, setOp] = useState<FracOp>("soma");
  const [sol, setSol] = useState<Solution | null>(null);

  const [sn, setSn] = useState("6");
  const [sd, setSd] = useState("9");

  const int = (s: string) => Math.trunc(Number(s) || 0);
  const simp = simplify({ n: int(sn), d: int(sd) || 1 });

  return (
    <SiteLayout>
      <PageHeader
        title="Frações"
        subtitle="Operar, simplificar e converter frações com a fórmula e cada passo."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Operações com frações">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <FractionInput n={an} d={ad} setN={setAn} setD={setAd} label="Fração a/b" />
            <span className="font-mono text-2xl text-primary">
              {ops.find((o) => o.id === op)?.symbol}
            </span>
            <FractionInput n={bn} d={bd} setN={setBn} setD={setBd} label="Fração c/d" />
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
                {o.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() =>
              setSol(
                fractionOperation({ n: int(an), d: int(ad) }, { n: int(bn), d: int(bd) }, op),
              )
            }
          >
            Calcular
          </Button>
          <StepsResult solution={sol} />
          <FormulaBlock
            formulas={[
              "a/b + c/d = (a×d + c×b) / (b×d)",
              "a/b − c/d = (a×d − c×b) / (b×d)",
              "(a/b) × (c/d) = (a×c) / (b×d)",
              "(a/b) ÷ (c/d) = (a×d) / (b×c)",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard title="Simplificar e converter" description="Simplificação automática pelo MDC.">
          <div className="flex justify-center">
            <FractionInput n={sn} d={sd} setN={setSn} setD={setSd} label="Fração" />
          </div>
          {int(sd) === 0 ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              O denominador não pode ser zero.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { k: "Simplificada", v: fracText(simp) },
                { k: "Fração mista", v: mixedText(simp) },
                { k: "Decimal", v: String(Number((simp.n / simp.d).toFixed(6))) },
                { k: "Percentagem", v: `${Number(((simp.n / simp.d) * 100).toFixed(4))} %` },
              ].map((x) => (
                <div key={x.k} className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{x.k}</p>
                  <p className="font-mono text-lg text-primary">{x.v}</p>
                </div>
              ))}
            </div>
          )}
          <FormulaBlock formulas={["Dividir numerador e denominador pelo MDC", "5/2 = 2 1/2 (fração mista)"]} />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
