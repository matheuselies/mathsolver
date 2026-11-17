import { fmt, gcd, randInt } from "./core";
import { simplify } from "./fractions";

export type ExerciseKind =
  | "multiplicacao"
  | "soma"
  | "subtracao"
  | "divisao"
  | "potencia"
  | "raiz"
  | "percentagem"
  | "fracao"
  | "mdc"
  | "mmc";

export type Exercise = {
  kind: ExerciseKind;
  question: string;
  answer: string;
  explanation: string;
};

export const exerciseKinds: { id: ExerciseKind; label: string }[] = [
  { id: "multiplicacao", label: "Multiplicação" },
  { id: "soma", label: "Soma" },
  { id: "subtracao", label: "Subtração" },
  { id: "divisao", label: "Divisão exata" },
  { id: "potencia", label: "Potenciação" },
  { id: "raiz", label: "Raiz quadrada" },
  { id: "percentagem", label: "Percentagem" },
  { id: "fracao", label: "Soma de frações" },
  { id: "mdc", label: "MDC" },
  { id: "mmc", label: "MMC" },
];

export const generateExercise = (kind: ExerciseKind): Exercise => {
  switch (kind) {
    case "multiplicacao": {
      const a = randInt(1, 10);
      const b = randInt(1, 10);
      return {
        kind,
        question: `${a} × ${b} = ?`,
        answer: String(a * b),
        explanation: `${a} × ${b} = ${a * b}`,
      };
    }
    case "soma": {
      const a = randInt(1, 20);
      const b = randInt(1, 20);
      return { kind, question: `${a} + ${b} = ?`, answer: String(a + b), explanation: `${a} + ${b} = ${a + b}` };
    }
    case "subtracao": {
      const a = randInt(1, 20);
      const b = randInt(1, a);
      return { kind, question: `${a} − ${b} = ?`, answer: String(a - b), explanation: `${a} − ${b} = ${a - b}` };
    }
    case "divisao": {
      const b = randInt(2, 10);
      const q = randInt(1, 10);
      return {
        kind,
        question: `${b * q} ÷ ${b} = ?`,
        answer: String(q),
        explanation: `${b} × ${q} = ${b * q}, logo ${b * q} ÷ ${b} = ${q}`,
      };
    }
    case "potencia": {
      const a = randInt(2, 9);
      const n = randInt(2, 3);
      return {
        kind,
        question: `${a}^${n} = ?`,
        answer: String(a ** n),
        explanation: `${Array(n).fill(a).join(" × ")} = ${a ** n}`,
      };
    }
    case "raiz": {
      const r = randInt(2, 15);
      return {
        kind,
        question: `√${r * r} = ?`,
        answer: String(r),
        explanation: `${r}² = ${r * r}, logo √${r * r} = ${r}`,
      };
    }
    case "percentagem": {
      const p = [10, 20, 25, 50, 5][randInt(0, 4)] as number;
      const total = randInt(2, 20) * 10;
      return {
        kind,
        question: `${p}% de ${total} = ?`,
        answer: fmt((p / 100) * total),
        explanation: `(${p}/100) × ${total} = ${fmt((p / 100) * total)}`,
      };
    }
    case "fracao": {
      const a = randInt(1, 5);
      const b = randInt(2, 6);
      const c = randInt(1, 5);
      const d = randInt(2, 6);
      const s = simplify({ n: a * d + c * b, d: b * d });
      return {
        kind,
        question: `${a}/${b} + ${c}/${d} = ?  (escreve como n/d)`,
        answer: s.d === 1 ? String(s.n) : `${s.n}/${s.d}`,
        explanation: `(${a}×${d} + ${c}×${b}) / (${b}×${d}) = ${a * d + c * b}/${b * d} = ${s.n}/${s.d}`,
      };
    }
    case "mdc": {
      const a = randInt(4, 60);
      const b = randInt(4, 60);
      return { kind, question: `MDC(${a}, ${b}) = ?`, answer: String(gcd(a, b)), explanation: `Algoritmo de Euclides → ${gcd(a, b)}` };
    }
    case "mmc": {
      const a = randInt(2, 15);
      const b = randInt(2, 15);
      const m = (a * b) / gcd(a, b);
      return {
        kind,
        question: `MMC(${a}, ${b}) = ?`,
        answer: String(m),
        explanation: `MMC = (${a} × ${b}) / MDC(${a},${b}) = ${a * b} / ${gcd(a, b)} = ${m}`,
      };
    }
  }
};

export const checkAnswer = (exercise: Exercise, input: string): boolean => {
  const clean = (s: string) => s.replace(/\s/g, "").replace(",", ".");
  const a = clean(input);
  const b = clean(exercise.answer);
  if (a === b) return true;
  if (a.includes("/") && b.includes("/")) {
    const [an, ad] = a.split("/").map(Number);
    const [bn, bd] = b.split("/").map(Number);
    if (an !== undefined && ad) {
      const sa = simplify({ n: an, d: ad });
      const sb = simplify({ n: bn ?? 0, d: bd ?? 1 });
      return sa.n === sb.n && sa.d === sb.d;
    }
  }
  const na = Number(a);
  const nb = Number(b);
  return Number.isFinite(na) && Number.isFinite(nb) && Math.abs(na - nb) < 1e-6;
};
