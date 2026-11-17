# MathSolver (mathapp)

Plataforma de matemática em português, para todas as idades. Resolve contas passo a passo, da tabuada à trigonometria, e tem um jogo de 50 fases com progresso salvo.

Site no ar: https://ember-data-weave.lovable.app

## O que tem no app

- **Calculadoras com passo a passo**: tabuada, operações básicas, potências e raízes, porcentagem, frações, MDC/MMC e fatoração, números inteiros, álgebra (1º grau, 2º grau e sistemas), geometria plana, geometria espacial e trigonometria.
- **Formulário**: todas as fórmulas por tema, com busca.
- **Exercícios**: problemas aleatórios com correção e placar.
- **Fases (jogo)**: 50 fases da soma à trigonometria. Para subir, acerte 10 seguidos. Errar zera a sequência, mas o checkpoint impede de cair de fase. O progresso fica salvo no banco.
- **Treinamento**: qualquer tópico e dificuldade, tentativas ilimitadas, sem afetar as fases.
- **Explicação em toda resposta**: no acerto, por que está certo; no erro, como resolver e a resposta correta.
- **Servidor MCP** em `/mcp`: as ferramentas de cálculo também podem ser usadas por assistentes de IA.

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Front-end | React 19, TanStack Start/Router, TypeScript |
| Estilo | Tailwind CSS 4, componentes shadcn/ui |
| Back-end do site | Server functions do TanStack Start |
| Banco | Supabase (PostgreSQL) |
| Back-end alternativo | Python + Flask + SQLite (pasta `backend/`) |
| Criado com | Lovable |

## Estrutura

```
src/
├── routes/              Páginas (uma por arquivo)
├── components/          Layout, cartões, painel de exercício
│   └── ui/              Componentes base (shadcn/ui)
├── lib/
│   ├── math/            Matemática das calculadoras
│   ├── game/            Sistema das 50 fases (roda no servidor)
│   └── mcp/             Ferramentas do servidor MCP
├── integrations/        Supabase e login
├── hooks/
└── styles.css           Tema, cores e animações
supabase/migrations/     Tabela de jogadores (players)
backend/                 API em Python (Flask) com o mesmo sistema de fases
```

Arquivos para começar a ler:

1. `src/lib/game/curriculum.ts`: as 50 fases.
2. `src/lib/game/engine.server.ts`: gera, resolve e explica cada exercício.
3. `src/lib/game/players.server.ts`: regra dos 10 acertos e do checkpoint.
4. `src/routes/fases.tsx`: a tela do jogo.

## Como rodar o site

Precisa de Node.js 20 ou mais novo.

```bash
npm install
cp .env.example .env      # preencha com os dados do seu Supabase
npm run dev               # o terminal mostra o endereço local
```

Para gerar a versão de produção: `npm run build`.

O jogo de fases precisa do banco. Crie um projeto no Supabase, rode o SQL de `supabase/migrations/` e coloque a URL e as chaves no `.env`. As calculadoras funcionam sem banco.

## Como rodar o back-end em Python

```bash
cd backend
pip install -r requirements.txt
python app.py             # API em http://localhost:5000
python test_engine.py     # testes das regras
python test_api.py        # testes da API
```

Detalhes e deploy no Railway: veja `backend/README.md`.

## Segurança

- O arquivo `.env` com as chaves não está no repositório. Use o `.env.example` como modelo.
- A resposta correta dos exercícios nunca vai para o navegador: o servidor guarda o exercício num token assinado e confere a resposta.
