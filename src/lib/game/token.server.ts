import { createHmac, timingSafeEqual } from "node:crypto";
import type { Topic } from "./curriculum";

export type ExerciseToken = {
  t: Topic;
  d: number;
  p: number[];
  m: "fase" | "treino";
  ph: number;
  ts: number;
};

const secret = () =>
  process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? process.env["SUPABASE_URL"] ?? "mathsolver-fallback";

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export const encodeToken = (payload: ExerciseToken): string => {
  const body = b64(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
};

export const decodeToken = (token: string): ExerciseToken | null => {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(unb64(body)) as ExerciseToken;
    if (Date.now() - parsed.ts > 1000 * 60 * 60 * 6) return null;
    return parsed;
  } catch {
    return null;
  }
};
