import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

function AuthAffordance() {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  if (loading) return <span className="hidden text-xs text-muted-foreground sm:block">…</span>;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:block">
        {user.email}
      </span>
      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          await navigate({ to: "/auth", replace: true });
        }}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        Sair
      </button>
    </div>
  );
}


export const topics = [
  { to: "/", label: "Início" },
  { to: "/tabuada", label: "Tabuada" },
  { to: "/calculadora", label: "Calculadora" },
  { to: "/fases", label: "Fases (jogo)" },
  { to: "/treinamento", label: "Treinamento" },
  { to: "/exercicios", label: "Exercícios" },
  { to: "/potencias", label: "Potências e raízes" },
  { to: "/percentagem", label: "Percentagem" },
  { to: "/fracoes", label: "Frações" },
  { to: "/mdc-mmc", label: "MDC e MMC" },
  { to: "/inteiros", label: "Números inteiros" },
  { to: "/algebra", label: "Álgebra" },
  { to: "/geometria", label: "Geometria plana" },
  { to: "/geometria-espacial", label: "Geometria espacial" },
  { to: "/trigonometria", label: "Trigonometria" },
  { to: "/formulas", label: "Formulário" },
] as const;

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground grid-paper">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-mono text-lg font-bold text-primary-foreground">
              ∑
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">MathSolver</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              v1.0
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <AuthAffordance />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menu"
              className="rounded-md border border-border p-2 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>
        {open && (
          <nav className="border-t border-border/70 px-4 pb-4 lg:hidden">
            <ul className="grid grid-cols-2 gap-1 pt-3">
              {topics.map((t) => (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm",
                      pathname === t.to
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Temas
            </p>
            <ul className="space-y-0.5">
              {topics.map((t) => (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors",
                      pathname === t.to
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main key={pathname} className="page-transition min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          MathSolver — matemática para todas as idades, resolvida passo a passo.
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
