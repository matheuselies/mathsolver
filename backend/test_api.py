"""
Teste de integração da API inteira, ponta a ponta, usando o test_client do Flask.
Usa um banco temporário só para o teste. Rode com:  python test_api.py
"""
import json
import os
import tempfile

# banco temporário isolado antes de importar o app
_fd, _path = tempfile.mkstemp(suffix=".db")
os.close(_fd)
os.environ["MATHSOLVER_DB"] = _path

import app as app_module  # noqa: E402

client = app_module.app.test_client()


def _resolver_certo(ex):
    """Descobre a resposta correta para simular um usuário que acerta."""
    import store, content
    row = store.get_exercise(ex["exercise_id"])
    correta = json.loads(row["answer"])
    return content.resposta_display(row["answer_type"], correta)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.get_json()["ok"] is True
    print("✓ /api/health responde")


def test_fluxo_de_fases_completo():
    # cria usuário
    r = client.post("/api/user", json={"username": "pedro"})
    uid = r.get_json()["user_id"]
    assert r.get_json()["progresso"]["current_level"] == 1

    # acerta 9 -> ainda na fase 1, streak 9
    for i in range(9):
        ex = client.get(f"/api/exercise/{uid}").get_json()
        certo = _resolver_certo(ex)
        r = client.post("/api/answer", json={"user_id": uid,
                                             "exercise_id": ex["exercise_id"],
                                             "answer": certo}).get_json()
        assert r["correto"] is True
    prog = client.get(f"/api/progress/{uid}").get_json()["progresso"]
    assert prog["current_level"] == 1 and prog["streak"] == 9, prog

    # 10º acerto -> sobe para fase 2
    ex = client.get(f"/api/exercise/{uid}").get_json()
    r = client.post("/api/answer", json={"user_id": uid,
                                         "exercise_id": ex["exercise_id"],
                                         "answer": _resolver_certo(ex)}).get_json()
    assert r["eventos"]["subiu_de_fase"] is True
    assert r["progresso"]["current_level"] == 2, r["progresso"]
    print("✓ 10 acertos via API sobem da fase 1 para a 2")

    # avança mais um pouco na fase 2 e ERRA -> streak zera, mas continua na fase 2
    ex = client.get(f"/api/exercise/{uid}").get_json()
    client.post("/api/answer", json={"user_id": uid, "exercise_id": ex["exercise_id"],
                                     "answer": _resolver_certo(ex)})
    ex = client.get(f"/api/exercise/{uid}").get_json()
    r = client.post("/api/answer", json={"user_id": uid, "exercise_id": ex["exercise_id"],
                                         "answer": "resposta_errada_de_proposito"}).get_json()
    assert r["correto"] is False
    assert r["progresso"]["current_level"] == 2, "checkpoint deveria segurar na fase 2"
    assert r["progresso"]["streak"] == 0
    assert "dica" in r["explicacao"]  # erro traz dica de correção
    print("✓ Erro na fase 2 zera streak, mantém a fase (checkpoint) e traz dica")


def test_explicacao_no_acerto():
    r = client.post("/api/user", json={"username": "ana"}).get_json()
    uid = r["user_id"]
    ex = client.get(f"/api/exercise/{uid}").get_json()
    r = client.post("/api/answer", json={"user_id": uid, "exercise_id": ex["exercise_id"],
                                         "answer": _resolver_certo(ex)}).get_json()
    assert r["correto"] is True
    assert r["explicacao"]["status"] == "acerto"
    assert len(r["explicacao"]["passos"]) >= 1
    print("✓ Acerto traz explicação com passos")


def test_treinamento_ilimitado():
    # pega tópicos
    tops = client.get("/api/topics").get_json()["topicos"]
    assert len(tops) >= 10
    # treina frações: erra e depois acerta, sem afetar fases
    ex = client.get("/api/training/exercise?topic=fracao&difficulty=3").get_json()
    r_err = client.post("/api/training/answer", json={"exercise_id": ex["exercise_id"],
                                                      "answer": "9/1"}).get_json()
    r_ok = None
    ex2 = client.get("/api/training/exercise?topic=fracao&difficulty=3").get_json()
    import store, content
    row = store.get_exercise(ex2["exercise_id"])
    certo = content.resposta_display(row["answer_type"], json.loads(row["answer"]))
    r_ok = client.post("/api/training/answer", json={"exercise_id": ex2["exercise_id"],
                                                     "answer": certo}).get_json()
    assert r_ok["correto"] is True
    assert "status" in r_err["explicacao"]
    print("✓ Treinamento funciona (tentativas ilimitadas, com explicação)")


def test_curriculum_50():
    c = client.get("/api/curriculum").get_json()
    assert c["total_fases"] == 50
    assert len(c["fases"]) == 50
    assert c["acertos_para_subir"] == 10
    print("✓ /api/curriculum devolve as 50 fases")


if __name__ == "__main__":
    try:
        test_health()
        test_fluxo_de_fases_completo()
        test_explicacao_no_acerto()
        test_treinamento_ilimitado()
        test_curriculum_50()
        print("\n🎉 TODOS OS TESTES DA API PASSARAM")
    finally:
        os.remove(_path)
