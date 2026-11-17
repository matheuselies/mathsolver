import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TOTAL_PHASES, STREAK_TARGET } from "./curriculum";
import type { PlayerState } from "./types";

type Row = {
  nickname: string;
  phase: number;
  streak: number;
  checkpoint: number;
  completed: boolean;
  total_correct: number;
  total_wrong: number;
};

const toState = (row: Row): PlayerState => ({
  nickname: row.nickname,
  phase: row.phase,
  streak: row.streak,
  checkpoint: row.checkpoint,
  completed: row.completed,
  totalCorrect: row.total_correct,
  totalWrong: row.total_wrong,
});

const SELECT = "nickname, phase, streak, checkpoint, completed, total_correct, total_wrong";

export const normalizeNickname = (raw: string) => raw.trim().replace(/\s+/g, " ").slice(0, 24);

export const getOrCreatePlayer = async (nickname: string): Promise<PlayerState> => {
  const name = normalizeNickname(nickname);
  if (name.length < 2) throw new Error("O nome precisa de pelo menos 2 caracteres.");

  const existing = await supabaseAdmin
    .from("players")
    .select(SELECT)
    .eq("nickname_key", name.toLowerCase())
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return toState(existing.data as Row);

  const created = await supabaseAdmin.from("players").insert({ nickname: name }).select(SELECT).single();
  if (created.error) throw created.error;
  return toState(created.data as Row);
};

export const getPlayer = async (nickname: string): Promise<PlayerState> => getOrCreatePlayer(nickname);

export const applyResult = async (
  nickname: string,
  correct: boolean,
): Promise<{ state: PlayerState; phaseUp: boolean; finished: boolean }> => {
  const current = await getOrCreatePlayer(nickname);

  let { phase, streak, checkpoint, completed, totalCorrect, totalWrong } = current;
  let phaseUp = false;

  if (correct) {
    totalCorrect += 1;
    streak += 1;
    if (streak >= STREAK_TARGET) {
      streak = 0;
      if (phase >= TOTAL_PHASES) {
        completed = true;
        phase = TOTAL_PHASES;
        checkpoint = TOTAL_PHASES;
      } else {
        phase += 1;
        checkpoint = Math.max(checkpoint, phase);
        phaseUp = true;
      }
    }
  } else {
    totalWrong += 1;
    streak = 0;
  }

  const updated = await supabaseAdmin
    .from("players")
    .update({
      phase,
      streak,
      checkpoint,
      completed,
      total_correct: totalCorrect,
      total_wrong: totalWrong,
    })
    .eq("nickname_key", current.nickname.toLowerCase())
    .select(SELECT)
    .single();
  if (updated.error) throw updated.error;

  return { state: toState(updated.data as Row), phaseUp, finished: completed };
};
