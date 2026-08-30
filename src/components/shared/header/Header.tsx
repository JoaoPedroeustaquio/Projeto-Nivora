import { Link, NavLink, useNavigate } from "react-router-dom";

import TransactionDialog from "@/features/transactions/compontes/TransactionDialog";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  }

  const initials =
    user?.email?.slice(0, 2).toUpperCase() ?? "US";

  return (
    <header className="sticky top-0 z-50 border-b border-(--card-border) bg-(--card)/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Ir para o Dashboard da NIVORA"
        >
          {/* Símbolo NIVORA */}
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              overflow-hidden
              rounded-xl
            "
          >
            <img
              src="./public/Logo_nivora_N.svg"
              alt="NIVORA"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Nome da marca */}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-(--foreground)">
              NIVORA
            </h1>

            <p className="hidden text-xs font-medium text-(--muted) sm:block">
              Clareza para o seu dinheiro.
            </p>
          </div>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-(--primary)/15 text-(--primary)"
                  : "text-(--muted) hover:bg-white/5 hover:text-(--foreground)"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/lancamentos"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-(--primary)/15 text-(--primary)"
                  : "text-(--muted) hover:bg-white/5 hover:text-(--foreground)"
              }`
            }
          >
            Lançamentos
          </NavLink>
        </nav>

        {/* Ações desktop */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:block">
            <TransactionDialog />
          </div>

          {/* Perfil */}
          <div className="group relative">
            <button
              type="button"
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-(--primary)
                text-sm font-semibold
                text-white
                transition-all
                hover:scale-105
                hover:opacity-90
              "
              title={user?.email ?? "Usuário"}
              aria-label="Abrir menu do usuário"
            >
              {initials}
            </button>

            {/* Menu do usuário */}
            <div
              className="
                invisible absolute right-0 top-full mt-2
                w-56
                rounded-xl
                border border-(--card-border)
                bg-(--card)
                p-2
                opacity-0
                shadow-2xl
                transition-all
                group-hover:visible
                group-hover:opacity-100
              "
            >
              {user?.email && (
                <div className="mb-1 border-b border-(--card-border) px-3 py-2">
                  <p className="truncate text-xs text-(--muted)">
                    {user.email}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="
                  w-full rounded-lg
                  px-3 py-2
                  text-left
                  text-sm font-medium
                  text-red-400
                  transition-colors
                  hover:bg-red-500/10
                  hover:text-red-300
                "
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação mobile */}
      <div className="border-t border-(--card-border) px-4 py-2 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-(--primary)/15 text-(--primary)"
                    : "text-(--muted) hover:bg-white/5 hover:text-(--foreground)"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/lancamentos"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-(--primary)/15 text-(--primary)"
                    : "text-(--muted) hover:bg-white/5 hover:text-(--foreground)"
                }`
              }
            >
              Lançamentos
            </NavLink>
          </nav>

          <TransactionDialog />
        </div>
      </div>
    </header>
  );
}