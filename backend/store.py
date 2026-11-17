"""
Camada de dados do MathSolver — usando sqlite3 da biblioteca padrão.

Por que sqlite3 puro?
  - Zero dependências: roda em qualquer lugar com Python instalado.
  - Funciona local e no Railway (basta apontar o arquivo para um volume).
  - Fácil de migrar para PostgreSQL depois (as funções aqui são o único
    ponto que toca o banco — trocar por psycopg fica isolado neste arquivo).

Cada função abre e fecha a sua própria conexão. Para o tamanho deste app
isso é simples e seguro (inclusive com várias requisições ao mesmo tempo).
"""
import os
import sqlite3
import uuid
from datetime import datetime, timezone

DB_PATH = os.environ.get("MATHSOLVER_DB", "mathsolver.db")


def _agora():
    return datetime.now(timezone.utc).isoformat()


def _conn():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def init_db():
    with _conn() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                current_level INTEGER NOT NULL DEFAULT 1,
                checkpoint_level INTEGER NOT NULL DEFAULT 1,
                streak INTEGER NOT NULL DEFAULT 0,
                total_correct INTEGER NOT NULL DEFAULT 0,
                total_attempts INTEGER NOT NULL DEFAULT 0,
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS exercises (
                id TEXT PRIMARY KEY,
                topic TEXT NOT NULL,
                difficulty INTEGER NOT NULL DEFAULT 1,
                prompt TEXT NOT NULL,
                params TEXT NOT NULL,
                answer TEXT NOT NULL,
                answer_type TEXT NOT NULL,
                mode TEXT NOT NULL DEFAULT 'fases',
                user_id INTEGER,
                created_at TEXT NOT NULL
            )
        """)


# ---------------------------------------------------------------------------
# Usuários
# ---------------------------------------------------------------------------
def get_or_create_user(username):
    with _conn() as con:
        row = con.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if row is None:
            con.execute(
                "INSERT INTO users (username, created_at) VALUES (?, ?)",
                (username, _agora()),
            )
            row = con.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        return _user_dict(row)


def get_user(user_id):
    with _conn() as con:
        row = con.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return _user_dict(row) if row else None


def save_progress(user_id, estado):
    with _conn() as con:
        con.execute(
            """UPDATE users SET current_level=?, checkpoint_level=?, streak=?,
               total_correct=?, total_attempts=?, completed=? WHERE id=?""",
            (
                estado["current_level"], estado["checkpoint_level"], estado["streak"],
                estado["total_correct"], estado["total_attempts"],
                1 if estado["completed"] else 0, user_id,
            ),
        )


def _user_dict(row):
    return {
        "id": row["id"],
        "username": row["username"],
        "current_level": row["current_level"],
        "checkpoint_level": row["checkpoint_level"],
        "streak": row["streak"],
        "total_correct": row["total_correct"],
        "total_attempts": row["total_attempts"],
        "completed": bool(row["completed"]),
    }


def estado(user):
    """Dicionário que o motor de fases (engine.py) consome."""
    return {
        "current_level": user["current_level"],
        "checkpoint_level": user["checkpoint_level"],
        "streak": user["streak"],
        "total_correct": user["total_correct"],
        "total_attempts": user["total_attempts"],
        "completed": user["completed"],
    }


def progresso(user):
    """Versão para mostrar ao usuário (inclui quanto falta para subir)."""
    p = estado(user)
    p["faltam_para_subir"] = max(0, 10 - user["streak"])
    return p


# ---------------------------------------------------------------------------
# Exercícios (a resposta correta fica guardada aqui, no servidor)
# ---------------------------------------------------------------------------
def create_exercise(dados, mode, user_id=None):
    import json
    ex_id = uuid.uuid4().hex
    with _conn() as con:
        con.execute(
            """INSERT INTO exercises
               (id, topic, difficulty, prompt, params, answer, answer_type, mode, user_id, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                ex_id, dados["topic"], dados.get("difficulty", 1), dados["prompt"],
                json.dumps(dados["params"]), json.dumps(dados["answer"]),
                dados["answer_type"], mode, user_id, _agora(),
            ),
        )
    return ex_id


def get_exercise(exercise_id):
    with _conn() as con:
        row = con.execute("SELECT * FROM exercises WHERE id = ?", (exercise_id,)).fetchone()
        if not row:
            return None
        return {
            "id": row["id"], "topic": row["topic"], "difficulty": row["difficulty"],
            "prompt": row["prompt"], "params": row["params"], "answer": row["answer"],
            "answer_type": row["answer_type"], "mode": row["mode"], "user_id": row["user_id"],
        }
