import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fractionOperation, decimalToFraction, type FracOp } from "@/lib/math/fractions";
import { solutionResult } from "../format";

export const fractionTool = defineTool({
  name: "fracoes",
  title: "Operar frações",
  description: "Soma, subtrai, multiplica ou divide duas frações e simplifica o resultado.",
  inputSchema: {
    n1: z.number().int().describe("Numerador da primeira fração."),
    d1: z.number().int().describe("Denominador da primeira fração."),
    n2: z.number().int().describe("Numerador da segunda fração."),
    d2: z.number().int().describe("Denominador da segunda fração."),
    operacao: z
      .enum(["soma", "subtracao", "multiplicacao", "divisao"])
      .describe("Operação entre as frações."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ n1, d1, n2, d2, operacao }) =>
    solutionResult(
      `${n1}/${d1} ${operacao} ${n2}/${d2}`,
      fractionOperation({ n: n1, d: d1 }, { n: n2, d: d2 }, operacao as FracOp),
    ),
});

export const decimalToFractionTool = defineTool({
  name: "decimal_para_fracao",
  title: "Decimal para fração",
  description: "Converte um número decimal na fração equivalente simplificada.",
  inputSchema: { valor: z.number().describe("Número decimal a converter.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ valor }) => solutionResult(`${valor} em fração`, decimalToFraction(valor)),
});
