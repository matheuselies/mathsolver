# MathSolver — Backend (API)

API em Python (Flask) com o sistema de fases 1–50, checkpoints, explicações
automáticas (acerto e erro) e modo treinamento com tentativas ilimitadas.

Banco: **SQLite** por padrão (biblioteca padrão do Python, zero configuração).
Roda local e no Railway. Migrar para PostgreSQL depois mexe só no `store.py`.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `app.py` | A API (rotas Flask) |
| `curriculum.py` | As 50 fases (tópico + dificuldade de cada uma) |
| `content.py` | Gera os exercícios e as explicações de cada tópico |
| `engine.py` | Regras de fase: 10 acertos seguidos sobem; checkpoint protege |
| `store.py` | Banco de dados (sqlite3) — único ponto que toca o banco |
| `test_engine.py` | Testa as regras e os exercícios |
| `test_api.py` | Testa a API inteira, ponta a ponta |

## Rodar local

```bash
pip install -r requirements.txt
python app.py
# API em http://localhost:5000
```

Testar:

```bash
python test_engine.py
python test_api.py
```

## Como o sistema de fases funciona

- Cada fase pede **10 exercícios certos seguidos** para você subir.
- Errar **zera a sequência** — você recomeça os 10 na fase em que está.
- Ao subir, ganha um **checkpoint**: nunca mais desce daquela fase.
- Passar da fase 50 conclui o jogo. 🏆

> A regra do "errou, volta ao início" foi interpretada como **reiniciar a
> sequência da fase atual** (e não perder fases), porque você pediu o checkpoint
> justamente para não deixar o usuário descer. Se quiser outra regra (ex.: cair
> até o checkpoint), é só ajustar `engine.py` — está isolado ali.

## Principais endpoints

| Método | Rota | Para quê |
|---|---|---|
| POST | `/api/user` | cria/recupera usuário (`{"username": "..."}`) |
| GET | `/api/progress/<id>` | progresso + fase atual |
| GET | `/api/exercise/<id>` | próximo exercício da fase |
| POST | `/api/answer` | responde (verifica no servidor + explica) |
| GET | `/api/curriculum` | mapa das 50 fases |
| GET | `/api/topics` | tópicos do treinamento |
| GET | `/api/training/exercise?topic=&difficulty=` | exercício de treino |
| POST | `/api/training/answer` | responde treino (não afeta fases) |

A resposta correta **nunca** vai para o navegador: fica guardada no banco e a
verificação acontece no servidor. Isso evita "colar" a resposta pelo front.

## Publicar no Railway

1. Suba esta pasta para um repositório (GitHub).
2. No Railway: **New Project → Deploy from GitHub**.
3. O Railway lê o `Procfile`/`railway.json` e sobe com `gunicorn`.
4. Para o SQLite persistir, adicione um **Volume** e aponte a variável
   `MATHSOLVER_DB` para um caminho dentro dele (ex.: `/data/mathsolver.db`).

### Migrar para PostgreSQL (passo futuro)

Quando quiser Postgres: adicione o plugin PostgreSQL no Railway e reescreva as
funções do `store.py` usando `psycopg` (a URL vem na variável `DATABASE_URL`).
Nenhum outro arquivo precisa mudar — o resto do app não sabe qual banco é usado.
