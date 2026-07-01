import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Mail, Calendar, Info, LogOut, Shield, User, ChevronRight, X, Eye, EyeOff } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function Perfil() {
  const [session, setSession] = useState<Session | null>(null);
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [erroNome, setErroNome] = useState("");

  const [editandoSenha, setEditandoSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  const email = session?.user?.email ?? "";
  const nomeMetadata = session?.user?.user_metadata?.name as string | undefined;
  const nomeExibido = nomeMetadata ?? email.split("@")[0] ?? "Usuário";
  const iniciais = nomeExibido.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  const membroDesde = session?.user?.created_at
    ? dayjs(session.user.created_at).format("MMMM [de] YYYY")
    : "";

  function abrirEditarNome() {
    setNovoNome(nomeExibido);
    setErroNome("");
    setEditandoNome(true);
  }

  async function salvarNome() {
    if (!novoNome.trim()) { setErroNome("Informe um nome."); return; }
    setSalvandoNome(true);
    setErroNome("");
    try {
      const { error } = await supabase.auth.updateUser({ data: { name: novoNome.trim() } });
      if (error) throw error;
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setEditandoNome(false);
    } catch {
      setErroNome("Não foi possível atualizar o nome.");
    } finally {
      setSalvandoNome(false);
    }
  }

  function abrirEditarSenha() {
    setNovaSenha("");
    setConfirmarSenha("");
    setErroSenha("");
    setMostrarSenha(false);
    setEditandoSenha(true);
  }

  async function salvarSenha() {
    if (novaSenha.length < 6) { setErroSenha("A senha deve ter ao menos 6 caracteres."); return; }
    if (novaSenha !== confirmarSenha) { setErroSenha("As senhas não coincidem."); return; }
    setSalvandoSenha(true);
    setErroSenha("");
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      setEditandoSenha(false);
    } catch {
      setErroSenha("Não foi possível alterar a senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  function confirmarSaida() {
    if (confirm("Deseja sair da conta?")) supabase.auth.signOut();
  }

  return (
    <div className="bg-fundo min-h-full">
      <div className="bg-gradient-to-br from-[#065f46] to-[#10B981] px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-20 -right-2 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-black/10 pointer-events-none" />
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-bold">{iniciais}</span>
          </div>
          <p className="text-white text-xl font-bold mt-1">{nomeExibido}</p>
          <p className="text-white/70 text-sm">{email}</p>
          {membroDesde && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={12} color="rgba(255,255,255,0.5)" />
              <p className="text-white/50 text-xs capitalize">Membro desde {membroDesde}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 pb-8 flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-bold text-text-soft uppercase tracking-widest mb-2 ml-1">Conta</p>
          <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
            <MenuItemInfo icon={<Mail size={17} color="#10B981" />} iconBg="bg-emerald-50" label="E-mail" valor={email} />
            {membroDesde && (
              <MenuItemInfo icon={<Calendar size={17} color="#8B5CF6" />} iconBg="bg-purple-50" label="Membro desde" valor={membroDesde} capitalize />
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-text-soft uppercase tracking-widest mb-2 ml-1">Editar Perfil</p>
          <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
            <MenuItemButton icon={<User size={17} color="#10B981" />} iconBg="bg-emerald-50" label="Nome de usuário" onClick={abrirEditarNome} />
            <MenuItemButton icon={<Shield size={17} color="#F59E0B" />} iconBg="bg-amber-50" label="Alterar senha" onClick={abrirEditarSenha} />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-text-soft uppercase tracking-widest mb-2 ml-1">Sobre o App</p>
          <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
            <MenuItemInfo icon={<Info size={17} color="#3B82F6" />} iconBg="bg-blue-50" label="Versão" valor="1.0.0" />
          </div>
        </div>

        <button
          onClick={confirmarSaida}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-danger font-semibold py-4 rounded-2xl shadow-sm mt-2"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>

      {/* Modal: Editar nome */}
      {editandoNome && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setEditandoNome(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-2xl z-10 px-4 pt-5 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-text-main">Nome de usuário</h3>
              <button onClick={() => setEditandoNome(false)}><X size={20} className="text-text-soft" /></button>
            </div>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary mb-2"
              placeholder="Seu nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              autoFocus
            />
            {erroNome && <p className="text-danger text-xs mb-3">{erroNome}</p>}
            <button
              onClick={salvarNome}
              disabled={salvandoNome}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-2 disabled:opacity-60"
            >
              {salvandoNome ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Alterar senha */}
      {editandoSenha && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setEditandoSenha(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-2xl z-10 px-4 pt-5 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-text-main">Alterar senha</h3>
              <button onClick={() => setEditandoSenha(false)}><X size={20} className="text-text-soft" /></button>
            </div>
            <div className="relative mb-3">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text-main focus:outline-none focus:border-primary"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft p-1"
              >
                {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <input
              type={mostrarSenha ? "text" : "password"}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary mb-2"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            {erroSenha && <p className="text-danger text-xs mb-3">{erroSenha}</p>}
            <button
              onClick={salvarSenha}
              disabled={salvandoSenha}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-2 disabled:opacity-60"
            >
              {salvandoSenha ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItemInfo({ icon, iconBg, label, valor, capitalize }: { icon: React.ReactNode; iconBg: string; label: string; valor: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-light last:border-0">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="flex-1 text-sm text-text-main font-medium">{label}</span>
      <span className={`text-sm text-text-soft truncate max-w-[55%] text-right ${capitalize ? "capitalize" : ""}`}>{valor}</span>
    </div>
  );
}

function MenuItemButton({ icon, iconBg, label, onClick }: { icon: React.ReactNode; iconBg: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border-light last:border-0 text-left">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="flex-1 text-sm text-text-main font-medium">{label}</span>
      <ChevronRight size={16} className="text-text-faint" />
    </button>
  );
}
