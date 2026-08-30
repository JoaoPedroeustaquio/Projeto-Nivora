import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Informe seu email.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    if (
      mode === "signup" &&
      password.length < 6
    ) {
      setError(
        "A senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    if (
      mode === "signup" &&
      password !== confirmPassword
    ) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (loginError) {
          throw loginError;
        }

        navigate("/");
        return;
      }

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

      if (signupError) {
        throw signupError;
      }

      if (data.session) {
        navigate("/");
        return;
      }

      setMessage(
        "Conta criada com sucesso. Verifique seu email para confirmar a conta antes de entrar.",
      );

      setMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Não foi possível concluir a operação.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-(--card-border) bg-(--card) p-6 shadow-2xl sm:p-8">
          {/* Logo e identidade */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <img
                src="/logo_nivora_N.svg"
                alt="NIVORA"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-(--foreground)">
              NIVORA
            </h1>

            <p className="mt-2 text-sm font-medium text-(--primary)">
              Clareza para o seu dinheiro.
            </p>

            <p className="mt-1 text-sm text-(--muted)">
              {mode === "login"
                ? "Entre na sua conta para continuar."
                : "Crie sua conta para começar a organizar suas finanças."}
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Mensagem de sucesso */}
          {message && (
            <div className="mb-4 rounded-xl border border-green-900/50 bg-green-950/40 px-4 py-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-(--foreground)"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  placeholder:text-(--muted)
                  focus:border-(--primary)
                  focus:ring-(--primary)
                "
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-(--foreground)"
              >
                Senha
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Digite sua senha"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="
                    border-(--card-border)
                    bg-(--background)
                    pr-10
                    text-(--foreground)
                    placeholder:text-(--muted)
                    focus:border-(--primary)
                    focus:ring-(--primary)
                  "
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous,
                    )
                  }
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-(--muted)
                    transition-colors
                    hover:text-(--foreground)
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar senha */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-(--foreground)"
                >
                  Confirmar senha
                </Label>

                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    className="
                      border-(--card-border)
                      bg-(--background)
                      pr-10
                      text-(--foreground)
                      placeholder:text-(--muted)
                      focus:border-(--primary)
                      focus:ring-(--primary)
                    "
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação da senha"
                        : "Mostrar confirmação da senha"
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous,
                      )
                    }
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      text-(--muted)
                      transition-colors
                      hover:text-(--foreground)
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Botão principal */}
            <Button
              type="submit"
              className="
                w-full
                bg-(--primary)
                text-white
                hover:bg-(--primary-hover)
              "
              disabled={loading}
            >
              {loading
                ? "Aguarde..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar conta"}
            </Button>
          </form>

          {/* Troca entre login e cadastro */}
          <div className="mt-6 text-center text-sm text-(--muted)">
            {mode === "login" ? (
              <>
                Ainda não possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() =>
                    changeMode("signup")
                  }
                  className="
                    font-medium
                    text-(--primary)
                    hover:underline
                  "
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() =>
                    changeMode("login")
                  }
                  className="
                    font-medium
                    text-(--primary)
                    hover:underline
                  "
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}