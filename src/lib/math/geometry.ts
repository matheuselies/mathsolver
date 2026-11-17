import { fmt, type Solution } from "./core";

export type PlaneShape = "quadrado" | "retangulo" | "triangulo" | "circulo" | "losango" | "trapezio";

export const planeShapes: {
  id: PlaneShape;
  label: string;
  fields: { key: string; label: string }[];
  formulas: string[];
}[] = [
  { id: "quadrado", label: "Quadrado", fields: [{ key: "a", label: "Lado (a)" }], formulas: ["Perímetro = 4a", "Área = a²"] },
  {
    id: "retangulo",
    label: "Retângulo",
    fields: [
      { key: "c", label: "Comprimento (c)" },
      { key: "h", label: "Altura (h)" },
    ],
    formulas: ["Perímetro = 2(c + h)", "Área = c × h"],
  },
  {
    id: "triangulo",
    label: "Triângulo",
    fields: [
      { key: "b", label: "Base (b)" },
      { key: "h", label: "Altura (h)" },
    ],
    formulas: ["Área = (b × h) / 2"],
  },
  { id: "circulo", label: "Círculo", fields: [{ key: "r", label: "Raio (r)" }], formulas: ["Perímetro = 2πr", "Área = πr²"] },
  {
    id: "losango",
    label: "Losango",
    fields: [
      { key: "D", label: "Diagonal maior (D)" },
      { key: "d", label: "Diagonal menor (d)" },
    ],
    formulas: ["Área = (D × d) / 2"],
  },
  {
    id: "trapezio",
    label: "Trapézio",
    fields: [
      { key: "B", label: "Base maior (B)" },
      { key: "b", label: "Base menor (b)" },
      { key: "h", label: "Altura (h)" },
    ],
    formulas: ["Área = ((B + b) × h) / 2"],
  },
];

export const planeSolution = (shape: PlaneShape, v: Record<string, number>): Solution => {
  const g = (k: string) => v[k] ?? 0;
  switch (shape) {
    case "quadrado": {
      const a = g("a");
      return {
        result: `Área = ${fmt(a * a)} | Perímetro = ${fmt(4 * a)}`,
        steps: [
          { label: "Área", expr: `a² = ${a}² = ${fmt(a * a)}` },
          { label: "Perímetro", expr: `4a = 4 × ${a} = ${fmt(4 * a)}` },
        ],
      };
    }
    case "retangulo": {
      const c = g("c");
      const h = g("h");
      return {
        result: `Área = ${fmt(c * h)} | Perímetro = ${fmt(2 * (c + h))}`,
        steps: [
          { label: "Área", expr: `c × h = ${c} × ${h} = ${fmt(c * h)}` },
          { label: "Perímetro", expr: `2(c + h) = 2 × ${fmt(c + h)} = ${fmt(2 * (c + h))}` },
        ],
      };
    }
    case "triangulo": {
      const b = g("b");
      const h = g("h");
      return {
        result: `Área = ${fmt((b * h) / 2)}`,
        steps: [{ label: "Área", expr: `(b × h)/2 = (${b} × ${h})/2 = ${fmt((b * h) / 2)}` }],
      };
    }
    case "circulo": {
      const r = g("r");
      return {
        result: `Área = ${fmt(Math.PI * r * r)} | Perímetro = ${fmt(2 * Math.PI * r)}`,
        steps: [
          { label: "Área", expr: `πr² = π × ${r}² = ${fmt(Math.PI * r * r)}` },
          { label: "Perímetro", expr: `2πr = 2π × ${r} = ${fmt(2 * Math.PI * r)}` },
          { label: "Diâmetro", expr: `d = 2r = ${fmt(2 * r)}` },
        ],
      };
    }
    case "losango": {
      const D = g("D");
      const d = g("d");
      return {
        result: `Área = ${fmt((D * d) / 2)}`,
        steps: [{ label: "Área", expr: `(D × d)/2 = (${D} × ${d})/2 = ${fmt((D * d) / 2)}` }],
      };
    }
    case "trapezio": {
      const B = g("B");
      const b = g("b");
      const h = g("h");
      return {
        result: `Área = ${fmt(((B + b) * h) / 2)}`,
        steps: [
          {
            label: "Área",
            expr: `((B + b) × h)/2 = ((${B} + ${b}) × ${h})/2 = ${fmt(((B + b) * h) / 2)}`,
          },
        ],
      };
    }
  }
};

export const pythagoras = (a: number, b: number, c: number, solveFor: "c" | "cateto"): Solution => {
  if (solveFor === "c") {
    const h = Math.sqrt(a * a + b * b);
    return {
      result: `hipotenusa = ${fmt(h)}`,
      steps: [
        { label: "Teorema", expr: "a² + b² = c²" },
        { label: "Cálculo", expr: `${a}² + ${b}² = ${fmt(a * a + b * b)}` },
        { label: "Raiz", expr: `c = √${fmt(a * a + b * b)} = ${fmt(h)}` },
      ],
    };
  }
  if (c <= a) return { result: "—", steps: [], error: "A hipotenusa tem de ser maior que o cateto." };
  const r = Math.sqrt(c * c - a * a);
  return {
    result: `cateto = ${fmt(r)}`,
    steps: [
      { label: "Teorema", expr: "b² = c² − a²" },
      { label: "Cálculo", expr: `${c}² − ${a}² = ${fmt(c * c - a * a)}` },
      { label: "Raiz", expr: `b = √${fmt(c * c - a * a)} = ${fmt(r)}` },
    ],
  };
};

