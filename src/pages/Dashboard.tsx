import { useState, useEffect } from "react";
import { Inbox, Package, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useNavigate } from "react-router-dom";
import { buscarTotaisPorMes, buscarLancamentosPorMes } from "@/lib/db";
import { CATEGORIAS } from "@/constants/categorias";
import BarraProgresso from "@/components/BarraProgresso";

dayjs.locale("pt-br");

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function fmtValor(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  if (abs >= 10_000)    return `${(abs / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`;
  return abs.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      const m = dayjs().format("MM");
      const a = dayjs().format("YYYY");
      const [t, l] = await Promise.all([buscarTotaisPorMes(m, a), buscarLancamentosPorMes(m, a)]);
      setTotais(t);
      setLancamentos(l);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  const mesAtual = dayjs().format("MMMM [de] YYYY");
  const positivo = totais.saldo >= 0;

  return (
    <div className="bg-fundo min-h-full">
      <div className="bg-gradient-to-br from-[#065f46] to-[#10B981] px-5 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-20 -right-2 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-black/10 pointer-events-none" />

        <div className="relative">
          <p className="text-white/80 text-sm">{saudacao()} 👋</p>
          <p className="text-white/50 text-xs capitalize mt-0.5">{mesAtual}</p>

          <div className="mt-5 mb-5">
            <p className="text-white/60 text-[11px] uppercase tracking-widest mb-1">Saldo do mês</p>
            {carregando ? (
              <div className="h-10 w-48 bg-white/20 rounded-xl animate-pulse" />
            ) : (
              <p className={`text-4xl font-bold ${positivo ? "text-white" : "text-red-200"}`}>
                {!positivo && "−"}
                <span className="text-xl font-semibold mr-1">R$</span>
                {fmtValor(totais.saldo)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">Receitas</p>
              {carregando
                ? <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                : <p className="text-white/90 text-sm font-bold">+R$ {fmtValor(totais.receitas)}</p>
              }
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">Despesas</p>
              {carregando
                ? <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                : <p className="text-white/90 text-sm font-bold">-R$ {fmtValor(totais.despesas)}</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-10 flex flex-col gap-3 pb-6">
        {!carregando && totais.receitas > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border-light">
            <BarraProgresso
              progresso={totais.despesas / totais.receitas}
              cor={totais.despesas > totais.receitas ? "#EF4444" : "#22C55E"}
              rotulo="Comprometimento da receita"
            />
          </div>
        )}

        <div className="flex items-center gap-2.5 mt-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-bold text-text-soft uppercase tracking-widest whitespace-nowrap">
            Lançamentos do mês
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {carregando ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 h-16 animate-pulse border border-border-light" />
            ))}
          </div>
        ) : lancamentos.length === 0 ? (
          <div className="flex flex-col items-center pt-8 gap-2">
            <Inbox size={48} color="#bbb" />
            <p className="text-sm text-text-soft font-medium">Nenhum lançamento neste mês.</p>
            <p className="text-xs text-text-faint">Use o botão + para adicionar um lançamento.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {lancamentos.slice(0, 10).map((item) => {
                const cat = CATEGORIAS.find((c) => c.value === item.categoria);
                const Icon = cat?.icone ?? Package;
                const cor = cat?.cor ?? "#9CA3AF";
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm border border-border-light border-l-4"
                    style={{ borderLeftColor: item.tipo === "receita" ? "#22C55E" : "#EF4444" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cor + "22" }}>
                        <Icon size={18} color={cor} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main">{item.descricao}</p>
                        <p className="text-xs text-text-soft mt-0.5">
                          {cat?.label ?? item.categoria} · {dayjs(item.data).format("DD/MM")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ml-2 ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                      {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/extrato")}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-white text-sm text-text-soft font-medium shadow-sm"
            >
              Ver todos no Extrato <ArrowRight size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
