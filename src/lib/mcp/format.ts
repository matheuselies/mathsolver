import type { Solution } from "@/lib/math/core";

export function solutionResult(title: string, solution: Solution) {
  if (solution.error) {
    return { content: [{ type: "text" as const, text: solution.error }], isError: true };
  }
  const steps = solution.steps.map((s) => `- ${s.label}: ${s.expr}`).join("\n");
  return {
    content: [
      {
        type: "text" as const,
        text: `${title}\n\nResultado: ${solution.result}\n\nPassos:\n${steps}`,
      },
    ],
    structuredContent: { result: solution.result, steps: solution.steps },
  };
}
