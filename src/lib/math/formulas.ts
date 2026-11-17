export type FormulaEntry = { name: string; expr: string; note?: string };
export type FormulaTopic = {
  id: string;
  title: string;
  years: string;
  entries: FormulaEntry[];
};

export const formulaTopics: FormulaTopic[] = [
  {
    id: "operacoes",
    title: "Operações básicas",
    years: "5.º – 6.º ano",
    entries: [
      { name: "Adição", expr: "a + b = c", note: "Exemplo: 5 + 3 = 8" },
      { name: "Subtração", expr: "a − b = c", note: "Exemplo: 8 − 3 = 5" },
      { name: "Multiplicação", expr: "a × b = c", note: "Comutativa: a × b = b × a" },
      { name: "Divisão", expr: "a ÷ b = c, com b ≠ 0", note: "Nunca dividir por zero" },
    ],
  },
  {
    id: "potencias",
    title: "Potenciação e radiciação",
    years: "6.º – 7.º ano",
    entries: [
      { name: "Potência", expr: "aⁿ = a × a × … × a (n vezes)" },
      { name: "Expoente 1 e 0", expr: "a¹ = a ; a⁰ = 1 (a ≠ 0)" },
      { name: "Expoente negativo", expr: "a⁻ⁿ = 1 / aⁿ" },
      { name: "Produto de potências", expr: "aᵐ⁺ⁿ = aᵐ × aⁿ" },
      { name: "Potência de produto", expr: "(a × b)ⁿ = aⁿ × bⁿ" },
      { name: "Potência de potência", expr: "(aᵐ)ⁿ = a^(m×n)" },
      { name: "Radiciação", expr: "ⁿ√a = b ⟺ bⁿ = a" },
      { name: "Raiz como potência", expr: "√a = a^(1/2) ; ³√a = a^(1/3)" },
    ],
  },
  {
    id: "percentagem",
    title: "Percentagem e decimais",
    years: "6.º – 7.º ano",
    entries: [
      { name: "Percentagem", expr: "Percentagem = (Parte / Total) × 100%" },
      { name: "Aumento de x%", expr: "Final = Inicial × (1 + x/100)" },
      { name: "Desconto de x%", expr: "Final = Inicial × (1 − x/100)" },
      { name: "Decimais", expr: "0,1 = 1/10 ; 0,01 = 1/100 ; 0,001 = 1/1000" },
    ],
  },
  {
    id: "fracoes",
    title: "Frações",
    years: "5.º – 7.º ano",
    entries: [
      { name: "Soma", expr: "a/b + c/d = (a×d + c×b) / (b×d)" },
      { name: "Subtração", expr: "a/b − c/d = (a×d − c×b) / (b×d)" },
      { name: "Multiplicação", expr: "(a/b) × (c/d) = (a×c) / (b×d)" },
      { name: "Divisão", expr: "(a/b) ÷ (c/d) = (a×d) / (b×c)" },
      { name: "Simplificação", expr: "dividir numerador e denominador pelo MDC", note: "6/9 = 2/3" },
      { name: "Fração mista", expr: "5/2 = 2 1/2" },
    ],
  },
  {
    id: "mdc-mmc",
    title: "MDC, MMC e divisibilidade",
    years: "6.º – 7.º ano",
    entries: [
      { name: "MDC (Euclides)", expr: "MDC(a, b) = MDC(b, a mod b)" },
      { name: "MMC", expr: "MMC(a, b) = |a × b| / MDC(a, b)" },
      { name: "Propriedade", expr: "MDC(a,b) × MMC(a,b) = a × b" },
      { name: "Fatoração", expr: "12 = 2² × 3 ; 18 = 2 × 3²" },
    ],
  },
  {
    id: "inteiros",
    title: "Números inteiros",
    years: "7.º ano",
    entries: [
      { name: "Subtração", expr: "a − b = a + (−b)", note: "5 − (−3) = 8" },
      { name: "Regra de sinais", expr: "(+)(+) = + ; (−)(−) = + ; (+)(−) = − ; (−)(+) = −" },
      { name: "Valor absoluto", expr: "|a| = a se a ≥ 0 ; |a| = −a se a < 0" },
    ],
  },
  {
    id: "algebra",
    title: "Álgebra e equações",
    years: "7.º – 9.º ano",
    entries: [
      { name: "Equação do 1.º grau", expr: "ax + b = c  ⟹  x = (c − b) / a" },
      { name: "Sistema 2×2 (Cramer)", expr: "x = Dx/D ; y = Dy/D, com D = a₁b₂ − a₂b₁" },
      { name: "Equação do 2.º grau", expr: "x = (−b ± √(b² − 4ac)) / 2a" },
      { name: "Propriedades da igualdade", expr: "a = b ⟹ a ± c = b ± c ; a×c = b×c" },
    ],
  },
  {
    id: "geometria",
    title: "Geometria plana",
    years: "5.º – 9.º ano",
    entries: [
      { name: "Quadrado", expr: "P = 4a ; A = a²" },
      { name: "Retângulo", expr: "P = 2(c + h) ; A = c × h" },
      { name: "Triângulo", expr: "A = (b × h) / 2" },
      { name: "Círculo", expr: "P = 2πr ; A = πr²" },
      { name: "Losango", expr: "A = (D × d) / 2" },
      { name: "Trapézio", expr: "A = ((B + b) × h) / 2" },
      { name: "Teorema de Pitágoras", expr: "a² + b² = c²" },
    ],
  },
  {
    id: "espacial",
    title: "Geometria espacial",
    years: "9.º – 10.º ano",
    entries: [
      { name: "Cubo", expr: "V = a³ ; A = 6a²" },
      { name: "Paralelepípedo", expr: "V = c × h × p ; A = 2(ch + hp + cp)" },
      { name: "Cilindro", expr: "V = πr²h ; A = 2πrh + 2πr²" },
      { name: "Esfera", expr: "V = (4/3)πr³ ; A = 4πr²" },
      { name: "Cone", expr: "V = (1/3)πr²h ; g = √(r² + h²) ; A = πr(g + r)" },
    ],
  },
  {
    id: "trigonometria",
    title: "Trigonometria",
    years: "9.º – 12.º ano",
    entries: [
      { name: "Razões", expr: "sen θ = CO/h ; cos θ = CA/h ; tan θ = CO/CA" },
      { name: "Fundamental", expr: "sen²θ + cos²θ = 1" },
      { name: "Ângulos notáveis", expr: "sen30° = 1/2 ; cos45° = √2/2 ; tan60° = √3" },
      { name: "Lei dos senos", expr: "a/sen A = b/sen B = c/sen C" },
      { name: "Lei dos cossenos", expr: "c² = a² + b² − 2ab·cos C" },
      { name: "Radianos", expr: "1 rad = 180/π ° ; θrad = θ° × π/180" },
    ],
  },
];
