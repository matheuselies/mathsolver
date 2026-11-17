"""
Currículo das 50 fases.

Cada fase tem:
  - topic: qual tipo de conta (precisa existir em content.py)
  - difficulty: escala os números / dificuldade (1 = mais fácil)
  - label: nome amigável mostrado ao usuário

A progressão vai do mais simples (soma) ao mais avançado (trigonometria),
sempre reaproveitando os mesmos tópicos com dificuldade crescente.
Ajuste esta lista livremente — o resto do sistema se adapta sozinho.
"""

# (topic, difficulty, label)
FASES = [
    # Fases 1-4: Soma
    ("soma", 1, "Soma — primeiros passos"),
    ("soma", 2, "Soma até 50"),
    ("soma", 3, "Soma até 100"),
    ("soma", 4, "Soma até 500"),
    # Fases 5-8: Subtração
    ("subtracao", 1, "Subtração — primeiros passos"),
    ("subtracao", 2, "Subtração até 50"),
    ("subtracao", 3, "Subtração até 100"),
    ("subtracao", 4, "Subtração até 500"),
    # Fases 9-13: Multiplicação (tabuada e além)
    ("multiplicacao", 1, "Tabuada fácil (1 a 5)"),
    ("multiplicacao", 2, "Tabuada completa (1 a 10)"),
    ("multiplicacao", 3, "Multiplicação até 12"),
    ("multiplicacao", 4, "Multiplicação com dezenas"),
    ("multiplicacao", 5, "Multiplicação avançada"),
    # Fases 14-17: Divisão (exata)
    ("divisao", 1, "Divisão exata fácil"),
    ("divisao", 2, "Divisão exata"),
    ("divisao", 3, "Divisão exata maior"),
    ("divisao", 4, "Divisão exata avançada"),
    # Fases 18-21: Potenciação
    ("potenciacao", 1, "Quadrados"),
    ("potenciacao", 2, "Potências pequenas"),
    ("potenciacao", 3, "Potências médias"),
    ("potenciacao", 4, "Potências avançadas"),
    # Fases 22-24: Radiciação
    ("radiciacao", 1, "Raiz quadrada exata"),
    ("radiciacao", 2, "Raiz quadrada"),
    ("radiciacao", 3, "Raiz quadrada avançada"),
    # Fases 25-29: Frações
    ("fracao", 1, "Somar frações simples"),
    ("fracao", 2, "Somar frações"),
    ("fracao", 3, "Somar/subtrair frações"),
    ("fracao", 4, "Frações — denominadores maiores"),
    ("fracao", 5, "Frações avançadas"),
    # Fases 30-33: Porcentagem
    ("porcentagem", 1, "Porcentagem fácil"),
    ("porcentagem", 2, "Porcentagem"),
    ("porcentagem", 3, "Porcentagem com valores maiores"),
    ("porcentagem", 4, "Porcentagem avançada"),
    # Fases 34-37: Números inteiros (sinais)
    ("inteiros", 1, "Positivos e negativos — início"),
    ("inteiros", 2, "Somando com sinais"),
    ("inteiros", 3, "Operando com sinais"),
    ("inteiros", 4, "Inteiros avançado"),
    # Fases 38-40: MDC e MMC
    ("mdc", 2, "Máximo Divisor Comum (MDC)"),
    ("mmc", 2, "Mínimo Múltiplo Comum (MMC)"),
    ("mmc", 3, "MMC avançado"),
    # Fases 41-45: Equação do 1º grau
    ("equacao1grau", 1, "Equação do 1º grau — início"),
    ("equacao1grau", 2, "Equação do 1º grau"),
    ("equacao1grau", 3, "Equação do 1º grau média"),
    ("equacao1grau", 4, "Equação do 1º grau avançada"),
    ("equacao1grau", 5, "Equação do 1º grau — desafio"),
    # Fases 46-48: Geometria (área)
    ("area_retangulo", 2, "Área do retângulo"),
    ("area_triangulo", 2, "Área do triângulo"),
    ("area_retangulo", 4, "Área — desafio"),
    # Fases 49-50: Trigonometria básica
    ("trigonometria", 1, "Trigonometria — ângulos notáveis"),
    ("trigonometria", 2, "Trigonometria — desafio final"),
]

TOTAL_FASES = len(FASES)  # 50
ACERTOS_PARA_SUBIR = 10   # exercícios consecutivos para passar de fase


def fase_info(nivel: int):
    """Devolve (topic, difficulty, label) da fase pedida (1-indexado)."""
    if nivel < 1:
        nivel = 1
    if nivel > TOTAL_FASES:
        nivel = TOTAL_FASES
    topic, dificuldade, label = FASES[nivel - 1]
    return {"level": nivel, "topic": topic, "difficulty": dificuldade, "label": label}


def curriculo_completo():
    """Lista todas as fases (para mostrar o mapa de progresso no front)."""
    return [
        {"level": i + 1, "topic": t, "difficulty": d, "label": lbl}
        for i, (t, d, lbl) in enumerate(FASES)
    ]
