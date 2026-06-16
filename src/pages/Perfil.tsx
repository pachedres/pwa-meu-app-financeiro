import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Perfil() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  const email = session?.user?.email ?? "";
  const nomeMetadata = session?.user?.user_metadata?.name as string | undefined;
  const nomeExibido = nomeMetadata ?? email.split("@")[0] ?? "Usuário";
  const iniciais = nomeExibido.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

  function confirmarSaida() {
    if (confirm("Deseja sair da conta?")) supabase.auth.signOut();
  }

  return (
    <div className="bg-fundo min-h-full">
      <div className="bg-gradient-to-br from-[#065f46] to-[#10B981] flex flex-col items-center pt-12 pb-10 gap-1.5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-black/10" />
        <div className="relative flex flex-col items-center gap-1.5">
          <div className="w-[72px] h-[72px] rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center mb-1">
            <span className="text-white text-3xl font-bold">{iniciais}</span>
          </div>
          <p className="text-white text-xl font-bold">{nomeExibido}</p>
          <p className="text-white/75 text-sm">{email}</p>
        </div>
      </div>

      <div className="mt-5 mx-4">
        <p className="text-[11px] font-bold text-text-soft uppercase tracking-widest mb-2 ml-1">Conta</p>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-light">
          <ItemInfo label="E-mail" valor={email} />
        </div>
      </div>

      <div className="mt-5 mx-4">
        <p className="text-[11px] font-bold text-text-soft uppercase tracking-widest mb-2 ml-1">Sobre</p>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-light">
          <ItemInfo label="Versão" valor="1.0.0" />
        </div>
      </div>

      <div className="mt-5 mx-4 pb-8">
        <button
          onClick={confirmarSaida}
          className="w-full bg-danger-light border border-danger-border text-danger font-semibold py-4 rounded-xl shadow-sm text-base"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function ItemInfo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3.5">
      <span className="text-sm text-text-main">{label}</span>
      <span className="text-sm text-text-soft">{valor}</span>
    </div>
  );
}
