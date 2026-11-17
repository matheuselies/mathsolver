import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { formulaTopics } from "@/lib/math/formulas";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/formulas")({
  head: () => ({
    meta: [
      { title: "Formulário de matemática — MathSolver" },
      {
        name: "description",
        content:
          "Consulta rápida de todas as fórmulas essenciais: operações, potências, frações, álgebra, geometria e trigonometria.",
      },
      { property: "og:title", content: "Formulário de matemática — MathSolver" },
      { property: "og:description", content: "Todas as fórmulas essenciais num só lugar, com pesquisa." },
      { property: "og:url", content: "/formulas" },
    ],
    links: [{ rel: "canonical", href: "/formulas" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Formulário de matemática",
          about: formulaTopics.map((t) => t.title),
        }),
      },
    ],
  }),
  component: Formulas,
});

function Formulas() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return formulaTopics;
    return formulaTopics
      .map((t) => ({
        ...t,
        entries: t.entries.filter(
          (e) =>
            e.name.toLowerCase().includes(term) ||
            e.expr.toLowerCase().includes(term) ||
            (e.note ?? "").toLowerCase().includes(term) ||
            t.title.toLowerCase().includes(term),
        ),
      }))
      .filter((t) => t.entries.length > 0);
  }, [q]);

  return (
    <SiteLayout>
      <PageHeader
        title="Formulário"
        subtitle="Todas as fórmulas organizadas por tema e pesquisáveis."
      />

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pesquisar fórmula, tema ou símbolo…"
        className="mb-8 max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma fórmula encontrada para “{q}”.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((topic) => (
            <section
              key={topic.id}
              className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">{topic.title}</h2>
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {topic.years}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {topic.entries.map((e) => (
                  <li key={e.name + e.expr} className="rounded-lg border border-border/70 bg-background/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{e.name}</p>
                    <p className="font-mono text-base text-primary">{e.expr}</p>
                    {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </SiteLayout>
  );
}
