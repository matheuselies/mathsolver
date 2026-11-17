import { defineMcp } from "@lovable.dev/mcp-js";
import { calculateTool, powerTool } from "./tools/aritmetica";
import { percentTool, gcdLcmTool } from "./tools/numeros";
import { fractionTool, decimalToFractionTool } from "./tools/fracoes";
import { linearEquationTool, quadraticEquationTool, linearSystemTool } from "./tools/algebra";
import { planeGeometryTool, solidGeometryTool, pythagorasTool } from "./tools/geometria";
import { trigRatiosTool, rightTriangleTool, triangleLawsTool } from "./tools/trigonometria";
import { formulasTool, exerciseTool } from "./tools/referencia";

const tools = [
  calculateTool,
  powerTool,
  percentTool,
  gcdLcmTool,
  fractionTool,
  decimalToFractionTool,
  linearEquationTool,
  quadraticEquationTool,
  linearSystemTool,
  planeGeometryTool,
  solidGeometryTool,
  pythagorasTool,
  trigRatiosTool,
  rightTriangleTool,
  triangleLawsTool,
  formulasTool,
  exerciseTool,
] as unknown as Parameters<typeof defineMcp>[0]["tools"];

export default defineMcp({
  name: "mathsolver-1-0",
  title: "MathSolver 1.0",
  version: "0.1.0",
  instructions:
    "Ferramentas de matemática (em português): aritmética, potências e raízes, percentagens, MDC/MMC, frações, equações e sistemas, geometria plana e espacial, trigonometria, formulário e gerador de exercícios. Todas as respostas incluem o resultado e os passos de resolução.",
  tools,
});
