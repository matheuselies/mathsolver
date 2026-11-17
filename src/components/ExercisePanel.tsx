import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { nextExercise, submitAnswer } from "@/lib/game/game.functions";
import type { AnswerFeedback, ExerciseView } from "@/lib/game/types";
import { cn } from "@/lib/utils";

type Props = {
  mode: "fase" | "treino";
  nickname?: string;
  topic?: string;
  difficulty?: number;
  onResult?: (feedback: AnswerFeedback) => void;
  paused?: boolean;
};

export function ExercisePanel({ mode, nickname, topic, difficulty, onResult, paused }: Props) {
  const getExercise = useServerFn(nextExercise);
  const sendAnswer = useServerFn(submitAnswer);

  const [exercise, setExercise] = useState<ExerciseView | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setAnswer("");
    try {
      const data = await getExercise({
        data: {
          mode,
          ...(nickname ? { nickname } : {}),
          ...(topic ? { topic } : {}),
          ...(difficulty ? { difficulty } : {}),
        },
      });
      setExercise(data);
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível gerar o exercício.");
    } finally {
      setLoading(false);
    }
  }, [getExercise, mode, nickname, topic, difficulty]);

  useEffect(() => {
    if (paused) return;
    void load();
  }, [load, paused]);

  const send = async () => {
    if (!exercise || !answer.trim() || feedback) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendAnswer({
        data: { token: exercise.token, answer, ...(nickname ? { nickname } : {}) },
      });
      setFeedback(result);
      onResult?.(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível corrigir a resposta.");
    } finally {
      setLoading(false);
    }
  };

  if (paused) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
      {error ? (
        <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {exercise ? (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {exercise.topicLabel} · nível {exercise.difficulty}
          </p>
          <p key={exercise.token} className="anim-pop mt-3 font-mono text-2xl font-bold md:text-3xl">
            {exercise.prompt}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{exercise.hint}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") (feedback ? void load() : void send());
              }}
              disabled={!!feedback || loading}
              placeholder="A tua resposta"
              inputMode="text"
              aria-label="Resposta"
              className="w-40 rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            {feedback ? (
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Próximo exercício
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !answer.trim()}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Verificar
              </button>
            )}
          </div>

          {feedback ? (
            <div
              className={cn(
                "anim-rise mt-5 rounded-xl border p-4",
                feedback.correct
                  ? "border-accent/50 bg-accent/10"
                  : "border-chart-3/50 bg-chart-3/10",
              )}
            >
              <p
                className={cn(
                  "font-display text-lg font-bold",
                  feedback.correct ? "text-accent" : "text-chart-3",
                )}
              >
                {feedback.message}
              </p>
              {!feedback.correct ? (
                <p className="mt-1 text-sm">
                  Resposta correta: <span className="font-mono font-semibold">{feedback.correctAnswer}</span>
                </p>
              ) : null}
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Fórmula
              </p>
              <p className="font-mono text-sm">{feedback.formula}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {feedback.correct ? "Porque está certo" : "Como resolver"}
              </p>
              <ol className="mt-1 space-y-1 text-sm text-muted-foreground">
                {feedback.steps.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-primary">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{loading ? "A gerar exercício…" : "—"}</p>
      )}
    </div>
  );
}
