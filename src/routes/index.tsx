import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { topics } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MathSolver — Matemática resolvida passo a passo" },
      {
        name: "description",
        content:
          "Tabuada, calculadora, frações, MDC/MMC, álgebra, geometria e trigonometria com resolução passo a passo e um formulário completo.",
      },
      { property: "og:title", content: "MathSolver — Matemática resolvida passo a passo" },
      {
        property: "og:description",
        content: "Tabuada, calculadora, frações, MDC/MMC, álgebra, geometria e trigonometria com resolução passo a passo e um formulário completo.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const highlights = [
  { to: "/fases", title: "50 fases com progresso", text: "10 acertos seguidos por fase, checkpoint garantido." },
  { to: "/treinamento", title: "Treinamento livre", text: "Qualquer tópico, tentativas ilimitadas." },
  { to: "/tabuada", title: "Tabuada interativa", text: "Multiplicação de 1 a 10 em tabela." },
  { to: "/calculadora", title: "Calculadora básica", text: "Soma, subtração, multiplicação e divisão." },
  { to: "/exercicios", title: "Exercícios", text: "Problemas aleatórios com correção imediata." },
  { to: "/fracoes", title: "Frações", text: "Operar e simplificar com todos os passos." },
  { to: "/geometria", title: "Geometria", text: "Áreas, perímetros e Pitágoras." },
  { to: "/trigonometria", title: "Trigonometria", text: "Razões, leis dos senos e cossenos." },
] as const;

function Index() {
  return (
    <SiteLayout>
      <section className="rounded-3xl border border-border bg-card/60 p-6 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          Versão 1.0 · Matemática para todas as idades
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Matemática resolvida
          <br />
          <span className="text-primary">passo a passo.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Da tabuada à trigonometria: 13 ferramentas de cálculo que mostram a fórmula usada e cada
          passo da resolução, mais um formulário completo para consultar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/calculadora"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Abrir calculadora
          </Link>
          <Link
            to="/exercicios"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Praticar exercícios
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            className="group rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/60"
          >
            <h2 className="font-display font-semibold group-hover:text-primary">{h.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6">
        <h2 className="font-display text-lg font-semibold">Todos os temas</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics
            .filter((t) => t.to !== "/")
            .map((t) => (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  {t.label}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
