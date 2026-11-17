import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/hooks/useSession";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — MathSolver" },
      {
        name: "description",
        content:
          "Cria conta ou inicia sessão no MathSolver para guardares o teu progresso nos exercícios de matemática.",
      },
      { property: "og:title", content: "Entrar — MathSolver" },
      {
        property: "og:description",
        content: "Cria conta ou inicia sessão no MathSolver para guardares o teu progresso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) void navigate({ to: "/", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if (mode === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else if (!data.session) setMessage("Confirma o teu email para ativares a conta.");
    }
    setBusy(false);
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Não foi possível iniciar sessão com a Google.");
      return;
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md">
        <PageHeader
          title={mode === "entrar" ? "Iniciar sessão" : "Criar conta"}
          subtitle="A conta é opcional: as ferramentas de cálculo continuam livres para toda a gente."
        />
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "entrar" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {mode === "entrar" ? "Entrar" : "Criar conta"}
          </button>
          <button
            type="button"
            onClick={onGoogle}
            className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Continuar com Google
          </button>
          <p className="text-center text-xs text-muted-foreground">
            {mode === "entrar" ? "Ainda não tens conta?" : "Já tens conta?"}{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}
            >
              {mode === "entrar" ? "Criar conta" : "Iniciar sessão"}
            </button>
          </p>
        </form>
      </div>
    </SiteLayout>
  );
}
