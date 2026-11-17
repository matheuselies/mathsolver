import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import { nthRoot, power, type Solution } from "@/lib/math/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/potencias")({
  head: () => ({
    meta: [
      { title: "Potenciação e radiciação — MathSolver" },
      {
        name: "description",
        content:
          "Calcula potências aⁿ, raízes quadradas e raízes n-ésimas com expansão, propriedades e verificação.",
      },
      { property: "og:title", content: "Potenciação e radiciação — MathSolver" },
      { property: "og:description", content: "Potências, raiz quadrada e raiz n-ésima passo a passo." },
      { property: "og:url", content: "/potencias" },
    ],
    links: [{ rel: "canonical", href: "/potencias" }],
  }),
  component: Potencias,
});

function Potencias() {
  const [base, setBase] = useState("2");
  const [exp, setExp] = useState("3");
  const [powSol, setPowSol] = useState<Solution | null>(null);

  const [radicando, setRadicando] = useState("9");
  const [indice, setIndice] = useState("2");
  const [rootSol, setRootSol] = useState<Solution | null>(null);

  const num = (s: string) => Number(s.replace(",", "."));

  return (
    <SiteLayout>
      <PageHeader
        title="Potências e raízes"
        subtitle="Potenciação, raiz quadrada e raiz de qualquer índice, com as propriedades aplicadas."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Potenciação" description="Calcula aⁿ.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Base (a)</label>
              <Input value={base} onChange={(e) => setBase(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Expoente (n)</label>
              <Input value={exp} onChange={(e) => setExp(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button onClick={() => setPowSol(power(num(base), num(exp)))}>Calcular potência</Button>
          <StepsResult solution={powSol} />
          <FormulaBlock
            formulas={[
              "aⁿ = a × a × … × a (n vezes)",
              "a⁰ = 1 (a ≠ 0) ; a¹ = a",
              "a⁻ⁿ = 1 / aⁿ",
              "aᵐ⁺ⁿ = aᵐ × aⁿ ; (aᵐ)ⁿ = a^(m×n)",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard title="Radiciação" description="Raiz de índice n (usa 2 para raiz quadrada).">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Radicando (a)</label>
              <Input value={radicando} onChange={(e) => setRadicando(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Índice (n)</label>
              <Input value={indice} onChange={(e) => setIndice(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setIndice("2")}>
              √ raiz quadrada
            </Button>
            <Button variant="secondary" onClick={() => setIndice("3")}>
              ³√ raiz cúbica
            </Button>
          </div>
          <Button onClick={() => setRootSol(nthRoot(num(radicando), num(indice)))}>Calcular raiz</Button>
          <StepsResult solution={rootSol} />
          <FormulaBlock
            formulas={["ⁿ√a = b ⟺ bⁿ = a", "√a = a^(1/2)", "³√a = a^(1/3)"]}
          />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
