import { fmt, type Solution } from "./core";

export const toRadians = (deg: number) => (deg * Math.PI) / 180;
export const toDegrees = (rad: number) => (rad * 180) / Math.PI;

export const specialAngles = [
  { deg: 0, sen: "0", cos: "1", tan: "0" },
  { deg: 30, sen: "1/2", cos: "√3/2", tan: "√3/3" },
  { deg: 45, sen: "√2/2", cos: "√2/2", tan: "1" },
  { deg: 60, sen: "√3/2", cos: "1/2", tan: "√3" },
  { deg: 90, sen: "1", cos: "0", tan: "indefinido" },
];

export const trigRatios = (deg: number): Solution => {
  const rad = toRadians(deg);
  const tanUndefined = Math.abs(Math.cos(rad)) < 1e-12;
  return {
    result: `sen = ${fmt(Math.sin(rad))} | cos = ${fmt(Math.cos(rad))} | tan = ${
      tanUndefined ? "indefinido" : fmt(Math.tan(rad))
    }`,
    steps: [
      { label: "Radianos", expr: `${deg}° × π/180 = ${fmt(rad)} rad` },
      { label: "sen(θ)", expr: `CO / h = ${fmt(Math.sin(rad))}` },
      { label: "cos(θ)", expr: `CA / h = ${fmt(Math.cos(rad))}` },
      {
        label: "tan(θ)",
        expr: tanUndefined ? "CO / CA — indefinido (cos = 0)" : `CO / CA = ${fmt(Math.tan(rad))}`,
      },
    ],
  };
};

/** Triângulo retângulo a partir de um ângulo e da hipotenusa */
export const rightTriangle = (deg: number, hyp: number): Solution => {
  if (deg <= 0 || deg >= 90)
    return { result: "—", steps: [], error: "O ângulo agudo tem de estar entre 0° e 90°." };
  const rad = toRadians(deg);
  const co = hyp * Math.sin(rad);
  const ca = hyp * Math.cos(rad);
  return {
    result: `CO = ${fmt(co)} | CA = ${fmt(ca)} | outro ângulo = ${fmt(90 - deg)}°`,
    steps: [
      { label: "Cateto oposto", expr: `CO = h × sen(θ) = ${hyp} × ${fmt(Math.sin(rad))} = ${fmt(co)}` },
      { label: "Cateto adjacente", expr: `CA = h × cos(θ) = ${hyp} × ${fmt(Math.cos(rad))} = ${fmt(ca)}` },
      { label: "Verificação (Pitágoras)", expr: `CO² + CA² = ${fmt(co * co + ca * ca)} ≈ h² = ${fmt(hyp * hyp)}` },
    ],
  };
};

/** Lei dos cossenos: c² = a² + b² − 2ab·cos(C) */
export const lawOfCosines = (a: number, b: number, angleC: number): Solution => {
  const rad = toRadians(angleC);
  const c2 = a * a + b * b - 2 * a * b * Math.cos(rad);
  return {
    result: `c = ${fmt(Math.sqrt(c2))}`,
    steps: [
      { label: "Fórmula", expr: "c² = a² + b² − 2ab·cos(C)" },
      {
        label: "Substituição",
        expr: `${a}² + ${b}² − 2×${a}×${b}×cos(${angleC}°) = ${fmt(c2)}`,
      },
      { label: "Raiz", expr: `c = √${fmt(c2)} = ${fmt(Math.sqrt(c2))}` },
    ],
  };
};

/** Lei dos senos: a/sen(A) = b/sen(B) */
export const lawOfSines = (a: number, angleA: number, angleB: number): Solution => {
  const sA = Math.sin(toRadians(angleA));
  if (Math.abs(sA) < 1e-12) return { result: "—", steps: [], error: "sen(A) não pode ser 0." };
  const b = (a * Math.sin(toRadians(angleB))) / sA;
  return {
    result: `b = ${fmt(b)}`,
    steps: [
      { label: "Fórmula", expr: "a/sen(A) = b/sen(B)" },
      { label: "Isolar b", expr: "b = a × sen(B) / sen(A)" },
      { label: "Cálculo", expr: `${a} × ${fmt(Math.sin(toRadians(angleB)))} / ${fmt(sA)} = ${fmt(b)}` },
    ],
  };
};
