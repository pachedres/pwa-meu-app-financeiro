import { useState, useEffect } from "react";
import { Inbox, Package } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { buscarTotaisPorMes, buscarLancamentosPorMes } from "@/lib/db";
import { CATEGORIAS } from "@/constants/categorias";
import CardsResumo from "@/components/CardsResumo";
import BarraProgresso from "@/components/BarraProgresso";

dayjs.locale("pt-br");

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
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

  return (
    <div className="bg-fundo min-h-full">
      <div className="bg-primary px-4 pt-10 pb-10 flex justify-between items-center">
        <div>
          <p className="text-white/85 text-sm mb-0.5">{saudacao()} 👋</p>
          <p className="text-white text-xl font-bold capitalize">{mesAtual}</p>
        </div>
      </div>

      <div className="-mt-4">
        <CardsResumo receitas={totais.receitas} despesas={totais.despesas} saldo={totais.saldo} />
      </div>

      {carregando ? (
        <div className="flex flex-col items-center pt-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-soft">Carregando...</p>
        </div>
      ) : (
        <>
          {totais.receitas > 0 && (
            <div className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm border border-border-light">
              <BarraProgresso
                progresso={totais.despesas / totais.receitas}
                cor={totais.despesas > totais.receitas ? "#EF4444" : "#22C55E"}
                rotulo="Comprometimento da receita"
              />
            </div>
          )}

          <div className="flex items-center gap-2.5 mx-4 mb-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-bold text-text-soft uppercase tracking-widest whitespace-nowrap">
              Lançamentos do mês
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {lancamentos.length === 0 ? (
            <div className="flex flex-col items-center pt-10 gap-2">
              <Inbox size={48} color="#bbb" />
              <p className="text-sm text-text-soft font-medium">Nenhum lançamento neste mês.</p>
              <p className="text-xs text-text-faint">Use o botão + para adicionar um lançamento.</p>
            </div>
          ) : (
            <div className="px-4 flex flex-col gap-2 pb-6">
              {lancamentos.slice(0, 10).map((item) => {
                const cat = CATEGORIAS.find((c) => c.value === item.categoria);
                const Icon = cat?.icone ?? Package;
                const cor = cat?.cor ?? "#9CA3AF";
                return (
                  <div key={item.id} className="bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm border border-border-light">
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
                    <span className={`text-sm font-bold ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                      {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
