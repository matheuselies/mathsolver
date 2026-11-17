import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { trigRatios, rightTriangle, lawOfCosines, lawOfSines } from "@/lib/math/trigonometry";
import { solutionResult } from "../format";

export const trigRatiosTool = defineTool({
  name: "razoes_trigonometricas",
  title: "Razões trigonométricas",
  description: "Devolve seno, cosseno e tangente de um ângulo em graus.",
  inputSchema: { graus: z.number().describe("Ângulo em graus.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ graus }) => solutionResult(`Razões de ${graus}°`, trigRatios(graus)),
});

export const rightTriangleTool = defineTool({
  name: "triangulo_retangulo",
  title: "Triângulo retângulo",
  description: "Calcula cateto oposto e adjacente a partir de um ângulo e da hipotenusa.",
  inputSchema: {
    graus: z.number().describe("Ângulo agudo em graus."),
    hipotenusa: z.number().describe("Comprimento da hipotenusa."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ graus, hipotenusa }) =>
    solutionResult(`Triângulo retângulo (${graus}°)`, rightTriangle(graus, hipotenusa)),
});

export const triangleLawsTool = defineTool({
  name: "leis_triangulos",
  title: "Lei dos senos e dos cossenos",
  description:
    "Aplica a lei dos cossenos (lados a, b e ângulo entre eles) ou a lei dos senos (lado a, ângulo A e ângulo B).",
  inputSchema: {
    lei: z.enum(["cossenos", "senos"]).describe("Lei a aplicar."),
    a: z.number().describe("Lado a."),
    b: z.number().describe("Lado b (lei dos cossenos) ou ângulo A em graus (lei dos senos)."),
    angulo: z
      .number()
      .describe("Ângulo C em graus (lei dos cossenos) ou ângulo B em graus (lei dos senos)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lei, a, b, angulo }) =>
    lei === "cossenos"
      ? solutionResult("Lei dos cossenos", lawOfCosines(a, b, angulo))
      : solutionResult("Lei dos senos", lawOfSines(a, b, angulo)),
});
