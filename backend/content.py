"""
O "cérebro" didático do MathSolver.

Para cada tópico existem duas funções:
  gen(dificuldade)                      -> cria um exercício + a resposta correta
  exp(params, correta, resposta, ok)    -> gera a explicação (acerto OU erro)

A explicação sempre traz:
  - status: "acerto" ou "erro"
  - titulo: mensagem amigável
  - passos: a resolução passo a passo
  - formula: a fórmula/ideia usada
  - resposta_correta: para mostrar quando o usuário erra
  - dica: como corrigir (só quando erra)

Tudo é calculado aqui no servidor. Nada depende do navegador.
"""
import math
import random


# ----------------------------------------------------------------------------
# Utilidades de fração
# ----------------------------------------------------------------------------
def _simpl(n, d):
    """Simplifica a fração n/d e mantém o denominador positivo."""
    if d == 0:
        d = 1
    if d < 0:
        n, d = -n, -d
    g = math.gcd(abs(n), abs(d)) or 1
    return (n // g, d // g)


def _frac_str(par):
    n, d = par
    return str(n) if d == 1 else f"{n}/{d}"


# ----------------------------------------------------------------------------
# Verificação de resposta (comparação segura, no servidor)
# ----------------------------------------------------------------------------
def check_answer(answer_type, correta, resposta_bruta):
    """Compara a resposta do usuário com a correta. Devolve True/False."""
    s = str(resposta_bruta).strip()
    try:
        if answer_type == "int":
            return int(s) == int(correta)

        if answer_type == "float":
            valor = float(s.replace(",", "."))
            alvo = float(correta)
            tol = 0.01 * max(1.0, abs(alvo))
            return abs(valor - alvo) <= tol

        if answer_type == "fraction":
            alvo = _simpl(int(correta[0]), int(correta[1]))
            s = s.replace(" ", "")
            if "/" in s:
                p = s.split("/")
                usr = _simpl(int(p[0]), int(p[1]))
            else:
                # aceita inteiro também (ex.: "2" vale por 2/1)
                usr = _simpl(int(s), 1)
            return usr == alvo
    except (ValueError, IndexError, ZeroDivisionError):
        return False
    return False


def resposta_display(answer_type, correta):
    """Texto bonito da resposta correta para mostrar ao usuário."""
    if answer_type == "fraction":
        return _frac_str(_simpl(int(correta[0]), int(correta[1])))
    if answer_type == "float":
        val = float(correta)
        return str(int(val)) if val == int(val) else f"{val:.4f}".rstrip("0").rstrip(".")
    return str(correta)


def _base(status, titulo, passos, formula, resposta_txt, dica=None):
    saida = {
        "status": status,
        "titulo": titulo,
        "passos": passos,
        "formula": formula,
        "resposta_correta": resposta_txt,
    }
    if dica:
        saida["dica"] = dica
    return saida


# ============================================================================
# SOMA
# ============================================================================
def gen_soma(d):
    topo = {1: 10, 2: 50, 3: 100, 4: 500}.get(d, 10)
    a, b = random.randint(1, topo), random.randint(1, topo)
    return {"topic": "soma", "prompt": f"{a} + {b} = ?", "params": {"a": a, "b": b},
            "answer": a + b, "answer_type": "int"}


def exp_soma(p, correta, resp, ok):
    a, b = p["a"], p["b"]
    passos = [f"Juntamos as duas quantidades: {a} e {b}.",
              f"{a} + {b} = {a + b}."]
    if ok:
        return _base("acerto", "Boa! Soma certinha 🎯", passos,
                     "Soma: a + b", str(a + b))
    return _base("erro", "Quase! Vamos conferir a soma", passos,
                 "Soma: a + b", str(a + b),
                 dica=f"Some as unidades e depois as dezenas. O resultado de {a} + {b} é {a + b}.")


# ============================================================================
# SUBTRAÇÃO
# ============================================================================
def gen_subtracao(d):
    topo = {1: 10, 2: 50, 3: 100, 4: 500}.get(d, 10)
    a = random.randint(1, topo)
    b = random.randint(0, a)  # garante resultado >= 0
    return {"topic": "subtracao", "prompt": f"{a} - {b} = ?", "params": {"a": a, "b": b},
            "answer": a - b, "answer_type": "int"}


def exp_subtracao(p, correta, resp, ok):
    a, b = p["a"], p["b"]
    passos = [f"Partimos de {a} e tiramos {b}.",
              f"{a} - {b} = {a - b}."]
    if ok:
        return _base("acerto", "Certo! Subtração no ponto ✅", passos,
                     "Subtração: a - b", str(a - b))
    return _base("erro", "Ops! Olha a subtração", passos,
                 "Subtração: a - b", str(a - b),
                 dica=f"Confira o empréstimo das dezenas. {a} menos {b} dá {a - b}.")


# ============================================================================
# MULTIPLICAÇÃO
# ============================================================================
def gen_multiplicacao(d):
    faixas = {1: (1, 5, 1, 5), 2: (1, 10, 1, 10), 3: (1, 12, 1, 12),
              4: (2, 20, 2, 12), 5: (10, 30, 2, 12)}
    a1, a2, b1, b2 = faixas.get(d, (1, 10, 1, 10))
    a, b = random.randint(a1, a2), random.randint(b1, b2)
    return {"topic": "multiplicacao", "prompt": f"{a} × {b} = ?", "params": {"a": a, "b": b},
            "answer": a * b, "answer_type": "int"}


def exp_multiplicacao(p, correta, resp, ok):
    a, b = p["a"], p["b"]
    passos = [f"Multiplicar {a} × {b} é somar {a} um total de {b} vezes.",
              f"{a} × {b} = {a * b}."]
    if ok:
        return _base("acerto", "Mandou bem na tabuada! ✖️", passos,
                     "Multiplicação: a × b", str(a * b))
    return _base("erro", "Vamos revisar essa multiplicação", passos,
                 "Multiplicação: a × b", str(a * b),
                 dica=f"Dica: {a} × {b} = {a} + {a} + ... ({b} vezes) = {a * b}.")


# ============================================================================
# DIVISÃO (exata)
# ============================================================================
def gen_divisao(d):
    faixas = {1: (2, 5, 1, 5), 2: (2, 9, 2, 9), 3: (2, 12, 2, 12), 4: (3, 15, 3, 15)}
    b1, b2, q1, q2 = faixas.get(d, (2, 9, 2, 9))
    b = random.randint(b1, b2)          # divisor
    q = random.randint(q1, q2)          # quociente
    a = b * q                            # dividendo (garante divisão exata)
    return {"topic": "divisao", "prompt": f"{a} ÷ {b} = ?", "params": {"a": a, "b": b, "q": q},
            "answer": q, "answer_type": "int"}


def exp_divisao(p, correta, resp, ok):
    a, b, q = p["a"], p["b"], p["q"]
    passos = [f"Pergunta-se: quantas vezes {b} cabe em {a}?",
              f"Como {b} × {q} = {a}, então {a} ÷ {b} = {q}."]
    if ok:
        return _base("acerto", "Divisão exata, perfeito! ➗", passos,
                     "Divisão: a ÷ b (quando b × q = a)", str(q))
    return _base("erro", "Vamos pela multiplicação inversa", passos,
                 "Divisão: a ÷ b", str(q),
                 dica=f"Procure o número que multiplicado por {b} dá {a}. É o {q}.")


# ============================================================================
# POTENCIAÇÃO
# ============================================================================
def gen_potenciacao(d):
    faixas = {1: (2, 12, 2, 2), 2: (2, 6, 2, 3), 3: (2, 6, 2, 4), 4: (2, 8, 2, 4)}
    b1, b2, e1, e2 = faixas.get(d, (2, 6, 2, 3))
    base = random.randint(b1, b2)
    exp = random.randint(e1, e2)
    return {"topic": "potenciacao", "prompt": f"{base}^{exp} = ?", "params": {"base": base, "exp": exp},
            "answer": base ** exp, "answer_type": "int"}


def exp_potenciacao(p, correta, resp, ok):
    base, exp = p["base"], p["exp"]
    fatores = " × ".join([str(base)] * exp)
    r = base ** exp
    passos = [f"A potência {base}^{exp} significa multiplicar {base} por ele mesmo {exp} vezes.",
              f"{fatores} = {r}."]
    if ok:
        return _base("acerto", "Potência dominada! 💪", passos,
                     "Potenciação: aⁿ = a × a × ... (n vezes)", str(r))
    return _base("erro", "Cuidado: potência não é multiplicar a base pelo expoente", passos,
                 "Potenciação: aⁿ", str(r),
                 dica=f"{base}^{exp} não é {base}×{exp}. É {fatores} = {r}.")


# ============================================================================
# RADICIAÇÃO (raiz quadrada exata)
# ============================================================================
def gen_radiciacao(d):
    topo = {1: 10, 2: 15, 3: 25}.get(d, 10)
    r = random.randint(1, topo)
    n = r * r
    return {"topic": "radiciacao", "prompt": f"√{n} = ?", "params": {"n": n, "r": r},
            "answer": r, "answer_type": "int"}


def exp_radiciacao(p, correta, resp, ok):
    n, r = p["n"], p["r"]
    passos = [f"A raiz quadrada de {n} é o número que, elevado ao quadrado, dá {n}.",
              f"Como {r} × {r} = {n}, então √{n} = {r}."]
    if ok:
        return _base("acerto", "Raiz certeira! 🌱", passos,
                     "Radiciação: √a = b  quando  b² = a", str(r))
    return _base("erro", "Pense no quadrado perfeito", passos,
                 "Radiciação: √a", str(r),
                 dica=f"Qual número vezes ele mesmo dá {n}? É o {r}, pois {r}×{r}={n}.")


# ============================================================================
# FRAÇÃO (soma e subtração)
# ============================================================================
def gen_fracao(d):
    topo = {1: 5, 2: 8, 3: 9, 4: 12, 5: 15}.get(d, 6)
    permite_sub = d >= 3
    b = random.randint(2, topo)
    e = random.randint(2, topo)
    a = random.randint(1, b)
    c = random.randint(1, e)
    op = "-" if (permite_sub and random.random() < 0.5) else "+"
    if op == "+":
        num, den = a * e + c * b, b * e
    else:
        num, den = a * e - c * b, b * e
        if num < 0:  # evita resultado negativo, troca a ordem
            a, b, c, e = c, e, a, b
            num, den = a * e - c * b, b * e
    ans = _simpl(num, den)
    return {"topic": "fracao",
            "prompt": f"{a}/{b} {op} {c}/{e} = ?  (responda como fração, ex.: 3/4)",
            "params": {"a": a, "b": b, "c": c, "e": e, "op": op, "num": num, "den": den},
            "answer": [ans[0], ans[1]], "answer_type": "fraction"}


def exp_fracao(p, correta, resp, ok):
    a, b, c, e, op = p["a"], p["b"], p["c"], p["e"], p["op"]
    num, den = p["num"], p["den"]
    simp = _simpl(num, den)
    passos = [
        f"Denominador comum: {b} × {e} = {den}.",
        f"Reescrevendo: {a}/{b} = {a * e}/{den}  e  {c}/{e} = {c * b}/{den}.",
        f"{op == '+' and 'Somando' or 'Subtraindo'} os numeradores: {a * e} {op} {c * b} = {num}.",
        f"Resultado: {num}/{den}"
        + (f", que simplifica para {_frac_str(simp)}." if (num, den) != simp else "."),
    ]
    formula = "a/b ± c/d = (a·d ± c·b) / (b·d), depois simplifica"
    if ok:
        return _base("acerto", "Frações somadas com estilo! 🍕", passos, formula, _frac_str(simp))
    return _base("erro", "O segredo é o denominador comum", passos, formula, _frac_str(simp),
                 dica="Antes de somar, deixe as duas frações com o mesmo denominador. "
                      f"Aqui o comum é {den}.")


# ============================================================================
# PORCENTAGEM
# ============================================================================
def gen_porcentagem(d):
    topo = {1: 100, 2: 200, 3: 500, 4: 1000}.get(d, 100)
    percents = {1: [10, 25, 50], 2: [5, 10, 20, 25, 50, 75]}.get(d, [5, 10, 15, 20, 25, 50, 75])
    x = random.choice(percents)
    y = random.randrange(20, topo + 1, 20)  # múltiplo de 20 -> resultado inteiro
    ans = x * y // 100
    return {"topic": "porcentagem", "prompt": f"Quanto é {x}% de {y}?",
            "params": {"x": x, "y": y}, "answer": ans, "answer_type": "int"}


def exp_porcentagem(p, correta, resp, ok):
    x, y = p["x"], p["y"]
    ans = x * y // 100
    passos = [f"{x}% significa {x} para cada 100, ou seja, a fração {x}/100.",
              f"Multiplicamos pela quantidade: {x}/100 × {y} = ({x} × {y}) / 100.",
              f"= {x * y} / 100 = {ans}."]
    formula = "x% de y = (x/100) × y"
    if ok:
        return _base("acerto", "Porcentagem na veia! 📊", passos, formula, str(ans))
    return _base("erro", "Transforme a % em fração de 100", passos, formula, str(ans),
                 dica=f"{x}% de {y} = {x}/100 × {y} = {ans}.")


# ============================================================================
# INTEIROS (com sinais)
# ============================================================================
def gen_inteiros(d):
    topo = {1: 10, 2: 20, 3: 50, 4: 100}.get(d, 20)
    a = random.randint(-topo, topo)
    b = random.randint(-topo, topo)
    op = random.choice(["+", "-"]) if d >= 2 else "+"
    ans = a + b if op == "+" else a - b
    # formatação com parênteses nos negativos
    b_txt = f"({b})" if b < 0 else f"{b}"
    return {"topic": "inteiros", "prompt": f"{a} {op} {b_txt} = ?",
            "params": {"a": a, "b": b, "op": op}, "answer": ans, "answer_type": "int"}


def exp_inteiros(p, correta, resp, ok):
    a, b, op = p["a"], p["b"], p["op"]
    ans = a + b if op == "+" else a - b
    if op == "-":
        regra = f"Subtrair é somar o oposto: {a} - ({b}) = {a} + ({-b})."
    else:
        regra = ("Sinais iguais: soma e mantém o sinal. Sinais diferentes: subtrai e "
                 "fica com o sinal do maior em módulo.")
    passos = [regra, f"Resultado: {ans}."]
    formula = "Regra de sinais na adição/subtração"
    if ok:
        return _base("acerto", "Sinais sob controle! ➕➖", passos, formula, str(ans))
    return _base("erro", "Atenção à regra de sinais", passos, formula, str(ans),
                 dica="Lembre: (+) com (−) → subtrai; menos de um negativo vira mais. "
                      f"A resposta é {ans}.")


# ============================================================================
# MDC
# ============================================================================
def gen_mdc(d):
    g = random.randint(2, 9)
    # multiplicadores coprimos, para o MDC ser exatamente g
    while True:
        m, n = random.randint(2, 9), random.randint(2, 9)
        if math.gcd(m, n) == 1 and m != n:
            break
    a, b = g * m, g * n
    return {"topic": "mdc", "prompt": f"MDC({a}, {b}) = ?",
            "params": {"a": a, "b": b}, "answer": math.gcd(a, b), "answer_type": "int"}


def exp_mdc(p, correta, resp, ok):
    a, b = p["a"], p["b"]
    g = math.gcd(a, b)
    # passos do algoritmo de Euclides
    x, y = a, b
    linhas = []
    while y:
        linhas.append(f"MDC({x}, {y}): {x} = {x // y}×{y} + {x % y}")
        x, y = y, x % y
    passos = ["Usamos o algoritmo de Euclides (divisões sucessivas):"] + linhas + \
             [f"O último resto diferente de zero é {g}. Então MDC({a}, {b}) = {g}."]
    formula = "Algoritmo de Euclides: MDC(a,b) = MDC(b, a mod b)"
    if ok:
        return _base("acerto", "MDC na mão! 🔗", passos, formula, str(g))
    return _base("erro", "Vá dividindo até o resto zerar", passos, formula, str(g),
                 dica=f"O maior número que divide {a} e {b} ao mesmo tempo é {g}.")


# ============================================================================
# MMC
# ============================================================================
def gen_mmc(d):
    topo = {2: 12, 3: 20}.get(d, 12)
    a = random.randint(2, topo)
    b = random.randint(2, topo)
    mmc = a * b // math.gcd(a, b)
    return {"topic": "mmc", "prompt": f"MMC({a}, {b}) = ?",
            "params": {"a": a, "b": b}, "answer": mmc, "answer_type": "int"}


def exp_mmc(p, correta, resp, ok):
    a, b = p["a"], p["b"]
    g = math.gcd(a, b)
    mmc = a * b // g
    passos = [f"MMC × MDC = a × b. Primeiro o MDC({a}, {b}) = {g}.",
              f"Então MMC = ({a} × {b}) ÷ {g} = {a * b} ÷ {g} = {mmc}."]
    formula = "MMC(a,b) = (a × b) ÷ MDC(a,b)"
    if ok:
        return _base("acerto", "MMC certinho! 🔁", passos, formula, str(mmc))
    return _base("erro", "Combine MDC e produto", passos, formula, str(mmc),
                 dica=f"Menor número que é múltiplo de {a} e de {b} ao mesmo tempo: {mmc}.")


# ============================================================================
# EQUAÇÃO DO 1º GRAU  (ax + b = c)
# ============================================================================
def gen_equacao1grau(d):
    faixas = {1: (1, 3, 1, 10, 0, 10), 2: (1, 5, -5, 10, -10, 10),
              3: (2, 8, -10, 10, -15, 15), 4: (2, 12, -12, 12, -20, 20),
              5: (2, 15, -15, 15, -30, 30)}
    a1, a2, x1, x2, b1, b2 = faixas.get(d, (1, 5, -5, 10, -10, 10))
    a = random.randint(a1, a2)
    if a == 0:
        a = 1
    x = random.randint(x1, x2)     # solução inteira (construída de propósito)
    b = random.randint(b1, b2)
    c = a * x + b
    b_txt = f"+ {b}" if b >= 0 else f"- {-b}"
    return {"topic": "equacao1grau", "prompt": f"Resolva: {a}x {b_txt} = {c}   (x = ?)",
            "params": {"a": a, "b": b, "c": c, "x": x}, "answer": x, "answer_type": "int"}


def exp_equacao1grau(p, correta, resp, ok):
    a, b, c, x = p["a"], p["b"], p["c"], p["x"]
    passos = [f"Isolar o x: passe o {b:+d} para o outro lado trocando o sinal.",
              f"{a}x = {c} - ({b}) = {c - b}.",
              f"Divida os dois lados por {a}: x = {c - b} ÷ {a} = {x}."]
    formula = "ax + b = c  →  x = (c - b) / a"
    if ok:
        return _base("acerto", "Equação resolvida! 🧠", passos, formula, str(x))
    return _base("erro", "Isole o x com calma", passos, formula, str(x),
                 dica=f"Primeiro tire o termo {b:+d}, depois divida por {a}. Dá x = {x}.")


# ============================================================================
# ÁREA DO RETÂNGULO
# ============================================================================
def gen_area_retangulo(d):
    topo = {2: 20, 4: 50}.get(d, 20)
    base = random.randint(2, topo)
    alt = random.randint(2, topo)
    return {"topic": "area_retangulo",
            "prompt": f"Área de um retângulo de base {base} e altura {alt}?",
            "params": {"base": base, "alt": alt}, "answer": base * alt, "answer_type": "int"}


def exp_area_retangulo(p, correta, resp, ok):
    base, alt = p["base"], p["alt"]
    a = base * alt
    passos = [f"Área do retângulo = base × altura.",
              f"= {base} × {alt} = {a}."]
    formula = "A = base × altura"
    if ok:
        return _base("acerto", "Área calculada! 🟦", passos, formula, str(a))
    return _base("erro", "É só multiplicar os lados", passos, formula, str(a),
                 dica=f"Base × altura = {base} × {alt} = {a}.")


# ============================================================================
# ÁREA DO TRIÂNGULO
# ============================================================================
def gen_area_triangulo(d):
    topo = {2: 20, 4: 40}.get(d, 20)
    base = random.randint(2, topo)
    # garante base×altura par -> área inteira
    alt = random.randint(2, topo)
    if (base * alt) % 2 != 0:
        alt += 1
    return {"topic": "area_triangulo",
            "prompt": f"Área de um triângulo de base {base} e altura {alt}?",
            "params": {"base": base, "alt": alt}, "answer": base * alt // 2, "answer_type": "int"}


def exp_area_triangulo(p, correta, resp, ok):
    base, alt = p["base"], p["alt"]
    a = base * alt // 2
    passos = [f"Área do triângulo = (base × altura) ÷ 2.",
              f"= ({base} × {alt}) ÷ 2 = {base * alt} ÷ 2 = {a}."]
    formula = "A = (base × altura) / 2"
    if ok:
        return _base("acerto", "Triângulo dominado! 🔺", passos, formula, str(a))
    return _base("erro", "Não esqueça de dividir por 2", passos, formula, str(a),
                 dica=f"(base × altura) ÷ 2 = ({base} × {alt}) ÷ 2 = {a}.")


# ============================================================================
# TRIGONOMETRIA (ângulos notáveis)
# ============================================================================
_EXATOS = {
    ("sen", 0): "0", ("sen", 30): "1/2", ("sen", 45): "√2/2", ("sen", 60): "√3/2", ("sen", 90): "1",
    ("cos", 0): "1", ("cos", 30): "√3/2", ("cos", 45): "√2/2", ("cos", 60): "1/2", ("cos", 90): "0",
    ("tan", 0): "0", ("tan", 30): "√3/3", ("tan", 45): "1", ("tan", 60): "√3",
}


def gen_trigonometria(d):
    funcs = ["sen", "cos"] if d == 1 else ["sen", "cos", "tan"]
    f = random.choice(funcs)
    angulos = [0, 30, 45, 60, 90]
    if f == "tan":
        angulos = [0, 30, 45, 60]  # evita tan(90) que é indefinida
    ang = random.choice(angulos)
    rad = math.radians(ang)
    valor = {"sen": math.sin, "cos": math.cos, "tan": math.tan}[f](rad)
    valor = round(valor, 4)
    return {"topic": "trigonometria",
            "prompt": f"{f}({ang}°) = ?  (responda em decimal, ex.: 0.5)",
            "params": {"f": f, "ang": ang}, "answer": valor, "answer_type": "float"}


def exp_trigonometria(p, correta, resp, ok):
    f, ang = p["f"], p["ang"]
    exato = _EXATOS.get((f, ang), "?")
    val = float(correta)
    val_txt = str(int(val)) if val == int(val) else f"{val:.4f}".rstrip("0").rstrip(".")
    passos = [f"{f}({ang}°) é um valor da tabela de ângulos notáveis.",
              f"Valor exato: {exato}  ≈  {val_txt}."]
    formula = "Tabela de ângulos notáveis (0°, 30°, 45°, 60°, 90°)"
    if ok:
        return _base("acerto", "Trigonometria afiada! 📐", passos, formula, val_txt)
    return _base("erro", "Recorra à tabela dos notáveis", passos, formula, val_txt,
                 dica=f"{f}({ang}°) = {exato} ≈ {val_txt}. Vale memorizar essa tabelinha!")


# ============================================================================
# REGISTRO DOS TÓPICOS
# ============================================================================
TOPICOS = {
    "soma": {"label": "Soma", "gen": gen_soma, "exp": exp_soma},
    "subtracao": {"label": "Subtração", "gen": gen_subtracao, "exp": exp_subtracao},
    "multiplicacao": {"label": "Multiplicação", "gen": gen_multiplicacao, "exp": exp_multiplicacao},
    "divisao": {"label": "Divisão", "gen": gen_divisao, "exp": exp_divisao},
    "potenciacao": {"label": "Potenciação", "gen": gen_potenciacao, "exp": exp_potenciacao},
    "radiciacao": {"label": "Radiciação", "gen": gen_radiciacao, "exp": exp_radiciacao},
    "fracao": {"label": "Frações", "gen": gen_fracao, "exp": exp_fracao},
    "porcentagem": {"label": "Porcentagem", "gen": gen_porcentagem, "exp": exp_porcentagem},
    "inteiros": {"label": "Números inteiros", "gen": gen_inteiros, "exp": exp_inteiros},
    "mdc": {"label": "MDC", "gen": gen_mdc, "exp": exp_mdc},
    "mmc": {"label": "MMC", "gen": gen_mmc, "exp": exp_mmc},
    "equacao1grau": {"label": "Equação do 1º grau", "gen": gen_equacao1grau, "exp": exp_equacao1grau},
    "area_retangulo": {"label": "Área do retângulo", "gen": gen_area_retangulo, "exp": exp_area_retangulo},
    "area_triangulo": {"label": "Área do triângulo", "gen": gen_area_triangulo, "exp": exp_area_triangulo},
    "trigonometria": {"label": "Trigonometria", "gen": gen_trigonometria, "exp": exp_trigonometria},
}


def gerar(topic, dificuldade):
    return TOPICOS[topic]["gen"](dificuldade)


def explicar(topic, params, correta, resposta, ok):
    return TOPICOS[topic]["exp"](params, correta, resposta, ok)


def topicos_treinamento():
    return [{"topic": k, "label": v["label"]} for k, v in TOPICOS.items()]
