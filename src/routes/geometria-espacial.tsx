import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import type { Solution } from "@/lib/math/core";
import { solidShapes, solidSolution, type SolidShape } from "@/lib/math/geometry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geometria-espacial")({
  head: () => ({
    meta: [
      { title: "Geometria espacial: volumes e áreas — MathSolver" },
      {
        name: "description",
        content:
          "Calcula volume e área total de cubo, paralelepípedo, cilindro, esfera e cone, com as fórmulas aplicadas passo a passo.",
      },
      { property: "og:title", content: "Geometria espacial: volumes e áreas — MathSolver" },
      { property: "og:description", content: "Sólidos geométricos: volume e superfície." },
      { property: "og:url", content: "/geometria-espacial" },
    ],
    links: [{ rel: "canonical", href: "/geometria-espacial" }],
  }),
  component: GeometriaEspacial,
});

function GeometriaEspacial() {
  const [shape, setShape] = useState<SolidShape>("cubo");
  const [values, setValues] = useState<Record<string, string>>({});
  const [sol, setSol] = useState<Solution | null>(null);

  const n = (s?: string) => Number((s ?? "").replace(",", ".")) || 0;
  const current = solidShapes.find((s) => s.id === shape)!;

  return (
    <SiteLayout>
      <PageHeader
        title="Geometria espacial"
        subtitle="Volumes e áreas de superfície dos principais sólidos geométricos."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Sólidos geométricos">
          <div className="flex flex-wrap gap-2">
            {solidShapes.map((s) => (
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
                solidSolution(
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

        <CalculatorCard title="Resumo de fórmulas" description="Todos os sólidos disponíveis.">
          <div className="space-y-3">
            {solidShapes.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <ul className="mt-1 space-y-0.5 font-mono text-xs text-muted-foreground">
                  {s.formulas.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
