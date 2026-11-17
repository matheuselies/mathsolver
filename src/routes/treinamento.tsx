import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { ExercisePanel } from "@/components/ExercisePanel";
import { topicMeta, type Topic } from "@/lib/game/curriculum";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/treinamento")({
  head: () => ({
    meta: [
      { title: "Treinamento livre de matemática — MathSolver" },
      {
        name: "description",
        content:
          "Treina qualquer tópico com tentativas ilimitadas: soma, frações, potências, equações, áreas e trigonometria, com explicação passo a passo em cada resposta.",
      },
      { property: "og:title", content: "Treinamento livre — MathSolver" },
      {
        property: "og:description",
        content: "Escolhe o tópico e a dificuldade e pratica sem limites, sem afetar as fases.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Treinamento,
});

const topics = Object.keys(topicMeta) as Topic[];

function Treinamento() {
  const [topic, setTopic] = useState<Topic>("soma");
  const [difficulty, setDifficulty] = useState(1);
  const max = topicMeta[topic].maxDifficulty;

  return (
    <SiteLayout>
      <PageHeader
        title="Treinamento livre"
        subtitle="Escolhe o tópico e a dificuldade e pratica à vontade: tentativas ilimitadas e nada afeta o teu progresso nas fases."
      />

      <div className="mb-6 rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tópico
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTopic(t);
                setDifficulty((d) => Math.min(d, topicMeta[t].maxDifficulty));
              }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                topic === t
                  ? "border-primary bg-primary/15 font-semibold text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {topicMeta[t].label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Dificuldade
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from({ length: max }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(
                "h-9 w-9 rounded-lg border font-mono text-xs transition-colors",
                difficulty === d
                  ? "border-accent bg-accent/20 font-bold text-accent"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <ExercisePanel key={`${topic}-${difficulty}`} mode="treino" topic={topic} difficulty={difficulty} />
    </SiteLayout>
  );
}
