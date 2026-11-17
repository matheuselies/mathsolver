import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { ExercisePanel } from "@/components/ExercisePanel";
import { startGame } from "@/lib/game/game.functions";
import { STREAK_TARGET, TOTAL_PHASES, phaseLabel } from "@/lib/game/curriculum";
import type { AnswerFeedback, PlayerState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fases")({
  head: () => ({
    meta: [
      { title: "50 fases de matemática com progresso salvo — MathSolver" },
      {
        name: "description",
        content:
          "Sobe de fase acertando 10 exercícios seguidos: soma, frações, equações, geometria e trigonometria com explicação automática e progresso guardado.",
      },
      { property: "og:title", content: "50 fases de matemática — MathSolver" },
      {
        property: "og:description",
        content: "Progresso salvo, checkpoints e explicação passo a passo em cada resposta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Fases,
});

function Fases() {
  const start = useServerFn(startGame);
  const [nickname, setNickname] = useState("");
  const [state, setState] = useState<PlayerState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mathsolver:nickname");
    if (!saved) return;
    setNickname(saved);
    void start({ data: { nickname: saved } })
      .then(setState)
      .catch(() => localStorage.removeItem("mathsolver:nickname"));
  }, [start]);

  const enter = async () => {
    setBusy(true);
    setError(null);
    try {
      const player = await start({ data: { nickname } });
      localStorage.setItem("mathsolver:nickname", player.nickname);
      setState(player);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  };

  const onResult = (fb: AnswerFeedback) => {
    if (fb.state) setState(fb.state);
    if (fb.finished) setCelebrate("final");
    else if (fb.phaseUp) {
      setCelebrate("fase");
      setTimeout(() => setCelebrate(null), 2600);
    }
  };

  if (!state) {
    return (
      <SiteLayout>
        <PageHeader
          title="50 fases, um passo de cada vez"
          subtitle="Escolhe um nome para guardar o teu progresso. Sem palavra-passe, sem complicação."
        />
        <div className="max-w-md rounded-2xl border border-border bg-card/60 p-6">
          <label htmlFor="nick" className="text-sm font-medium">
            O teu nome ou apelido
          </label>
          <input
            id="nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && nickname.trim().length >= 2 && void enter()}
            maxLength={24}
            placeholder="ex.: Rita"
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          <button
            type="button"
            onClick={() => void enter()}
            disabled={busy || nickname.trim().length < 2}
            className="mt-4 w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "A entrar…" : "Começar a jogar"}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Cada fase pede {STREAK_TARGET} acertos seguidos. Se errares, a sequência volta a zero —
            mas nunca perdes a fase já conquistada.
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (state.completed) {
    return (
      <SiteLayout>
        <div className="anim-rise rounded-3xl border border-accent/50 bg-accent/10 p-8 text-center md:p-14">
          <p className="text-5xl">🏆</p>
          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Parabéns, {state.nickname}!
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Terminaste as {TOTAL_PHASES} fases do MathSolver — da soma simples à trigonometria dos
            ângulos notáveis. Isso é matemática de verdade, do início ao fim.
          </p>
          <p className="mt-4 font-mono text-sm">
            {state.totalCorrect} acertos · {state.totalWrong} tentativas falhadas
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        title={`Fase ${state.phase} · ${phaseLabel(state.phase)}`}
        subtitle={`Olá, ${state.nickname}! Acerta ${STREAK_TARGET} seguidos para avançar.`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Fase atual" value={`${state.phase} / ${TOTAL_PHASES}`} />
        <Stat label="Sequência" value={`${state.streak}/${STREAK_TARGET} acertos seguidos`} />
        <Stat label="Checkpoint" value={`Fase ${state.checkpoint}`} />
      </div>

      <div className="mb-6 flex gap-1.5">
        {Array.from({ length: STREAK_TARGET }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors duration-300",
              i < state.streak ? "bg-accent" : "bg-muted",
            )}
          />
        ))}
      </div>

      {celebrate === "fase" ? (
        <p className="anim-pop mb-4 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">
          🎉 Fase conquistada! Novo checkpoint guardado — daqui já não desces.
        </p>
      ) : null}

      <ExercisePanel mode="fase" nickname={state.nickname} onResult={onResult} />

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Mapa das {TOTAL_PHASES} fases
        </h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: TOTAL_PHASES }, (_, i) => i + 1).map((p) => (
            <li
              key={p}
              title={`Fase ${p} — ${phaseLabel(p)}`}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-xs transition-colors",
                p < state.phase
                  ? "border-accent/50 bg-accent/20 text-accent"
                  : p === state.phase
                    ? "border-primary bg-primary/20 font-bold text-primary"
                    : "border-border text-muted-foreground",
              )}
            >
              {p}
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
