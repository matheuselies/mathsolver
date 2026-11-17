import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  planeSolution,
  solidSolution,
  pythagoras,
  planeShapes,
  solidShapes,
  type PlaneShape,
  type SolidShape,
} from "@/lib/math/geometry";
import { solutionResult } from "../format";

const planeIds = planeShapes.map((s) => s.id) as [PlaneShape, ...PlaneShape[]];
const solidIds = solidShapes.map((s) => s.id) as [SolidShape, ...SolidShape[]];

export const planeGeometryTool = defineTool({
  name: "geometria_plana",
  title: "Geometria plana",
  description:
    "Calcula área e perímetro de figuras planas. Medidas em 'valores': quadrado {a}; retangulo {c,h}; triangulo {b,h}; circulo {r}; losango {D,d}; trapezio {B,b,h}.",
  inputSchema: {
    figura: z.enum(planeIds).describe("Figura plana."),
    valores: z.record(z.string(), z.number()).describe("Medidas necessárias para a figura."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ figura, valores }) =>
    solutionResult(`Geometria plana — ${figura}`, planeSolution(figura, valores)),
});

export const solidGeometryTool = defineTool({
  name: "geometria_espacial",
  title: "Geometria espacial",
  description:
    "Calcula volume e área de superfície de sólidos. Medidas em 'valores': cubo {a}; paralelepipedo {c,l,h}; cilindro {r,h}; esfera {r}; cone {r,h}.",
  inputSchema: {
    solido: z.enum(solidIds).describe("Sólido geométrico."),
    valores: z.record(z.string(), z.number()).describe("Medidas necessárias para o sólido."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ solido, valores }) =>
    solutionResult(`Geometria espacial — ${solido}`, solidSolution(solido, valores)),
});

export const pythagorasTool = defineTool({
  name: "pitagoras",
  title: "Teorema de Pitágoras",
  description:
    "Calcula a hipotenusa (solveFor 'c') ou um cateto (solveFor 'cateto') num triângulo retângulo.",
  inputSchema: {
    a: z.number().describe("Cateto conhecido."),
    b: z.number().describe("Outro cateto (ignorado quando se procura um cateto)."),
    c: z.number().describe("Hipotenusa (ignorada quando se procura a hipotenusa)."),
    solveFor: z.enum(["c", "cateto"]).describe("O que calcular."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, b, c, solveFor }) =>
    solutionResult("Teorema de Pitágoras", pythagoras(a, b, c, solveFor)),
});
