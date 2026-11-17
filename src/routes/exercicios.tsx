import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { CalculatorCard } from "@/components/CalculatorCard";
import {
  checkAnswer,
  exerciseKinds,
  generateExercise,
  type Exercise,
  type ExerciseKind,
} from "@/lib/math/exercises";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exercicios")({
  head: () => ({
    meta: [
      { title: "Gerador de exercícios de matemática — MathSolver" },
      {
        name: "description",
        content:
          "Pratica multiplicação, potências, raízes, percentagens, frações, MDC e MMC com correção instantânea e explicação.",
      },
      { property: "og:title", content: "Gerador de exercícios de matemática — MathSolver" },
      { property: "og:description", content: "Exercícios aleatórios com correção e pontuação." },
      { property: "og:url", content: "/exercicios" },
    ],
    links: [{ rel: "canonical", href: "/exercicios" }],
  }),
  component: Exercicios,
});

function Exercicios() {
  const [kind, setKind] = useState<ExerciseKind>("multiplicacao");
  const [exercise, setExercise] = useState<Exercise>(() => generateExercise("multiplicacao"));
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correto" | "errado">("idle");
  const [score, setScore] = useState({ certas: 0, total: 0 });

  const next = (k: ExerciseKind = kind) => {
    setExercise(generateExercise(k));
    setAnswer("");
    setStatus("idle");
  };

  const submit = () => {
    if (status !== "idle" || !answer.trim()) return;
    const ok = checkAnswer(exercise, answer);
    setStatus(ok ? "correto" : "errado");
    setScore((s) => ({ certas: s.certas + (ok ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <SiteLayout>
      <PageHeader
        title="Exercícios"
        subtitle="Gera problemas aleatórios, responde e vê a explicação completa."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <CalculatorCard title="Pratica agora">
          <div className="flex flex-wrap gap-2">
            {exerciseKinds.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  setKind(k.id);
                  next(k.id);
                }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  k.id === kind
                    ? "border-primary bg-primary/15 font-medium text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/10 p-6 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Resolve</p>
            <p className="mt-2 font-mono text-3xl text-foreground">{exercise.question}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="A tua resposta"
              className="w-40 font-mono"
            />
            <Button onClick={submit} disabled={status !== "idle"}>
              Verificar
            </Button>
            <Button variant="secondary" onClick={() => next()}>
              Novo exercício
            </Button>
          </div>

          {status !== "idle" && (
            <div
              className={cn(
                "rounded-xl border p-4 text-sm",
                status === "correto"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              <p className="font-semibold">
                {status === "correto" ? "Correto!" : `Errado — resposta: ${exercise.answer}`}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{exercise.explanation}</p>
            </div>
          )}
        </CalculatorCard>

        <CalculatorCard title="Pontuação">
          <div className="space-y-3 text-center">
            <div>
              <p className="font-mono text-4xl text-primary">
                {score.certas}/{score.total}
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">respostas certas</p>
            </div>
            <div>
              <p className="font-mono text-2xl text-accent">
                {score.total ? Math.round((score.certas / score.total) * 100) : 0}%
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">taxa de acerto</p>
            </div>
            <Button variant="ghost" onClick={() => setScore({ certas: 0, total: 0 })}>
              Reiniciar pontuação
            </Button>
          </div>
        </CalculatorCard>
      </div>
    </SiteLayout>
  );
}
