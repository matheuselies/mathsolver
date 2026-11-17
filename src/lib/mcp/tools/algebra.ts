import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { linearEquation, quadraticEquation, linearSystem } from "@/lib/math/algebra";
import { solutionResult } from "../format";

export const linearEquationTool = defineTool({
  name: "equacao_linear",
  title: "Equação do 1.º grau",
  description: "Resolve ax + b = c passo a passo.",
  inputSchema: {
    a: z.number().describe("Coeficiente de x."),
    b: z.number().describe("Termo independente do lado esquerdo."),
    c: z.number().describe("Valor do lado direito."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, b, c }) => solutionResult(`${a}x + (${b}) = ${c}`, linearEquation(a, b, c)),
});

export const quadraticEquationTool = defineTool({
  name: "equacao_quadratica",
  title: "Equação do 2.º grau",
  description: "Resolve ax² + bx + c = 0 com a fórmula resolvente e o binómio discriminante.",
  inputSchema: {
    a: z.number().describe("Coeficiente de x²."),
    b: z.number().describe("Coeficiente de x."),
    c: z.number().describe("Termo independente."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, b, c }) =>
    solutionResult(`${a}x² + (${b})x + (${c}) = 0`, quadraticEquation(a, b, c)),
});

export const linearSystemTool = defineTool({
  name: "sistema_linear",
  title: "Sistema de duas equações",
  description: "Resolve a1x + b1y = c1 e a2x + b2y = c2 pela regra de Cramer.",
  inputSchema: {
    a1: z.number(),
    b1: z.number(),
    c1: z.number(),
    a2: z.number(),
    b2: z.number(),
    c2: z.number(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a1, b1, c1, a2, b2, c2 }) =>
    solutionResult("Sistema linear 2×2", linearSystem(a1, b1, c1, a2, b2, c2)),
});
