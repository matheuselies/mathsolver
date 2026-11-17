export type Step = { label: string; expr: string };

export type Solution = {
  result: string;
  steps: Step[];
  error?: string;
};

export const fmt = (n: number, digits = 6): string => {
  if (!Number.isFinite(n)) return "indefinido";
  const rounded = Number(n.toFixed(digits));
  return String(rounded);
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* ---------- Operações básicas ---------- */

export type BasicOp = "soma" | "subtracao" | "multiplicacao" | "divisao";

export const basicOperation = (a: number, b: number, op: BasicOp): Solution => {
  switch (op) {
    case "soma":
      return { result: fmt(a + b), steps: [{ label: "a + b", expr: `${a} + ${b} = ${fmt(a + b)}` }] };
    case "subtracao":
      return { result: fmt(a - b), steps: [{ label: "a − b", expr: `${a} − ${b} = ${fmt(a - b)}` }] };
    case "multiplicacao":
      return {
        result: fmt(a * b),
        steps: [
          { label: "a × b", expr: `${a} × ${b} = ${fmt(a * b)}` },
          { label: "Comutativa", expr: `${b} × ${a} = ${fmt(a * b)}` },
        ],
      };
    case "divisao":
      if (b === 0)
        return { result: "—", steps: [], error: "Divisão por zero não é permitida (b ≠ 0)." };
      return { result: fmt(a / b), steps: [{ label: "a ÷ b", expr: `${a} ÷ ${b} = ${fmt(a / b)}` }] };
  }
};

/* ---------- Potenciação e radiciação ---------- */

export const power = (a: number, n: number): Solution => {
  if (a === 0 && n < 0)
    return { result: "—", steps: [], error: "0 elevado a expoente negativo é indefinido." };
  const r = Math.pow(a, n);
  const steps: Step[] = [{ label: "aⁿ", expr: `${a}^${n} = ${fmt(r)}` }];
  if (Number.isInteger(n) && n > 1 && n <= 8)
    steps.push({ label: "Expansão", expr: `${Array(n).fill(a).join(" × ")} = ${fmt(r)}` });
  if (n === 0) steps.push({ label: "Propriedade", expr: "a⁰ = 1 (a ≠ 0)" });
  if (n < 0) steps.push({ label: "Propriedade", expr: `a⁻ⁿ = 1 / aⁿ = 1 / ${fmt(Math.pow(a, -n))}` });
  return { result: fmt(r), steps };
};

export const nthRoot = (a: number, n: number): Solution => {
  if (n === 0) return { result: "—", steps: [], error: "O índice da raiz não pode ser 0." };
  if (a < 0 && n % 2 === 0)
    return { result: "—", steps: [], error: "Raiz de índice par de número negativo não é real." };
  const sign = a < 0 ? -1 : 1;
  const r = sign * Math.pow(Math.abs(a), 1 / n);
  return {
    result: fmt(r),
    steps: [
      { label: "Definição", expr: `${n}√${a} = b  ⟺  b^${n} = ${a}` },
      { label: "Forma de potência", expr: `${n}√${a} = ${a}^(1/${n}) = ${fmt(r)}` },
      { label: "Verificação", expr: `${fmt(r)}^${n} ≈ ${fmt(Math.pow(r, n))}` },
    ],
  };
};

/* ---------- Percentagem ---------- */

export const percentOf = (percent: number, total: number): Solution => ({
  result: fmt((percent / 100) * total),
  steps: [
    { label: "Fórmula", expr: "Parte = (x / 100) × Total" },
    { label: "Cálculo", expr: `(${percent} / 100) × ${total} = ${fmt((percent / 100) * total)}` },
  ],
});

export const percentRatio = (part: number, total: number): Solution => {
  if (total === 0) return { result: "—", steps: [], error: "O total não pode ser zero." };
  const r = (part / total) * 100;
  return {
    result: `${fmt(r)} %`,
    steps: [
      { label: "Fórmula", expr: "Percentagem = (Parte / Total) × 100%" },
      { label: "Cálculo", expr: `(${part} / ${total}) × 100 = ${fmt(r)} %` },
    ],
  };
};

export const applyPercent = (value: number, percent: number, mode: "aumento" | "desconto"): Solution => {
  const factor = mode === "aumento" ? 1 + percent / 100 : 1 - percent / 100;
  const r = value * factor;
  return {
    result: fmt(r),
    steps: [
      {
        label: "Fórmula",
        expr: mode === "aumento" ? "Final = Inicial × (1 + x/100)" : "Final = Inicial × (1 − x/100)",
      },
      { label: "Cálculo", expr: `${value} × ${fmt(factor)} = ${fmt(r)}` },
      { label: "Variação", expr: `${mode === "aumento" ? "+" : "−"}${fmt(Math.abs(r - value))}` },
    ],
  };
};

/* ---------- MDC / MMC / fatoração ---------- */

export const gcd = (a: number, b: number): number => {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) [a, b] = [b, a % b];
  return a;
};

