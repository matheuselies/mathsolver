import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { basicOperation, integerOperation, power, nthRoot, type BasicOp } from "@/lib/math/core";
import { solutionResult } from "../format";

const op = z.enum(["soma", "subtracao", "multiplicacao", "divisao"]);

export const calculateTool = defineTool({
  name: "calcular",
  title: "Calcular operação básica",
  description:
    "Resolve uma operação aritmética básica (soma, subtração, multiplicação ou divisão) mostrando os passos.",
  inputSchema: {
    a: z.number().describe("Primeiro número."),
    b: z.number().describe("Segundo número."),
    operacao: op.describe("Operação a aplicar."),
    inteiros: z
      .boolean()
      .optional()
      .describe("Usar regras de sinais de números inteiros na explicação."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, b, operacao, inteiros }) =>
    solutionResult(
      `${a} ${operacao} ${b}`,
      inteiros
        ? integerOperation(a, b, operacao as BasicOp)
        : basicOperation(a, b, operacao as BasicOp),
    ),
});

export const powerTool = defineTool({
  name: "potencia_raiz",
  title: "Potências e raízes",
  description: "Calcula uma potência a^n ou a raiz de índice n de um número, com os passos.",
  inputSchema: {
    a: z.number().describe("Base (potência) ou radicando (raiz)."),
    n: z.number().describe("Expoente ou índice da raiz."),
    modo: z.enum(["potencia", "raiz"]).describe("Tipo de cálculo."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, n, modo }) =>
    solutionResult(
      modo === "potencia" ? `${a}^${n}` : `raiz de índice ${n} de ${a}`,
      modo === "potencia" ? power(a, n) : nthRoot(a, n),
    ),
});

export default calculateTool;
