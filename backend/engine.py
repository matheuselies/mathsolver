"""
Motor do sistema de fases.

Regras (as que você definiu):
  - Para subir de fase é preciso acertar 10 exercícios SEGUIDOS na fase atual.
  - Ao errar um exercício, o contador de acertos zera (a fase "recomeça").
  - Cada vez que sobe de fase, ganha um CHECKPOINT: nunca mais desce abaixo
    da fase conquistada. Por isso, ao errar, o usuário NÃO cai de fase —
    ele apenas volta a precisar de 10 acertos seguidos na fase onde está.
  - Ao passar da fase 50 (10 acertos na 50), o jogo é concluído. 🎉

Estas funções são "puras": recebem o estado atual e devolvem o novo estado,
sem tocar no banco. Isso deixa a regra fácil de testar (ver test_engine.py).
"""
from curriculum import ACERTOS_PARA_SUBIR, TOTAL_FASES


def aplicar_resultado(estado: dict, acertou: bool) -> dict:
    """
    estado = {current_level, checkpoint_level, streak, total_correct,
              total_attempts, completed}
    Devolve (novo_estado, eventos).
    """
    e = dict(estado)  # cópia, não altera o original
    eventos = {"subiu_de_fase": False, "checkpoint": False,
               "zerou_streak": False, "concluiu_jogo": False}

    e["total_attempts"] = e.get("total_attempts", 0) + 1

    if e.get("completed"):
        # já terminou tudo; só registra a tentativa e (se acertou) o acerto
        if acertou:
            e["total_correct"] = e.get("total_correct", 0) + 1
        return {"estado": e, "eventos": eventos}

    if not acertou:
        # errou -> zera a sequência, mas continua na mesma fase (checkpoint protege)
        if e.get("streak", 0) > 0:
            eventos["zerou_streak"] = True
        e["streak"] = 0
        return {"estado": e, "eventos": eventos}

    # acertou
    e["total_correct"] = e.get("total_correct", 0) + 1
    e["streak"] = e.get("streak", 0) + 1

    if e["streak"] >= ACERTOS_PARA_SUBIR:
        # completou a fase!
        if e["current_level"] >= TOTAL_FASES:
            e["completed"] = True
            e["streak"] = ACERTOS_PARA_SUBIR
            eventos["concluiu_jogo"] = True
        else:
            e["current_level"] += 1
            e["checkpoint_level"] = e["current_level"]  # novo checkpoint
            e["streak"] = 0
            eventos["subiu_de_fase"] = True
            eventos["checkpoint"] = True

    return {"estado": e, "eventos": eventos}


def estado_inicial() -> dict:
    return {
        "current_level": 1,
        "checkpoint_level": 1,
        "streak": 0,
        "total_correct": 0,
        "total_attempts": 0,
        "completed": False,
    }
