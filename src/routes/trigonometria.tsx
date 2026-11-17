import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard, FormulaBlock } from "@/components/CalculatorCard";
import { StepsResult } from "@/components/StepsResult";
import type { Solution } from "@/lib/math/core";
import {
  lawOfCosines,
  lawOfSines,
  rightTriangle,
  specialAngles,
  trigRatios,
} from "@/lib/math/trigonometry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/trigonometria")({
  head: () => ({
    meta: [
      { title: "Trigonometria: seno, cosseno e tangente — MathSolver" },
      {
        name: "description",
        content:
          "Razões trigonométricas, triângulo retângulo, ângulos notáveis e leis dos senos e dos cossenos com resolução passo a passo.",
      },
      { property: "og:title", content: "Trigonometria: seno, cosseno e tangente — MathSolver" },
      { property: "og:description", content: "Trigonometria aplicada com fórmulas e cálculos." },
      { property: "og:url", content: "/trigonometria" },
    ],
    links: [{ rel: "canonical", href: "/trigonometria" }],
  }),
  component: Trigonometria,
});

function Trigonometria() {
  const n = (s: string) => Number(s.replace(",", ".")) || 0;

  const [ang, setAng] = useState("30");
  const [s1, setS1] = useState<Solution | null>(null);

  const [tAng, setTAng] = useState("30");
  const [hyp, setHyp] = useState("10");
  const [s2, setS2] = useState<Solution | null>(null);

  const [ca, setCa] = useState("5");
  const [cb, setCb] = useState("7");
  const [cAng, setCAng] = useState("60");
  const [s3, setS3] = useState<Solution | null>(null);

  const [sa, setSa] = useState("10");
  const [angA, setAngA] = useState("30");
  const [angB, setAngB] = useState("45");
  const [s4, setS4] = useState<Solution | null>(null);

  return (
    <SiteLayout>
      <PageHeader
        title="Trigonometria"
        subtitle="Seno, cosseno e tangente, triângulo retângulo e as leis dos senos e cossenos."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CalculatorCard title="Razões trigonométricas" description="Para um ângulo em graus.">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Ângulo (°)</label>
            <Input value={ang} onChange={(e) => setAng(e.target.value)} className="mt-1 font-mono" />
          </div>
          <div className="flex flex-wrap gap-2">
            {specialAngles.map((a) => (
              <Button key={a.deg} variant="secondary" size="sm" onClick={() => setAng(String(a.deg))}>
                {a.deg}°
              </Button>
            ))}
          </div>
          <Button onClick={() => setS1(trigRatios(n(ang)))}>Calcular</Button>
          <StepsResult solution={s1} />
          <FormulaBlock
            formulas={[
              "sen(θ) = cateto oposto / hipotenusa",
              "cos(θ) = cateto adjacente / hipotenusa",
              "tan(θ) = sen(θ) / cos(θ)",
              "sen²(θ) + cos²(θ) = 1",
            ]}
          />
        </CalculatorCard>

        <CalculatorCard title="Ângulos notáveis" description="Valores exatos a memorizar.">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">θ</th>
                  <th>sen</th>
                  <th>cos</th>
                  <th>tan</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {specialAngles.map((a) => (
                  <tr key={a.deg} className="border-b border-border/50">
                    <td className="py-2 text-primary">{a.deg}°</td>
                    <td>{a.sen}</td>
                    <td>{a.cos}</td>
                    <td>{a.tan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CalculatorCard>

        <CalculatorCard title="Triângulo retângulo" description="A partir de um ângulo e da hipotenusa.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Ângulo (°)</label>
              <Input value={tAng} onChange={(e) => setTAng(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Hipotenusa</label>
              <Input value={hyp} onChange={(e) => setHyp(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button onClick={() => setS2(rightTriangle(n(tAng), n(hyp)))}>Calcular catetos</Button>
          <StepsResult solution={s2} />
          <FormulaBlock formulas={["CO = h × sen(θ)", "CA = h × cos(θ)"]} />
        </CalculatorCard>

        <CalculatorCard title="Leis dos cossenos e dos senos">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Lado a</label>
              <Input value={ca} onChange={(e) => setCa(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Lado b</label>
              <Input value={cb} onChange={(e) => setCb(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Ângulo C (°)</label>
              <Input value={cAng} onChange={(e) => setCAng(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button onClick={() => setS3(lawOfCosines(n(ca), n(cb), n(cAng)))}>Lei dos cossenos</Button>
          <StepsResult solution={s3} />

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Lado a</label>
              <Input value={sa} onChange={(e) => setSa(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Ângulo A (°)</label>
              <Input value={angA} onChange={(e) => setAngA(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Ângulo B (°)</label>
              <Input value={angB} onChange={(e) => setAngB(e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
          <Button variant="secondary" onClick={() => setS4(lawOfSines(n(sa), n(angA), n(angB)))}>
            Lei dos senos
          </Button>
          <StepsResult solution={s4} />
          <FormulaBlock
            formulas={["c² = a² + b² − 2ab·cos(C)", "a/sen(A) = b/sen(B) = c/sen(C)"]}
          />
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