export const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

export const gcdSolution = (a: number, b: number): Solution => {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  const steps: Step[] = [{ label: "Algoritmo de Euclides", expr: "MDC(a, b) = MDC(b, a mod b)" }];
  while (y) {
    steps.push({ label: "Passo", expr: `MDC(${x}, ${y}) → ${x} mod ${y} = ${x % y}` });
    [x, y] = [y, x % y];
  }
  steps.push({ label: "Resto 0", expr: `MDC(${Math.abs(a)}, ${Math.abs(b)}) = ${x}` });
  return { result: String(x), steps };
};

export const lcmSolution = (a: number, b: number): Solution => {
  const d = gcd(a, b);
  if (d === 0) return { result: "0", steps: [{ label: "Nota", expr: "MMC com zero é 0." }] };
  const m = lcm(a, b);
  return {
    result: String(m),
    steps: [
      { label: "Propriedade", expr: "MDC(a,b) × MMC(a,b) = a × b" },
      { label: "MDC", expr: `MDC(${a}, ${b}) = ${d}` },
      { label: "Cálculo", expr: `MMC = |${a} × ${b}| / ${d} = ${m}` },
    ],
  };
};

export const primeFactors = (n: number): Record<number, number> => {
  let x = Math.abs(Math.trunc(n));
  const out: Record<number, number> = {};
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      out[p] = (out[p] ?? 0) + 1;
      x /= p;
    }
  }
  if (x > 1) out[x] = (out[x] ?? 0) + 1;
  return out;
};

export const factorString = (n: number): string => {
  if (Math.abs(n) < 2) return String(n);
  const f = primeFactors(n);
  const sup = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
  return Object.entries(f)
    .map(([p, e]) => (Number(e) > 1 ? `${p}${sup[Number(e)] ?? `^${e}`}` : p))
    .join(" × ");
};

export const divisors = (n: number): number[] => {
  const x = Math.abs(Math.trunc(n));
  const out: number[] = [];
  for (let i = 1; i <= x; i++) if (x % i === 0) out.push(i);
  return out;
};

/* ---------- Inteiros ---------- */

export const integerOperation = (a: number, b: number, op: BasicOp): Solution => {
  const base = basicOperation(a, b, op);
  if (base.error) return base;
  const rule: Record<BasicOp, string> = {
    soma:
      Math.sign(a) === Math.sign(b)
        ? "Mesmo sinal: somam-se os valores absolutos e mantém-se o sinal."
        : "Sinais diferentes: subtraem-se os valores absolutos e fica o sinal do maior.",
    subtracao: `a − b = a + (−b) → ${a} + (${-b})`,
    multiplicacao:
      Math.sign(a) * Math.sign(b) >= 0 ? "(+)×(+) e (−)×(−) dão (+)" : "(+)×(−) e (−)×(+) dão (−)",
    divisao: "A regra de sinais da divisão é igual à da multiplicação.",
  };
  return { ...base, steps: [{ label: "Regra de sinais", expr: rule[op] }, ...base.steps] };
};
