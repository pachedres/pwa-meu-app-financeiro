import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!email || !senha) { setErro("Preencha e-mail e senha!"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) { setErro("E-mail ou senha incorretos."); }
    else { navigate("/"); }
  }

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); setAviso("");
    if (!email || !senha) { setErro("Preencha e-mail e senha!"); return; }
    if (senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: senha });
    setLoading(false);
    if (error) { setErro(error.message); }
    else { setAviso("Conta criada! Verifique seu e-mail para confirmar o cadastro."); setModo("login"); }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center px-6">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center mb-4">
          <TrendingUp size={40} color="#fff" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Financeiro</h1>
        <p className="text-sm text-white/70 mt-1.5">Controle suas finanças com facilidade</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-text-main text-center mb-5">
          {modo === "login" ? "Entrar na conta" : "Criar nova conta"}
        </h2>

        <form onSubmit={modo === "login" ? entrar : cadastrar}>
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-border rounded-lg px-3.5 py-3.5 text-sm text-text-main bg-fundo focus:outline-none focus:border-primary"
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border-2 border-border rounded-lg px-3.5 py-3.5 text-sm text-text-main bg-fundo focus:outline-none focus:border-primary"
              autoComplete={modo === "login" ? "current-password" : "new-password"}
            />
          </div>

          {erro && <p className="text-danger text-sm mb-3 text-center">{erro}</p>}
          {aviso && <p className="text-success text-sm mb-3 text-center">{aviso}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg disabled:opacity-60 transition-opacity"
          >
            {loading ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-5">
          <div className="flex-1 h-px bg-border-light" />
          <span className="text-xs text-text-faint">ou</span>
          <div className="flex-1 h-px bg-border-light" />
        </div>

        <button
          onClick={() => { setErro(""); setModo(modo === "login" ? "cadastro" : "login"); }}
          className="w-full text-primary text-sm font-semibold py-1"
        >
          {modo === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
