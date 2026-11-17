import { randInt, gcd } from "@/lib/math/core";
import { simplify } from "@/lib/math/fractions";
import { topicMeta, type AnswerKind, type Topic } from "./curriculum";

export type ExerciseParams = number[];

export type GeneratedExercise = {
  topic: Topic;
  difficulty: number;
  params: ExerciseParams;
  prompt: string;
  kind: AnswerKind;
  hint: string;
};

export type SolvedExercise = {
  answer: string;
  formula: string;
  steps: string[];
};

const pick = <T,>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)]!;
const at = (p: ExerciseParams, i: number) => p[i] ?? 0;

const hintFor = (kind: AnswerKind) =>
  kind === "fracao"
    ? "Escreve a resposta como fração (ex.: 3/4) ou como inteiro."
    : kind === "decimal"
      ? "Escreve a resposta em decimal (ex.: 0.5)."
      : "Escreve a resposta como número inteiro.";

/* ------------------------------------------------------------------ */
/* Geração                                                             */
/* ------------------------------------------------------------------ */

const ranges = (d: number, table: number[][]): number[] => table[Math.min(d, table.length) - 1]!;

export const generate = (topic: Topic, difficulty: number): GeneratedExercise => {
  const d = Math.max(1, Math.min(difficulty, topicMeta[topic].maxDifficulty));
  const kind = topicMeta[topic].kind;
  const wrap = (params: ExerciseParams, prompt: string): GeneratedExercise => ({
    topic,
    difficulty: d,
    params,
    prompt,
    kind,
    hint: hintFor(kind),
  });

  switch (topic) {
    case "soma": {
      const [lo, hi] = ranges(d, [
        [1, 10],
        [10, 60],
        [50, 300],
        [200, 1500],
      ]) as [number, number];
      const a = randInt(lo, hi);
      const b = randInt(lo, hi);
      return wrap([a, b], `${a} + ${b} = ?`);
    }
    case "subtracao": {
      const [lo, hi] = ranges(d, [
        [2, 10],
        [10, 60],
        [50, 300],
        [200, 1500],
      ]) as [number, number];
      const a = randInt(lo + 1, hi);
      const b = randInt(lo, a);
      return wrap([a, b], `${a} − ${b} = ?`);
    }
    case "multiplicacao": {
      const [la, ha, lb, hb] = ranges(d, [
        [1, 10, 1, 10],
        [2, 12, 2, 12],
        [11, 99, 2, 9],
        [11, 99, 11, 99],
        [100, 999, 11, 99],
      ]) as [number, number, number, number];
      const a = randInt(la, ha);
      const b = randInt(lb, hb);
      return wrap([a, b], `${a} × ${b} = ?`);
    }
    case "divisao": {
      const [ld, hd, lq, hq] = ranges(d, [
        [2, 5, 1, 10],
        [2, 10, 2, 12],
        [3, 12, 10, 30],
        [11, 40, 10, 50],
      ]) as [number, number, number, number];
      const divisor = randInt(ld, hd);
      const q = randInt(lq, hq);
      return wrap([divisor * q, divisor], `${divisor * q} ÷ ${divisor} = ?`);
    }
    case "potencia": {
      const [lb, hb, ln, hn] = ranges(d, [
        [2, 5, 2, 2],
        [2, 9, 2, 3],
        [2, 7, 3, 4],
        [2, 12, 2, 5],
      ]) as [number, number, number, number];
      const a = randInt(lb, hb);
      const n = randInt(ln, hn);
      return wrap([a, n], `${a}^${n} = ?`);
    }
    case "raiz": {
      const [lo, hi] = ranges(d, [
        [2, 10],
        [5, 20],
        [15, 40],
      ]) as [number, number];
      const r = randInt(lo, hi);
      return wrap([r * r], `√${r * r} = ?`);
    }
    case "fracao": {
      const hi = [4, 6, 9, 12, 15][d - 1] ?? 6;
      const d1 = randInt(2, hi);
      const d2 = randInt(2, hi);
      let n1 = randInt(1, d1 * 2);
      let n2 = randInt(1, d2 * 2);
      const isSub = d >= 2 && randInt(0, 1) === 1;
      if (isSub && n1 * d2 < n2 * d1) {
        [n1, n2] = [n2, n1];
        const t = d1;
        return wrap(
          [n1, d2, n2, t, 1],
          `${n1}/${d2} − ${n2}/${t} = ?`,
        );
      }
      return wrap(
        [n1, d1, n2, d2, isSub ? 1 : 0],
        `${n1}/${d1} ${isSub ? "−" : "+"} ${n2}/${d2} = ?`,
      );
    }
    case "porcentagem": {
      const percents = [
        [10, 50, 25],
        [10, 20, 25, 50, 5],
        [5, 15, 30, 40, 60, 75],
        [12, 35, 45, 65, 85, 120],
      ][d - 1] as number[];
      const p = pick(percents);
      const g = gcd(p, 100) || 1;
      const step = 100 / g;
      const total = step * randInt(1, [4, 8, 12, 20][d - 1] ?? 8);
      return wrap([p, total], `${p}% de ${total} = ?`);
    }
    case "inteiros": {
      const hi = [9, 20, 60, 200][d - 1] ?? 20;
      const a = randInt(-hi, hi) || hi;
      const b = randInt(-hi, hi) || -hi;
      const isSub = randInt(0, 1) === 1;
      const bTxt = b < 0 ? `(${b})` : `${b}`;
      return wrap([a, b, isSub ? 1 : 0], `${a} ${isSub ? "−" : "+"} ${bTxt} = ?`);
    }
    case "mdc": {
      const a = randInt(8, 90);
      const b = randInt(8, 90);
      return wrap([a, b], `MDC(${a}, ${b}) = ?`);
    }
    case "mmc": {
      const hi = d >= 2 ? 30 : 15;
      const a = randInt(2, hi);
      const b = randInt(2, hi);
      return wrap([a, b], `MMC(${a}, ${b}) = ?`);
    }
    case "equacao": {
      const [ha, hx, hb] = ranges(d, [
        [5, 5, 10],
        [9, 9, 20],
        [12, 12, 40],
        [15, 20, 80],
        [25, 30, 150],
      ]) as [number, number, number];
      const a = randInt(2, ha);
      const x = randInt(-hx, hx) || 3;
      const b = randInt(-hb, hb);
      const c = a * x + b;
      const bTxt = b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`;
      return wrap([a, b, c], `${a}x ${bTxt} = ${c}. Qual é o valor de x?`);
    }
    case "area_retangulo": {
      const base = randInt(2, 20);
      const alt = randInt(2, 20);
      return wrap([base, alt], `Um retângulo tem base ${base} cm e altura ${alt} cm. Qual é a área (cm²)?`);
    }
    case "area_triangulo": {
      let base = randInt(2, 20);
      let alt = randInt(2, 20);
      if ((base * alt) % 2 !== 0) alt += 1;
      return wrap([base, alt], `Um triângulo tem base ${base} cm e altura ${alt} cm. Qual é a área (cm²)?`);
    }
    case "area_desafio": {
      const isTriangle = randInt(0, 1) === 1;
      let base = randInt(20, 120);
      let alt = randInt(20, 120);
      if (isTriangle && (base * alt) % 2 !== 0) alt += 1;
      return wrap(
        [base, alt, isTriangle ? 1 : 0],
        isTriangle
          ? `Desafio: um triângulo tem base ${base} cm e altura ${alt} cm. Qual é a área (cm²)?`
          : `Desafio: um retângulo tem base ${base} cm e altura ${alt} cm. Qual é a área (cm²)?`,
      );
    }
    case "trigonometria": {
      const fns = ["sen", "cos", "tan"] as const;
      const angles = d === 1 ? [30, 45, 60] : [0, 30, 45, 60, 90];
      let fnIndex = randInt(0, 2);
      let angle = pick(angles);
      // tan(90°) não existe
      while (fns[fnIndex] === "tan" && angle === 90) {
        angle = pick(angles);
      }
      return wrap([fnIndex, angle], `${fns[fnIndex]}(${angle}°) = ?  (valor decimal)`);
    }
  }
};

/* ------------------------------------------------------------------ */
/* Resolução + explicação                                              */
/* ------------------------------------------------------------------ */

const trigTable: Record<number, { sen: [string, number]; cos: [string, number]; tan: [string, number] }> = {
  0: { sen: ["0", 0], cos: ["1", 1], tan: ["0", 0] },
  30: { sen: ["1/2", 0.5], cos: ["√3/2", Math.sqrt(3) / 2], tan: ["√3/3", Math.sqrt(3) / 3] },
  45: { sen: ["√2/2", Math.SQRT2 / 2], cos: ["√2/2", Math.SQRT2 / 2], tan: ["1", 1] },
  60: { sen: ["√3/2", Math.sqrt(3) / 2], cos: ["1/2", 0.5], tan: ["√3", Math.sqrt(3)] },
  90: { sen: ["1", 1], cos: ["0", 0], tan: ["não existe", NaN] },
};

const round4 = (n: number) => String(Number(n.toFixed(4)));

export const solve = (topic: Topic, params: ExerciseParams): SolvedExercise => {
  switch (topic) {
    case "soma": {
      const a = at(params, 0);
      const b = at(params, 1);
      return {
        answer: String(a + b),
        formula: "total = a + b",
        steps: [`Juntamos as duas quantidades: ${a} + ${b}.`, `${a} + ${b} = ${a + b}.`],
      };
    }
    case "subtracao": {
      const a = at(params, 0);
      const b = at(params, 1);
      return {
        answer: String(a - b),
        formula: "diferença = a − b",
        steps: [`Tiramos ${b} de ${a}.`, `${a} − ${b} = ${a - b}.`],
      };
    }
    case "multiplicacao": {
      const a = at(params, 0);
      const b = at(params, 1);
      return {
        answer: String(a * b),
        formula: "produto = a × b",
        steps: [
          `Multiplicar é somar ${a} repetido ${b} vezes.`,
          `${a} × ${b} = ${a * b}.`,
          `Pela comutativa, ${b} × ${a} dá o mesmo: ${a * b}.`,
        ],
      };
    }
    case "divisao": {
      const a = at(params, 0);
      const b = at(params, 1);
      const q = a / b;
      return {
        answer: String(q),
        formula: "quociente = dividendo ÷ divisor",
        steps: [
          `Procuramos o número que multiplicado por ${b} dá ${a}.`,
          `${b} × ${q} = ${a}, logo ${a} ÷ ${b} = ${q}.`,
        ],
      };
    }
    case "potencia": {
      const a = at(params, 0);
      const n = at(params, 1);
      return {
        answer: String(a ** n),
        formula: "aⁿ = a × a × … (n vezes)",
        steps: [
          `Atenção: aⁿ NÃO é a × n. É a multiplicado por si próprio n vezes.`,
          `${Array(n).fill(a).join(" × ")} = ${a ** n}.`,
        ],
      };
    }
    case "raiz": {
      const n = at(params, 0);
      const r = Math.round(Math.sqrt(n));
      return {
        answer: String(r),
        formula: "√n = b  ⟺  b² = n",
        steps: [`Procuramos b tal que b² = ${n}.`, `${r}² = ${r * r}, logo √${n} = ${r}.`],
      };
    }
    case "fracao": {
      const n1 = at(params, 0);
      const d1 = at(params, 1);
      const n2 = at(params, 2);
      const d2 = at(params, 3);
      const isSub = at(params, 4) === 1;
      const den = d1 * d2;
      const num = isSub ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1;
      const s = simplify({ n: num, d: den });
      return {
        answer: s.d === 1 ? String(s.n) : `${s.n}/${s.d}`,
        formula: isSub ? "a/b − c/d = (a×d − c×b) / (b×d)" : "a/b + c/d = (a×d + c×b) / (b×d)",
        steps: [
          `Denominador comum: ${d1} × ${d2} = ${den}.`,
          `Numeradores: ${n1}×${d2} ${isSub ? "−" : "+"} ${n2}×${d1} = ${num}.`,
          `Fica ${num}/${den}, que simplificado dá ${s.d === 1 ? s.n : `${s.n}/${s.d}`}.`,
        ],
      };
    }
    case "porcentagem": {
      const p = at(params, 0);
      const total = at(params, 1);
      const r = (p / 100) * total;
      return {
        answer: String(r),
        formula: "x% de y = (x ÷ 100) × y",
        steps: [
          `${p}% significa ${p} em cada 100.`,
          `(${p} ÷ 100) × ${total} = ${p / 100} × ${total} = ${r}.`,
        ],
      };
    }
    case "inteiros": {
      const a = at(params, 0);
      const b = at(params, 1);
      const isSub = at(params, 2) === 1;
      const r = isSub ? a - b : a + b;
      const bTxt = b < 0 ? `(${b})` : `${b}`;
      return {
        answer: String(r),
        formula: isSub ? "a − b = a + (−b)" : "a + b (regra de sinais)",
        steps: isSub
          ? [
              `Subtrair é somar o oposto: ${a} − ${bTxt} = ${a} + (${-b}).`,
              Math.sign(a) === Math.sign(-b)
                ? "Sinais iguais: somam-se os valores absolutos e mantém-se o sinal."
                : "Sinais diferentes: subtraem-se os valores absolutos e fica o sinal do maior.",
              `Resultado: ${r}.`,
            ]
          : [
              Math.sign(a) === Math.sign(b)
                ? "Sinais iguais: somam-se os valores absolutos e mantém-se o sinal."
                : "Sinais diferentes: subtraem-se os valores absolutos e fica o sinal do maior.",
              `${a} + ${bTxt} = ${r}.`,
            ],
      };
    }
    case "mdc": {
      let x = at(params, 0);
      let y = at(params, 1);
      const steps: string[] = ["Algoritmo de Euclides: MDC(a, b) = MDC(b, a mod b)."];
      while (y) {
        steps.push(`${x} ÷ ${y} → resto ${x % y}, logo MDC(${x}, ${y}) = MDC(${y}, ${x % y}).`);
        [x, y] = [y, x % y];
      }
      steps.push(`Resto 0: o MDC é ${x}.`);
      return { answer: String(x), formula: "MDC(a, b) = MDC(b, a mod b)", steps };
    }
    case "mmc": {
      const a = at(params, 0);
      const b = at(params, 1);
      const g = gcd(a, b) || 1;
      const m = (a * b) / g;
      return {
        answer: String(m),
        formula: "MMC(a, b) = (a × b) ÷ MDC(a, b)",
        steps: [`MDC(${a}, ${b}) = ${g}.`, `MMC = (${a} × ${b}) ÷ ${g} = ${a * b} ÷ ${g} = ${m}.`],
      };
    }
    case "equacao": {
      const a = at(params, 0);
      const b = at(params, 1);
      const c = at(params, 2);
      const x = (c - b) / a;
      return {
        answer: String(x),
        formula: "ax + b = c  →  x = (c − b) ÷ a",
        steps: [
          `Passamos o ${b} para o outro lado: ${a}x = ${c} − (${b}) = ${c - b}.`,
          `Dividimos por ${a}: x = ${c - b} ÷ ${a} = ${x}.`,
          `Verificação: ${a} × ${x} + (${b}) = ${a * x + b} = ${c}. ✔`,
        ],
      };
    }
    case "area_retangulo": {
      const base = at(params, 0);
      const alt = at(params, 1);
      return {
        answer: String(base * alt),
        formula: "A = base × altura",
        steps: [`A = ${base} × ${alt} = ${base * alt} cm².`],
      };
    }
    case "area_triangulo": {
      const base = at(params, 0);
      const alt = at(params, 1);
      return {
        answer: String((base * alt) / 2),
        formula: "A = (base × altura) ÷ 2",
        steps: [
          `Primeiro base × altura: ${base} × ${alt} = ${base * alt}.`,
          `Depois a metade: ${base * alt} ÷ 2 = ${(base * alt) / 2} cm².`,
        ],
      };
    }
    case "area_desafio": {
      const base = at(params, 0);
      const alt = at(params, 1);
      const isTriangle = at(params, 2) === 1;
      return isTriangle
        ? {
            answer: String((base * alt) / 2),
            formula: "A = (base × altura) ÷ 2",
            steps: [
              `${base} × ${alt} = ${base * alt}.`,
              `Metade: ${base * alt} ÷ 2 = ${(base * alt) / 2} cm².`,
            ],
          }
        : {
            answer: String(base * alt),
            formula: "A = base × altura",
            steps: [`A = ${base} × ${alt} = ${base * alt} cm².`],
          };
    }
    case "trigonometria": {
      const fns = ["sen", "cos", "tan"] as const;
      const fn = fns[at(params, 0)] ?? "sen";
      const angle = at(params, 1);
      const entry = trigTable[angle] ?? trigTable[0]!;
      const [exact, value] = entry[fn];
      return {
        answer: round4(value),
        formula: "Tabela dos ângulos notáveis (0°, 30°, 45°, 60°, 90°)",
        steps: [
          `Na tabela dos ângulos notáveis: ${fn}(${angle}°) = ${exact} (valor exato).`,
          `Em decimal: ${fn}(${angle}°) ≈ ${round4(value)}.`,
        ],
      };
    }
  }
};

/* ------------------------------------------------------------------ */
/* Verificação de resposta                                             */
/* ------------------------------------------------------------------ */

export const checkAnswer = (kind: AnswerKind, expected: string, input: string): boolean => {
  const clean = (s: string) => s.trim().replace(/\s+/g, "").replace(",", ".");
  const a = clean(input);
  const b = clean(expected);
  if (!a) return false;
  if (a === b) return true;

  if (kind === "fracao") {
    const toFrac = (s: string) => {
      if (s.includes("/")) {
        const [n, dd] = s.split("/");
        const nn = Number(n);
        const dv = Number(dd);
        if (!Number.isFinite(nn) || !Number.isFinite(dv) || dv === 0) return null;
        return simplify({ n: nn, d: dv });
      }
      const v = Number(s);
      return Number.isInteger(v) ? { n: v, d: 1 } : null;
    };
    const fa = toFrac(a);
    const fb = toFrac(b);
    if (fa && fb) return fa.n === fb.n && fa.d === fb.d;
    return false;
  }

  const na = Number(a);
  const nb = Number(b);
  if (!Number.isFinite(na) || !Number.isFinite(nb)) return false;
  return Math.abs(na - nb) < (kind === "decimal" ? 0.01 : 1e-9);
};
