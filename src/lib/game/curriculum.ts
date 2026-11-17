export type Topic =
  | "soma"
  | "subtracao"
  | "multiplicacao"
  | "divisao"
  | "potencia"
  | "raiz"
  | "fracao"
  | "porcentagem"
  | "inteiros"
  | "mdc"
  | "mmc"
  | "equacao"
  | "area_retangulo"
  | "area_triangulo"
  | "area_desafio"
  | "trigonometria";

export type AnswerKind = "inteiro" | "fracao" | "decimal";

export const topicMeta: Record<Topic, { label: string; kind: AnswerKind; maxDifficulty: number }> = {
  soma: { label: "Soma", kind: "inteiro", maxDifficulty: 4 },
  subtracao: { label: "Subtração", kind: "inteiro", maxDifficulty: 4 },
  multiplicacao: { label: "Multiplicação", kind: "inteiro", maxDifficulty: 5 },
  divisao: { label: "Divisão exata", kind: "inteiro", maxDifficulty: 4 },
  potencia: { label: "Potenciação", kind: "inteiro", maxDifficulty: 4 },
  raiz: { label: "Raiz quadrada", kind: "inteiro", maxDifficulty: 3 },
  fracao: { label: "Frações (soma e subtração)", kind: "fracao", maxDifficulty: 5 },
  porcentagem: { label: "Porcentagem", kind: "inteiro", maxDifficulty: 4 },
  inteiros: { label: "Números inteiros (sinais)", kind: "inteiro", maxDifficulty: 4 },
  mdc: { label: "MDC", kind: "inteiro", maxDifficulty: 3 },
  mmc: { label: "MMC", kind: "inteiro", maxDifficulty: 3 },
  equacao: { label: "Equação do 1.º grau", kind: "inteiro", maxDifficulty: 5 },
  area_retangulo: { label: "Área do retângulo", kind: "inteiro", maxDifficulty: 3 },
  area_triangulo: { label: "Área do triângulo", kind: "inteiro", maxDifficulty: 3 },
  area_desafio: { label: "Área (desafio)", kind: "inteiro", maxDifficulty: 2 },
  trigonometria: { label: "Trigonometria (ângulos notáveis)", kind: "decimal", maxDifficulty: 2 },
};

export type PhaseSpec = { phase: number; topic: Topic; difficulty: number };

const build = (): PhaseSpec[] => {
  const spec: { topic: Topic; difficulties: number[] }[] = [
    { topic: "soma", difficulties: [1, 2, 3, 4] },
    { topic: "subtracao", difficulties: [1, 2, 3, 4] },
    { topic: "multiplicacao", difficulties: [1, 2, 3, 4, 5] },
    { topic: "divisao", difficulties: [1, 2, 3, 4] },
    { topic: "potencia", difficulties: [1, 2, 3, 4] },
    { topic: "raiz", difficulties: [1, 2, 3] },
    { topic: "fracao", difficulties: [1, 2, 3, 4, 5] },
    { topic: "porcentagem", difficulties: [1, 2, 3, 4] },
    { topic: "inteiros", difficulties: [1, 2, 3, 4] },
    { topic: "mdc", difficulties: [1] },
    { topic: "mmc", difficulties: [1, 2] },
    { topic: "equacao", difficulties: [1, 2, 3, 4, 5] },
    { topic: "area_retangulo", difficulties: [1] },
    { topic: "area_triangulo", difficulties: [1] },
    { topic: "area_desafio", difficulties: [2] },
    { topic: "trigonometria", difficulties: [1, 2] },
  ];

  const out: PhaseSpec[] = [];
  let phase = 1;
  for (const s of spec)
    for (const difficulty of s.difficulties) out.push({ phase: phase++, topic: s.topic, difficulty });
  return out;
};

export const curriculum: PhaseSpec[] = build();
export const TOTAL_PHASES = curriculum.length; // 50
export const STREAK_TARGET = 10;

export const phaseSpec = (phase: number): PhaseSpec => {
  const clamped = Math.min(Math.max(1, Math.trunc(phase)), TOTAL_PHASES);
  return curriculum[clamped - 1]!;
};

export const phaseLabel = (phase: number): string => {
  const spec = phaseSpec(phase);
  return `${topicMeta[spec.topic].label} · nível ${spec.difficulty}`;
};