export type SolidShape = "cubo" | "paralelepipedo" | "cilindro" | "esfera" | "cone";

export const solidShapes: {
  id: SolidShape;
  label: string;
  fields: { key: string; label: string }[];
  formulas: string[];
}[] = [
  { id: "cubo", label: "Cubo", fields: [{ key: "a", label: "Aresta (a)" }], formulas: ["Volume = a³", "Área total = 6a²"] },
  {
    id: "paralelepipedo",
    label: "Paralelepípedo",
    fields: [
      { key: "c", label: "Comprimento (c)" },
      { key: "h", label: "Altura (h)" },
      { key: "p", label: "Profundidade (p)" },
    ],
    formulas: ["Volume = c × h × p", "Área total = 2(ch + hp + cp)"],
  },
  {
    id: "cilindro",
    label: "Cilindro",
    fields: [
      { key: "r", label: "Raio (r)" },
      { key: "h", label: "Altura (h)" },
    ],
    formulas: ["Volume = πr²h", "Área lateral = 2πrh", "Área total = 2πrh + 2πr²"],
  },
  { id: "esfera", label: "Esfera", fields: [{ key: "r", label: "Raio (r)" }], formulas: ["Volume = (4/3)πr³", "Área = 4πr²"] },
  {
    id: "cone",
    label: "Cone",
    fields: [
      { key: "r", label: "Raio (r)" },
      { key: "h", label: "Altura (h)" },
    ],
    formulas: ["Volume = (1/3)πr²h", "Geratriz g = √(r² + h²)", "Área total = πr(g + r)"],
  },
];

export const solidSolution = (shape: SolidShape, v: Record<string, number>): Solution => {
  const g = (k: string) => v[k] ?? 0;
  switch (shape) {
    case "cubo": {
      const a = g("a");
      return {
        result: `Volume = ${fmt(a ** 3)} | Área = ${fmt(6 * a * a)}`,
        steps: [
          { label: "Volume", expr: `a³ = ${a}³ = ${fmt(a ** 3)}` },
          { label: "Área total", expr: `6a² = 6 × ${fmt(a * a)} = ${fmt(6 * a * a)}` },
        ],
      };
    }
    case "paralelepipedo": {
      const c = g("c");
      const h = g("h");
      const p = g("p");
      const area = 2 * (c * h + h * p + c * p);
      return {
        result: `Volume = ${fmt(c * h * p)} | Área = ${fmt(area)}`,
        steps: [
          { label: "Volume", expr: `c × h × p = ${c} × ${h} × ${p} = ${fmt(c * h * p)}` },
          { label: "Área total", expr: `2(ch + hp + cp) = ${fmt(area)}` },
        ],
      };
    }
    case "cilindro": {
      const r = g("r");
      const h = g("h");
      const lat = 2 * Math.PI * r * h;
      return {
        result: `Volume = ${fmt(Math.PI * r * r * h)} | Área total = ${fmt(lat + 2 * Math.PI * r * r)}`,
        steps: [
          { label: "Volume", expr: `πr²h = π × ${r}² × ${h} = ${fmt(Math.PI * r * r * h)}` },
          { label: "Área lateral", expr: `2πrh = ${fmt(lat)}` },
          { label: "Área total", expr: `2πrh + 2πr² = ${fmt(lat + 2 * Math.PI * r * r)}` },
        ],
      };
    }
    case "esfera": {
      const r = g("r");
      return {
        result: `Volume = ${fmt((4 / 3) * Math.PI * r ** 3)} | Área = ${fmt(4 * Math.PI * r * r)}`,
        steps: [
          { label: "Volume", expr: `(4/3)πr³ = ${fmt((4 / 3) * Math.PI * r ** 3)}` },
          { label: "Área", expr: `4πr² = ${fmt(4 * Math.PI * r * r)}` },
        ],
      };
    }
    case "cone": {
      const r = g("r");
      const h = g("h");
      const gr = Math.sqrt(r * r + h * h);
      return {
        result: `Volume = ${fmt((1 / 3) * Math.PI * r * r * h)} | Área total = ${fmt(Math.PI * r * (gr + r))}`,
        steps: [
          { label: "Volume", expr: `(1/3)πr²h = ${fmt((1 / 3) * Math.PI * r * r * h)}` },
          { label: "Geratriz", expr: `g = √(r² + h²) = ${fmt(gr)}` },
          { label: "Área total", expr: `πr(g + r) = ${fmt(Math.PI * r * (gr + r))}` },
        ],
      };
    }
  }
};
