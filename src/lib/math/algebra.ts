import { fmt, type Solution } from "./core";

/** ax + b = c */
export const linearEquation = (a: number, b: number, c: number): Solution => {
  if (a === 0)
    return {
      result: "—",
      steps: [],
      error: b === c ? "Equação indeterminada: qualquer x é solução." : "Equação impossível: não tem solução.",
    };
  const x = (c - b) / a;
  return {
    result: `x = ${fmt(x)}`,
    steps: [
      { label: "Equação", expr: `${a}x + (${b}) = ${c}` },
      { label: "Isolar o termo em x", expr: `${a}x = ${c} − (${b}) = ${fmt(c - b)}` },
      { label: "Dividir por a", expr: `x = ${fmt(c - b)} / ${a} = ${fmt(x)}` },
      { label: "Verificação", expr: `${a}×${fmt(x)} + (${b}) = ${fmt(a * x + b)}` },
    ],
  };
};

/** a1x + b1y = c1 ; a2x + b2y = c2 — regra de Cramer */
export const linearSystem = (
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number,
): Solution => {
  const det = a1 * b2 - a2 * b1;
  if (det === 0)
    return {
      result: "—",
      steps: [{ label: "Determinante", expr: `D = ${a1}×${b2} − ${a2}×${b1} = 0` }],
      error: "D = 0: o sistema é impossível ou indeterminado (não tem solução única).",
    };
  const dx = c1 * b2 - c2 * b1;
  const dy = a1 * c2 - a2 * c1;
  const x = dx / det;
  const y = dy / det;
  return {
    result: `x = ${fmt(x)} ; y = ${fmt(y)}`,
    steps: [
      { label: "Sistema", expr: `${a1}x + ${b1}y = ${c1} ; ${a2}x + ${b2}y = ${c2}` },
      { label: "D", expr: `D = a₁b₂ − a₂b₁ = ${a1}×${b2} − ${a2}×${b1} = ${fmt(det)}` },
      { label: "Dx", expr: `Dx = c₁b₂ − c₂b₁ = ${fmt(dx)}` },
      { label: "Dy", expr: `Dy = a₁c₂ − a₂c₁ = ${fmt(dy)}` },
      { label: "Solução", expr: `x = Dx/D = ${fmt(x)} ; y = Dy/D = ${fmt(y)}` },
    ],
  };
};

/** ax² + bx + c = 0 */
export const quadraticEquation = (a: number, b: number, c: number): Solution => {
  if (a === 0) return linearEquation(b, c, 0);
  const delta = b * b - 4 * a * c;
  const steps = [
    { label: "Fórmula resolvente", expr: "x = (−b ± √Δ) / 2a , Δ = b² − 4ac" },
    { label: "Δ", expr: `Δ = ${b}² − 4×${a}×${c} = ${fmt(delta)}` },
  ];
  if (delta < 0)
    return { result: "Sem soluções reais", steps, error: "Δ < 0: não existem raízes reais." };
  const r1 = (-b + Math.sqrt(delta)) / (2 * a);
  const r2 = (-b - Math.sqrt(delta)) / (2 * a);
  steps.push({ label: "x₁", expr: `(−${b} + √${fmt(delta)}) / (2×${a}) = ${fmt(r1)}` });
  steps.push({ label: "x₂", expr: `(−${b} − √${fmt(delta)}) / (2×${a}) = ${fmt(r2)}` });
  return { result: delta === 0 ? `x = ${fmt(r1)}` : `x₁ = ${fmt(r1)} ; x₂ = ${fmt(r2)}`, steps };
};
