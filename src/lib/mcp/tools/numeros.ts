import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { percentOf, percentRatio, applyPercent, gcdSolution, lcmSolution, factorString } from "@/lib/math/core";
import { solutionResult } from "../format";

export const percentTool = defineTool({
  name: "percentagem",
  title: "Percentagem",
  description:
    "Calcula percentagem de um valor, a razão percentual entre duas quantidades, ou aplica um aumento/desconto.",
  inputSchema: {
    modo: z
      .enum(["percentagem_de", "razao", "aumento", "desconto"])
      .describe("Tipo de cálculo percentual."),
    a: z.number().describe("Percentagem (percentagem_de/aumento/desconto) ou parte (razao)."),
    b: z.number().describe("Total (percentagem_de/razao) ou valor base (aumento/desconto)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ modo, a, b }) => {
    if (modo === "percentagem_de") return solutionResult(`${a}% de ${b}`, percentOf(a, b));
    if (modo === "razao") return solutionResult(`${a} em ${b}`, percentRatio(a, b));
    return solutionResult(`${b} com ${modo} de ${a}%`, applyPercent(b, a, modo));
  },
});

export const gcdLcmTool = defineTool({
  name: "mdc_mmc",
  title: "MDC e MMC",
  description:
    "Calcula o máximo divisor comum ou o mínimo múltiplo comum de dois inteiros, com decomposição em fatores primos.",
  inputSchema: {
    a: z.number().int().describe("Primeiro inteiro positivo."),
    b: z.number().int().describe("Segundo inteiro positivo."),
    modo: z.enum(["mdc", "mmc"]).describe("Cálculo pretendido."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ a, b, modo }) => {
    const solution = modo === "mdc" ? gcdSolution(a, b) : lcmSolution(a, b);
    return solutionResult(
      `${modo.toUpperCase()}(${a}, ${b}) — fatores: ${factorString(a)} e ${factorString(b)}`,
      solution,
    );
  },
});
