import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnswerFeedback, ExerciseView, PlayerState } from "./types";

const nicknameSchema = z.object({ nickname: z.string().trim().min(2).max(24) });

const nextSchema = z.object({
  mode: z.enum(["fase", "treino"]),
  nickname: z.string().trim().max(24).optional(),
  topic: z.string().max(32).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
});

const answerSchema = z.object({
  token: z.string().min(8).max(2048),
  answer: z.string().max(64),
  nickname: z.string().trim().max(24).optional(),
});

export const startGame = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => nicknameSchema.parse(data))
  .handler(async ({ data }): Promise<PlayerState> => {
    const { getOrCreatePlayer } = await import("./players.server");
    try {
      return await getOrCreatePlayer(data.nickname);
    } catch (e) {
      console.error("startGame failed:", e instanceof Error ? e : JSON.stringify(e));
      if (e instanceof Error && e.message.startsWith("O nome")) throw e;
      throw new Error(
        "Não conseguimos guardar o teu progresso agora. Tenta de novo daqui a alguns segundos.",
      );
    }
  });

export const nextExercise = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => nextSchema.parse(data))
  .handler(async ({ data }): Promise<ExerciseView> => {
    const { generate } = await import("./engine.server");
    const { encodeToken } = await import("./token.server");
    const { phaseSpec, topicMeta } = await import("./curriculum");

    let topic: keyof typeof topicMeta;
    let difficulty: number;
    let phase = 0;

    if (data.mode === "fase") {
      if (!data.nickname) throw new Error("Nome em falta.");
      const { getPlayer } = await import("./players.server");
      const player = await getPlayer(data.nickname);
      const spec = phaseSpec(player.phase);
      topic = spec.topic;
      difficulty = spec.difficulty;
      phase = player.phase;
    } else {
      topic = (data.topic ?? "soma") as keyof typeof topicMeta;
      if (!topicMeta[topic]) topic = "soma";
      difficulty = data.difficulty ?? 1;
    }

    const exercise = generate(topic, difficulty);
    return {
      token: encodeToken({
        t: exercise.topic,
        d: exercise.difficulty,
        p: exercise.params,
        m: data.mode,
        ph: phase,
        ts: Date.now(),
      }),
      prompt: exercise.prompt,
      topic: exercise.topic,
      topicLabel: topicMeta[exercise.topic].label,
      difficulty: exercise.difficulty,
      kind: exercise.kind,
      hint: exercise.hint,
      phase,
    };
  });

export const submitAnswer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => answerSchema.parse(data))
  .handler(async ({ data }): Promise<AnswerFeedback> => {
    const { decodeToken } = await import("./token.server");
    const { solve, checkAnswer } = await import("./engine.server");
    const { topicMeta } = await import("./curriculum");
    const { correctMessages, wrongMessages, randomFrom } = await import("./feedback.server");

    const payload = decodeToken(data.token);
    if (!payload) throw new Error("Exercício inválido ou expirado. Gera um novo.");

    const solution = solve(payload.t, payload.p);
    const correct = checkAnswer(topicMeta[payload.t].kind, solution.answer, data.answer);

    const feedback: AnswerFeedback = {
      correct,
      message: correct ? randomFrom(correctMessages) : randomFrom(wrongMessages),
      formula: solution.formula,
      steps: solution.steps,
      correctAnswer: solution.answer,
    };

    if (payload.m === "fase" && data.nickname) {
      const { applyResult } = await import("./players.server");
      const result = await applyResult(data.nickname, correct);
      feedback.state = result.state;
      feedback.phaseUp = result.phaseUp;
      feedback.finished = result.finished;
    }

    return feedback;
  });
