import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import type { Solution } from "@/lib/math/core";
import { planeShapes, planeSolution, pythagoras, type PlaneShape } from "@/lib/math/geometry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geometria")({
  head: () => ({
    meta: [
      { title: "Geometria plana: áreas e perímetros — MathSolver" },
      {
        name: "description",
        content:
          "Calcula áreas e perímetros de quadrado, retângulo, triângulo, círculo, losango e trapézio, e aplica o teorema de Pitágoras.",
      },
      { property: "og:title", content: "Geometria plana: áreas e perímetros — MathSolver" },
      { property: "og:description", content: "Figuras planas e Pitágoras com fórmulas e passos." },
      { property: "og:url", content: "/geometria" },
    ],
    links: [{ rel: "canonical", href: "/geometria" }],
  }),
  component: Geometria,
});

function Geometria() {
  const [shape, setShape] = useState<PlaneShape>("quadrado");
  const [values, setValues] = useState<Record<string, string>>({});
  const [sol, setSol] = useState<Solution | null>(null);

  const [pa, setPa] = useState("3");
  const [pb, setPb] = useState("4");
  const [pc, setPc] = useState("5");
  const [pSol, setPSol] = useState<Solution | null>(null);

  const n = (s?: string) => Number((s ?? "").replace(",", ".")) || 0;
  const current = planeShapes.find((s) => s.id === shape)!;

  return (
    <SiteLayout>
      <PageHeader
        title="Geometria plana"
        subtitle="Áreas, perímetros e o teorema de Pitágoras, com as fórmulas sempre à vista."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Áreas e perímetros">
          <div className="flex flex-wrap gap-2">
            {planeShapes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setShape(s.id);
                  setValues({});
                  setSol(null);
                }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  s.id === shape
                    ? "border-primary bg-primary/15 font-medium text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {current.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</label>
                <Input
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="mt-1 font-mono"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <Button
            onClick={() =>
              setSol(
                planeSolution(
                  shape,
                  Object.fromEntries(current.fields.map((f) => [f.key, n(values[f.key])])),
                ),
              )
            }
          >
            Calcular
          </Button>
          <StepsResult solution={sol} />
          <FormulaBlock formulas={current.formulas} />
        </CalculatorCard>

        <CalculatorCard title="Teorema de Pitágoras" description="Triângulo retângulo: a² + b² = c²">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Cateto a</label>
              <Input value={pa} onChange={(e) => setPa(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Cateto b</label>
              <Input value={pb} onChange={(e) => setPb(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Hipotenusa c</label>
              <Input value={pc} onChange={(e) => setPc(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPSol(pythagoras(n(pa), n(pb), n(pc), "c"))}>
              Calcular hipotenusa
            </Button>
            <Button variant="secondary" onClick={() => setPSol(pythagoras(n(pa), n(pb), n(pc), "cateto"))}>
              Calcular cateto
            </Button>
          </div>
          <StepsResult solution={pSol} />
          <FormulaBlock formulas={["a² + b² = c²", "c = √(a² + b²)", "b = √(c² − a²)"]} />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
