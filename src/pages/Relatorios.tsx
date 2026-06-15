import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Package } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { buscarTotaisPorMes, buscarTotaisPorCategoria } from "@/lib/db";
import { CATEGORIAS } from "@/constants/categorias";
import { FORMAS_PAGAMENTO, BANCOS } from "@/constants/pagamentos";
import CardsResumo from "@/components/CardsResumo";

dayjs.locale("pt-br");

const CORES_GRAFICO = ["#10B981","#EF4444","#22C55E","#FF9800","#2196F3","#E91E63","#009688","#FF5722","#9C27B0","#607D8B"];

export default function Relatorios() {
  const [mes, setMes] = useState(dayjs());
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [porCategoria, setPorCategoria] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<"despesas" | "receitas">("despesas");
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  useEffect(() => { carregarDados(); }, [mes]);

  async function carregarDados() {
    try {
      setCarregando(true);
      const m = mes.format("MM");
      const a = mes.format("YYYY");
      const [t, c] = await Promise.all([buscarTotaisPorMes(m, a), buscarTotaisPorCategoria(m, a)]);
      setTotais(t);
      setPorCategoria(c);
      setExpandidos(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  function toggleExpandir(chave: string) {
    setExpandidos((prev) => {
      const n = new Set(prev);
      n.has(chave) ? n.delete(chave) : n.add(chave);
      return n;
    });
  }

  const dadosFiltrados = porCategoria.filter((i) => aba === "despesas" ? i.tipo === "despesa" : i.tipo === "receita");

  const dadosPizza = dadosFiltrados.map((item, index) => {
    const cat = CATEGORIAS.find((c) => c.value === item.categoria);
    return { name: cat?.label ?? item.categoria, value: item.total, color: CORES_GRAFICO[index % CORES_GRAFICO.length] };
  });

  const totalAba = aba === "despesas" ? totais.despesas : totais.receitas;

  return (
    <div className="bg-fundo min-h-full">
      <div className="bg-primary px-4 pt-10 pb-10 flex justify-between items-center">
        <button onClick={() => setMes(mes.subtract(1, "month"))} className="p-2">
          <ChevronLeft size={26} color="#fff" />
        </button>
        <p className="text-white text-lg font-bold capitalize">{mes.format("MMMM [de] YYYY")}</p>
        <button onClick={() => setMes(mes.add(1, "month"))} className="p-2">
          <ChevronRight size={26} color="#fff" />
        </button>
      </div>

      <div className="-mt-4">
        <CardsResumo receitas={totais.receitas} despesas={totais.despesas} />
      </div>

      {carregando ? (
        <div className="flex flex-col items-center pt-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-soft">Carregando...</p>
        </div>
      ) : (
        <>
          <div className="flex mx-4 mb-3 bg-white rounded-xl p-1 shadow-sm border border-border-light">
            {(["despesas", "receitas"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAba(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  aba === t ? "bg-primary text-white" : "text-text-soft"
                }`}
              >
                {t === "despesas" ? "Despesas" : "Receitas"}
              </button>
            ))}
          </div>

          {dadosFiltrados.length === 0 ? (
            <p className="text-center text-text-soft text-sm mt-10">Nenhum dado para este período.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl mx-4 mb-3 p-4 shadow-sm border border-border-light">
                <p className="text-sm font-bold text-text-main mb-3">Por Categoria</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={dadosPizza} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                      {dadosPizza.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-2">
                  {dadosPizza.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="flex-1 text-xs text-text-secondary">{item.name}</span>
                      <span className="text-xs font-semibold text-text-main">R$ {item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl mx-4 mb-6 p-4 shadow-sm border border-border-light">
                <p className="text-sm font-bold text-text-main mb-3">Detalhamento</p>
                {dadosFiltrados.map((item, index) => {
                  const cat = CATEGORIAS.find((c) => c.value === item.categoria);
                  const RIcon = cat?.icone ?? Package;
                  const rCor = cat?.cor ?? "#9CA3AF";
                  const percentual = totalAba > 0 ? (item.total / totalAba) * 100 : 0;
                  const chave = `${item.categoria}_${item.tipo}`;
                  const expandido = expandidos.has(chave);

                  return (
                    <div key={index} className="border-b border-border-light last:border-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandir(chave)}
                        className="w-full flex items-center gap-2 py-2.5 text-left"
                      >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CORES_GRAFICO[index % CORES_GRAFICO.length] }} />
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: rCor + "22" }}>
                          <RIcon size={15} color={rCor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-main">{cat?.label ?? item.categoria}</p>
                          <p className="text-xs text-text-soft">
                            {percentual.toFixed(1)}% · {item.items.length} lançamento{item.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className={`text-sm font-bold shrink-0 ${aba === "receitas" ? "text-success" : "text-danger"}`}>
                          R$ {item.total.toFixed(2)}
                        </span>
                        {expandido
                          ? <ChevronUp size={15} className="text-text-soft shrink-0" />
                          : <ChevronDown size={15} className="text-text-soft shrink-0" />
                        }
                      </button>

                      {expandido && (
                        <div className="flex flex-col gap-1.5 pb-2.5">
                          {item.items
                            .slice()
                            .sort((a: any, b: any) => dayjs(b.data).unix() - dayjs(a.data).unix())
                            .map((t: any) => {
                              const fp = FORMAS_PAGAMENTO.find((f) => f.value === t.forma_pagamento);
                              const banco = BANCOS.find((b) => b.value === t.banco);
                              return (
                                <div key={t.id} className="ml-11 bg-fundo rounded-lg px-3 py-2.5">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-semibold text-text-main flex-1">{t.descricao}</p>
                                    <span className={`text-sm font-bold shrink-0 ${aba === "receitas" ? "text-success" : "text-danger"}`}>
                                      R$ {Number(t.valor).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <span className="text-xs text-text-soft">{dayjs(t.data).format("DD/MM/YYYY")}</span>
                                    {fp && (
                                      <span className="flex items-center gap-1 text-xs text-text-soft">
                                        <fp.icone size={11} color={fp.cor} />
                                        {fp.label}
                                      </span>
                                    )}
                                    {banco && (
                                      <span className="flex items-center gap-1 text-xs text-text-soft">
                                        <banco.icone size={11} color={banco.cor} />
                                        {banco.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
