import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import { linearEquation, linearSystem, quadraticEquation } from "@/lib/math/algebra";
import type { Solution } from "@/lib/math/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/algebra")({
  head: () => ({
    meta: [
      { title: "Álgebra: equações do 1.º e 2.º grau — MathSolver" },
      {
        name: "description",
        content:
          "Resolve equações lineares ax + b = c, equações do 2.º grau com a fórmula resolvente e sistemas de duas equações.",
      },
      { property: "og:title", content: "Álgebra: equações do 1.º e 2.º grau — MathSolver" },
      { property: "og:description", content: "Equações e sistemas resolvidos passo a passo." },
      { property: "og:url", content: "/algebra" },
    ],
    links: [{ rel: "canonical", href: "/algebra" }],
  }),
  component: Algebra,
});

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 font-mono" />
    </div>
  );
}

function Algebra() {
  const n = (s: string) => Number(s.replace(",", ".")) || 0;

  const [la, setLa] = useState("2");
  const [lb, setLb] = useState("3");
  const [lc, setLc] = useState("11");
  const [s1, setS1] = useState<Solution | null>(null);

  const [qa, setQa] = useState("1");
  const [qb, setQb] = useState("-5");
  const [qc, setQc] = useState("6");
  const [s2, setS2] = useState<Solution | null>(null);

  const [sys, setSys] = useState({ a1: "1", b1: "1", c1: "10", a2: "1", b2: "-1", c2: "2" });
  const [s3, setS3] = useState<Solution | null>(null);
  const setSys1 = (k: keyof typeof sys) => (v: string) => setSys((p) => ({ ...p, [k]: v }));

  return (
    <SiteLayout>
      <PageHeader
        title="Álgebra"
        subtitle="Equações do 1.º grau, do 2.º grau e sistemas lineares com resolução detalhada."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Equação do 1.º grau" description="Forma ax + b = c">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="a" value={la} onChange={setLa} />
            <Field label="b" value={lb} onChange={setLb} />
            <Field label="c" value={lc} onChange={setLc} />
          </div>
          <Button onClick={() => setS1(linearEquation(n(la), n(lb), n(lc)))}>Resolver</Button>
          <StepsResult solution={s1} />
          <FormulaBlock formulas={["ax + b = c", "x = (c − b) / a"]} />
        </CalculatorCard>

        <CalculatorCard title="Equação do 2.º grau" description="Forma ax² + bx + c = 0">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="a" value={qa} onChange={setQa} />
            <Field label="b" value={qb} onChange={setQb} />
            <Field label="c" value={qc} onChange={setQc} />
          </div>
          <Button onClick={() => setS2(quadraticEquation(n(qa), n(qb), n(qc)))}>Resolver</Button>
          <StepsResult solution={s2} />
          <FormulaBlock
            formulas={[
              "Δ = b² − 4ac",
              "x = (−b ± √Δ) / (2a)",
              "Δ > 0: duas soluções · Δ = 0: uma · Δ < 0: nenhuma real",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard
          title="Sistema de duas equações"
          description="a₁x + b₁y = c₁ e a₂x + b₂y = c₂ (regra de Cramer)"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="a₁" value={sys.a1} onChange={setSys1("a1")} />
            <Field label="b₁" value={sys.b1} onChange={setSys1("b1")} />
            <Field label="c₁" value={sys.c1} onChange={setSys1("c1")} />
            <Field label="a₂" value={sys.a2} onChange={setSys1("a2")} />
            <Field label="b₂" value={sys.b2} onChange={setSys1("b2")} />
            <Field label="c₂" value={sys.c2} onChange={setSys1("c2")} />
          </div>
          <Button
            onClick={() =>
              setS3(
                linearSystem(
                  n(sys.a1),
                  n(sys.b1),
                  n(sys.c1),
                  n(sys.a2),
                  n(sys.b2),
                  n(sys.c2),
                ),
              )
            }
          >
            Resolver sistema
          </Button>
          <StepsResult solution={s3} />
          <FormulaBlock
            formulas={["D = a₁b₂ − a₂b₁", "x = (c₁b₂ − c₂b₁) / D", "y = (a₁c₂ − a₂c₁) / D"]}
          />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
