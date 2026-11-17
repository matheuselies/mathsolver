"""
MathSolver — API (Flask + sqlite3, sem dependências pesadas).

Endpoints:
  GET  /api/health                   checagem simples
  POST /api/user                     cria/recupera usuário por nome
  GET  /api/progress/<user_id>       progresso + info da fase atual
  GET  /api/exercise/<user_id>       gera um exercício da fase atual do usuário
  POST /api/answer                   verifica resposta, atualiza fase, explica
  GET  /api/curriculum               mapa das 50 fases
  GET  /api/topics                   tópicos disponíveis no treinamento
  GET  /api/training/exercise        gera exercício de treino (não afeta fases)
  POST /api/training/answer          verifica treino + explicação (não afeta fases)

Rodar local:  python app.py    ->  http://localhost:5000
Produção:     gunicorn app:app  (Railway usa o Procfile)
"""
import json
import os

from flask import Flask, jsonify, request

import content
import curriculum
import engine
import store

app = Flask(__name__)

# CORS libera o front-end a chamar a API de outro domínio.
# Opcional para rodar; se a lib não estiver instalada, o app segue funcionando.
try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    pass

store.init_db()


def _exercicio_publico(ex_id, dados, extra=None):
    """O que o front recebe — SEM a resposta correta."""
    saida = {
        "exercise_id": ex_id,
        "topic": dados["topic"],
        "difficulty": dados.get("difficulty", 1),
        "prompt": dados["prompt"],
        "answer_type": dados["answer_type"],
    }
    if extra:
        saida.update(extra)
    return saida


# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return jsonify({"ok": True, "servico": "MathSolver API",
                    "fases": curriculum.TOTAL_FASES})


# ---------------------------------------------------------------------------
@app.post("/api/user")
def criar_usuario():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    if not username:
        return jsonify({"erro": "informe um 'username'"}), 400
    user = store.get_or_create_user(username)
    return jsonify({"user_id": user["id"], "username": user["username"],
                    "progresso": store.progresso(user)})


# ---------------------------------------------------------------------------
@app.get("/api/progress/<int:user_id>")
def progresso(user_id):
    user = store.get_user(user_id)
    if not user:
        return jsonify({"erro": "usuário não encontrado"}), 404
    return jsonify({
        "user_id": user["id"],
        "username": user["username"],
        "progresso": store.progresso(user),
        "fase_atual": curriculum.fase_info(user["current_level"]),
        "total_fases": curriculum.TOTAL_FASES,
    })


# ---------------------------------------------------------------------------
@app.get("/api/exercise/<int:user_id>")
def exercicio_fase(user_id):
    user = store.get_user(user_id)
    if not user:
        return jsonify({"erro": "usuário não encontrado"}), 404
    if user["completed"]:
        return jsonify({"concluido": True,
                        "mensagem": "Você concluiu todas as 50 fases! 🏆"})

    info = curriculum.fase_info(user["current_level"])
    dados = content.gerar(info["topic"], info["difficulty"])
    dados["difficulty"] = info["difficulty"]
    ex_id = store.create_exercise(dados, mode="fases", user_id=user["id"])

    return jsonify(_exercicio_publico(ex_id, dados, {
        "level": info["level"],
        "label": info["label"],
        "progresso": store.progresso(user),
    }))


# ---------------------------------------------------------------------------
@app.post("/api/answer")
def responder():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    exercise_id = body.get("exercise_id")
    resposta = body.get("answer")
    if user_id is None or not exercise_id or resposta is None:
        return jsonify({"erro": "envie 'user_id', 'exercise_id' e 'answer'"}), 400

    user = store.get_user(user_id)
    ex = store.get_exercise(exercise_id)
    if not user or not ex:
        return jsonify({"erro": "usuário ou exercício não encontrado"}), 404
    if ex["user_id"] != user["id"] or ex["mode"] != "fases":
        return jsonify({"erro": "exercício não pertence a este usuário"}), 400

    correta = json.loads(ex["answer"])
    params = json.loads(ex["params"])
    ok = content.check_answer(ex["answer_type"], correta, resposta)

    resultado = engine.aplicar_resultado(store.estado(user), ok)
    store.save_progress(user["id"], resultado["estado"])
    user = store.get_user(user["id"])  # relê já atualizado

    explicacao = content.explicar(ex["topic"], params, correta, resposta, ok)
    return jsonify({
        "correto": ok,
        "explicacao": explicacao,
        "eventos": resultado["eventos"],
        "progresso": store.progresso(user),
        "fase_atual": curriculum.fase_info(user["current_level"]),
    })


# ---------------------------------------------------------------------------
@app.get("/api/curriculum")
def curriculo():
    return jsonify({
        "total_fases": curriculum.TOTAL_FASES,
        "acertos_para_subir": curriculum.ACERTOS_PARA_SUBIR,
        "fases": curriculum.curriculo_completo(),
    })


@app.get("/api/topics")
def topicos():
    return jsonify({"topicos": content.topicos_treinamento()})


# ---------------------------------------------------------------------------
# Treinamento (tentativas ilimitadas, não afeta as fases)
# ---------------------------------------------------------------------------
@app.get("/api/training/exercise")
def treino_exercicio():
    topic = request.args.get("topic", "soma")
    try:
        dificuldade = int(request.args.get("difficulty", 2))
    except ValueError:
        dificuldade = 2
    if topic not in content.TOPICOS:
        return jsonify({"erro": "tópico inválido. Veja /api/topics."}), 400

    dados = content.gerar(topic, dificuldade)
    dados["difficulty"] = dificuldade
    ex_id = store.create_exercise(dados, mode="treinamento", user_id=None)
    return jsonify(_exercicio_publico(ex_id, dados))


@app.post("/api/training/answer")
def treino_responder():
    body = request.get_json(silent=True) or {}
    exercise_id = body.get("exercise_id")
    resposta = body.get("answer")
    if not exercise_id or resposta is None:
        return jsonify({"erro": "envie 'exercise_id' e 'answer'"}), 400

    ex = store.get_exercise(exercise_id)
    if not ex or ex["mode"] != "treinamento":
        return jsonify({"erro": "exercício de treino não encontrado"}), 404

    correta = json.loads(ex["answer"])
    params = json.loads(ex["params"])
    ok = content.check_answer(ex["answer_type"], correta, resposta)
    explicacao = content.explicar(ex["topic"], params, correta, resposta, ok)
    return jsonify({"correto": ok, "explicacao": explicacao})


if __name__ == "__main__":
    porta = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=porta, debug=True)
