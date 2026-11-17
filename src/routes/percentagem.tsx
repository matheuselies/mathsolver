import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import { applyPercent, percentOf, percentRatio, type Solution } from "@/lib/math/core";
import { decimalToFraction } from "@/lib/math/fractions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/percentagem")({
  head: () => ({
    meta: [
      { title: "Percentagem, aumentos e descontos — MathSolver" },
      {
        name: "description",
        content:
          "Calcula percentagens, aumentos e descontos, e converte decimais em frações e percentagem.",
      },
      { property: "og:title", content: "Percentagem, aumentos e descontos — MathSolver" },
      { property: "og:description", content: "Percentagens e decimais com resolução explicada." },
      { property: "og:url", content: "/percentagem" },
    ],
    links: [{ rel: "canonical", href: "/percentagem" }],
  }),
  component: Percentagem,
});

function Percentagem() {
  const n = (s: string) => Number(s.replace(",", "."));

  const [p, setP] = useState("15");
  const [total, setTotal] = useState("200");
  const [s1, setS1] = useState<Solution | null>(null);

  const [parte, setParte] = useState("15");
  const [total2, setTotal2] = useState("100");
  const [s2, setS2] = useState<Solution | null>(null);

  const [valor, setValor] = useState("100");
  const [pct, setPct] = useState("10");
  const [s3, setS3] = useState<Solution | null>(null);

  const [dec, setDec] = useState("0.75");
  const [s4, setS4] = useState<Solution | null>(null);

  return (
    <SiteLayout>
      <PageHeader
        title="Percentagem e decimais"
        subtitle="Percentagem de um valor, proporção, aumentos e descontos, e conversão de decimais."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Percentagem de um número" description="Quanto é x% de um total?">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">x (%)</label>
              <Input value={p} onChange={(e) => setP(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Total</label>
              <Input value={total} onChange={(e) => setTotal(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button onClick={() => setS1(percentOf(n(p), n(total)))}>Calcular</Button>
          <StepsResult solution={s1} />
          <FormulaBlock formulas={["Parte = (x / 100) × Total"]} />
        </CalculatorCard>

        <CalculatorCard title="Que percentagem representa?" description="Parte em relação ao total.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Parte</label>
              <Input value={parte} onChange={(e) => setParte(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Total</label>
              <Input value={total2} onChange={(e) => setTotal2(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button onClick={() => setS2(percentRatio(n(parte), n(total2)))}>Calcular</Button>
          <StepsResult solution={s2} />
          <FormulaBlock formulas={["Percentagem = (Parte / Total) × 100%"]} />
        </CalculatorCard>

        <CalculatorCard title="Aumento e desconto" description="Aplicar uma variação percentual.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Valor inicial</label>
              <Input value={valor} onChange={(e) => setValor(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Variação (%)</label>
              <Input value={pct} onChange={(e) => setPct(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setS3(applyPercent(n(valor), n(pct), "aumento"))}>Aumentar</Button>
            <Button variant="secondary" onClick={() => setS3(applyPercent(n(valor), n(pct), "desconto"))}>
              Descontar
            </Button>
          </div>
          <StepsResult solution={s3} />
          <FormulaBlock
            formulas={["Final = Inicial × (1 + x/100)", "Final = Inicial × (1 − x/100)"]}
          />
        </CalculatorCard>

        <CalculatorCard title="Decimal → fração e percentagem" description="Converte um número decimal.">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Decimal</label>
            <Input value={dec} onChange={(e) => setDec(e.target.value)} className="mt-1 font-mono" />
          </div>
          <Button onClick={() => setS4(decimalToFraction(n(dec)))}>Converter</Button>
          <StepsResult solution={s4} />
          <FormulaBlock formulas={["0,1 = 1/10 ; 0,01 = 1/100 ; 0,001 = 1/1000"]} />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
