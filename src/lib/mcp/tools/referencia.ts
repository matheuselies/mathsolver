import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { formulaTopics } from "@/lib/math/formulas";
import { generateExercise, exerciseKinds, type ExerciseKind } from "@/lib/math/exercises";

const kindIds = exerciseKinds.map((k) => k.id) as [ExerciseKind, ...ExerciseKind[]];

export const formulasTool = defineTool({
  name: "formulario",
  title: "Consultar formulário",
  description:
    "Pesquisa o formulário de matemática e devolve as fórmulas correspondentes.",
  inputSchema: {
    pesquisa: z
      .string()
      .optional()
      .describe("Termo de pesquisa (tema ou nome da fórmula). Sem termo devolve todos os temas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ pesquisa }) => {
    const q = pesquisa?.trim().toLowerCase() ?? "";
    const topics = formulaTopics
      .map((topic) => ({
        ...topic,
        entries: q
          ? topic.entries.filter(
              (e) =>
                e.name.toLowerCase().includes(q) ||
                e.expr.toLowerCase().includes(q) ||
                topic.title.toLowerCase().includes(q),
            )
          : topic.entries,
      }))
      .filter((topic) => topic.entries.length > 0);

    if (topics.length === 0) {
      return { content: [{ type: "text" as const, text: `Sem fórmulas para "${pesquisa}".` }] };
    }

    const text = topics
      .map(
        (t) =>
          `## ${t.title}\n` +
          t.entries.map((e) => `- ${e.name}: ${e.expr}${e.note ? ` (${e.note})` : ""}`).join("\n"),
      )
      .join("\n\n");

    return { content: [{ type: "text" as const, text }], structuredContent: { topics } };
  },
});

export const exerciseTool = defineTool({
  name: "gerar_exercicio",
  title: "Gerar exercício",
  description: "Gera um exercício aleatório do tipo pedido, com o enunciado e a resposta correta.",
  inputSchema: { tipo: z.enum(kindIds).describe("Tipo de exercício.") },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: ({ tipo }) => {
    const exercise = generateExercise(tipo);
    return {
      content: [
        {
          type: "text" as const,
          text: `${exercise.question}\n\nResposta: ${exercise.answer}\n\n${exercise.explanation}`,
        },
      ],
      structuredContent: { exercise },
    };
  },
});
