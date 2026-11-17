import { gcd, type Solution } from "./core";

export type Fraction = { n: number; d: number };

export const simplify = ({ n, d }: Fraction): Fraction => {
  if (d === 0) return { n, d };
  const g = gcd(n, d) || 1;
  const sign = d < 0 ? -1 : 1;
  return { n: (sign * n) / g, d: (sign * d) / g };
};

export const fracText = ({ n, d }: Fraction) => (d === 1 ? `${n}` : `${n}/${d}`);

export const mixedText = ({ n, d }: Fraction): string => {
  const s = simplify({ n, d });
  if (s.d === 1 || Math.abs(s.n) < s.d) return fracText(s);
  const whole = Math.trunc(s.n / s.d);
  const rest = Math.abs(s.n % s.d);
  return rest === 0 ? `${whole}` : `${whole} ${rest}/${s.d}`;
};

export type FracOp = "soma" | "subtracao" | "multiplicacao" | "divisao";

export const fractionOperation = (a: Fraction, b: Fraction, op: FracOp): Solution => {
  if (a.d === 0 || b.d === 0)
    return { result: "—", steps: [], error: "O denominador não pode ser zero." };

  let raw: Fraction;
  const steps = [];
  switch (op) {
    case "soma":
      raw = { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
      steps.push({ label: "Fórmula", expr: "a/b + c/d = (a×d + c×b) / (b×d)" });
      steps.push({
        label: "Substituição",
        expr: `(${a.n}×${b.d} + ${b.n}×${a.d}) / (${a.d}×${b.d}) = ${raw.n}/${raw.d}`,
      });
      break;
    case "subtracao":
      raw = { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
      steps.push({ label: "Fórmula", expr: "a/b − c/d = (a×d − c×b) / (b×d)" });
      steps.push({
        label: "Substituição",
        expr: `(${a.n}×${b.d} − ${b.n}×${a.d}) / (${a.d}×${b.d}) = ${raw.n}/${raw.d}`,
      });
      break;
    case "multiplicacao":
      raw = { n: a.n * b.n, d: a.d * b.d };
      steps.push({ label: "Fórmula", expr: "(a/b) × (c/d) = (a×c) / (b×d)" });
      steps.push({
        label: "Substituição",
        expr: `(${a.n}×${b.n}) / (${a.d}×${b.d}) = ${raw.n}/${raw.d}`,
      });
      break;
    case "divisao":
      if (b.n === 0) return { result: "—", steps: [], error: "Não é possível dividir por 0/1." };
      raw = { n: a.n * b.d, d: a.d * b.n };
      steps.push({ label: "Fórmula", expr: "(a/b) ÷ (c/d) = (a/b) × (d/c) = (a×d) / (b×c)" });
      steps.push({
        label: "Substituição",
        expr: `(${a.n}×${b.d}) / (${a.d}×${b.n}) = ${raw.n}/${raw.d}`,
      });
      break;
  }

  const s = simplify(raw);
  steps.push({
    label: "Simplificação",
    expr: `${raw.n}/${raw.d} = ${fracText(s)}  (dividir por MDC = ${gcd(raw.n, raw.d) || 1})`,
  });
  steps.push({ label: "Decimal", expr: `${fracText(s)} ≈ ${Number((s.n / s.d).toFixed(6))}` });
  if (mixedText(s) !== fracText(s))
    steps.push({ label: "Fração mista", expr: `${fracText(s)} = ${mixedText(s)}` });

  return { result: fracText(s), steps };
};

export const decimalToFraction = (value: number): Solution => {
  const str = String(value);
  const decimals = str.includes(".") ? (str.split(".")[1] ?? "").length : 0;
  const d = Math.pow(10, decimals);
  const raw = { n: Math.round(value * d), d };
  const s = simplify(raw);
  return {
    result: fracText(s),
    steps: [
      { label: "Escrever sobre potência de 10", expr: `${value} = ${raw.n}/${raw.d}` },
      { label: "Simplificar pelo MDC", expr: `${raw.n}/${raw.d} = ${fracText(s)}` },
      { label: "Percentagem", expr: `${value} = ${Number((value * 100).toFixed(6))} %` },
    ],
  };
};
