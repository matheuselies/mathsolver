"""
Testes das regras de fase/checkpoint e da geração/verificação de exercícios.
Rode com:  python test_engine.py
"""
import engine
import content
import curriculum


def _seq(estado, resultados):
    """Aplica uma sequência de True/False e devolve o estado final."""
    ev = None
    for r in resultados:
        out = engine.aplicar_resultado(estado, r)
        estado, ev = out["estado"], out["eventos"]
    return estado, ev


def test_sobe_com_10_acertos():
    e = engine.estado_inicial()
    e, ev = _seq(e, [True] * 10)
    assert e["current_level"] == 2, e
    assert e["checkpoint_level"] == 2, e
    assert e["streak"] == 0, e
    assert ev["subiu_de_fase"] and ev["checkpoint"]
    print("✓ 10 acertos seguidos sobem de fase e criam checkpoint")


def test_erro_zera_streak_mas_nao_desce():
    e = engine.estado_inicial()
    e, _ = _seq(e, [True] * 5)      # 5 acertos na fase 1
    assert e["streak"] == 5
    e, ev = _seq(e, [False])        # erra
    assert e["streak"] == 0, e
    assert e["current_level"] == 1, e      # continua na fase 1
    assert ev["zerou_streak"]
    print("✓ Errar zera a sequência mas não faz descer de fase")


def test_checkpoint_protege_fase_conquistada():
    e = engine.estado_inicial()
    e, _ = _seq(e, [True] * 10)     # sobe para fase 2
    assert e["current_level"] == 2
    e, _ = _seq(e, [True] * 3)      # 3 acertos na fase 2
    e, _ = _seq(e, [False])         # erra na fase 2
    assert e["current_level"] == 2, e      # NÃO volta para a fase 1
    assert e["checkpoint_level"] == 2, e
    print("✓ Checkpoint mantém o usuário na fase conquistada")


def test_conclui_o_jogo():
    e = engine.estado_inicial()
    e["current_level"] = curriculum.TOTAL_FASES  # começa na última fase
    e["checkpoint_level"] = curriculum.TOTAL_FASES
    e, ev = _seq(e, [True] * 10)
    assert e["completed"] is True, e
    assert ev["concluiu_jogo"]
    print("✓ 10 acertos na fase 50 concluem o jogo")


def test_todos_topicos_geram_e_verificam():
    """Cada tópico deve gerar um exercício e reconhecer a própria resposta."""
    for topic in content.TOPICOS:
        for dif in range(1, 6):
            dados = content.gerar(topic, dif)
            correta = dados["answer"]
            # a resposta correta em texto deve ser aceita pela verificação
            texto = content.resposta_display(dados["answer_type"], correta)
            ok = content.check_answer(dados["answer_type"], correta, texto)
            assert ok, f"{topic} d{dif}: '{texto}' devia ser aceito. prompt={dados['prompt']}"
            # explicação de acerto e de erro não podem quebrar
            content.explicar(topic, dados["params"], correta, texto, True)
            content.explicar(topic, dados["params"], correta, "-999999", False)
    print(f"✓ Todos os {len(content.TOPICOS)} tópicos geram, verificam e explicam")


def test_curriculo_usa_topicos_validos():
    for fase in curriculum.curriculo_completo():
        assert fase["topic"] in content.TOPICOS, f"fase {fase['level']}: tópico inexistente"
    assert curriculum.TOTAL_FASES == 50, curriculum.TOTAL_FASES
    print(f"✓ As {curriculum.TOTAL_FASES} fases apontam para tópicos válidos")


def test_resposta_errada_e_rejeitada():
    dados = content.gerar("soma", 2)
    correta = dados["answer"]
    assert content.check_answer("int", correta, str(correta + 1)) is False
    print("✓ Resposta errada é rejeitada corretamente")


if __name__ == "__main__":
    test_sobe_com_10_acertos()
    test_erro_zera_streak_mas_nao_desce()
    test_checkpoint_protege_fase_conquistada()
    test_conclui_o_jogo()
    test_todos_topicos_geram_e_verificam()
    test_curriculo_usa_topicos_validos()
    test_resposta_errada_e_rejeitada()
    print("\n🎉 TODOS OS TESTES PASSARAM")
