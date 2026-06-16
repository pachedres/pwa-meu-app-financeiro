import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Plus, List, BarChart2, User } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-fundo max-w-md mx-auto relative">
      <main className="flex-1 overflow-y-auto overscroll-y-none pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-border-light z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <TabItem to="/" icon={<Home size={21} />} label="Início" end />
          <TabItem to="/extrato" icon={<List size={21} />} label="Extrato" />
          <button
            onClick={() => navigate("/lancamentos")}
            className="flex flex-col items-center justify-center w-14 h-14 -mt-5 rounded-full bg-gradient-to-br from-emerald-600 to-primary shadow-xl text-white"
          >
            <Plus size={26} />
          </button>
          <TabItem to="/relatorios" icon={<BarChart2 size={21} />} label="Relatórios" />
          <TabItem to="/perfil" icon={<User size={21} />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function TabItem({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
          isActive ? "text-primary bg-primary-light" : "text-text-soft"
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </NavLink>
  );
}
