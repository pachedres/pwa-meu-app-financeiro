import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, X, Package, Pencil } from "lucide-react";
import EditarLancamentoModal from "@/components/EditarLancamentoModal";
import dayjs from "dayjs";
import { CATEGORIAS } from "@/constants/categorias";
import { useLancamentos } from "@/hooks/useLancamentos";
import { agruparParcelas } from "@/utils/agruparParcelas";

type FiltroTipo = "todos" | "receita" | "despesa";

export default function Extrato() {
  const { lancamentos, carregando, recarregar } = useLancamentos();
  const [editando, setEditando] = useState<any>(null);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [rascTipo, setRascTipo] = useState<FiltroTipo>("todos");
  const [rascCategoria, setRascCategoria] = useState("");
  const [rascDataInicio, setRascDataInicio] = useState("");
  const [rascDataFim, setRascDataFim] = useState("");

  const agrupados = agruparParcelas(lancamentos);
  const filtrosAtivos = filtroTipo !== "todos" || filtroCategoria || filtroDataInicio || filtroDataFim || busca;

  function toggleExpandir(chave: string) {
    setExpandidos((prev) => { const n = new Set(prev); n.has(chave) ? n.delete(chave) : n.add(chave); return n; });
  }

  function abrirFiltro() {
    setRascTipo(filtroTipo); setRascCategoria(filtroCategoria);
    setRascDataInicio(filtroDataInicio); setRascDataFim(filtroDataFim);
    setFiltroAberto(true);
  }

  function aplicarFiltros() {
    setFiltroTipo(rascTipo); setFiltroCategoria(rascCategoria);
    setFiltroDataInicio(rascDataInicio); setFiltroDataFim(rascDataFim);
    setFiltroAberto(false);
  }

  function limparFiltros() {
    setRascTipo("todos"); setRascCategoria(""); setRascDataInicio(""); setRascDataFim("");
  }

  const exibidos = agrupados.filter((item: any) => {
    const descricao = item.avulso ? item.descricao : item.descricaoBase;
    const dataItem = item.avulso ? dayjs(item.data) : dayjs(item.parcelas[0]?.data);
    if (filtroTipo !== "todos" && item.tipo !== filtroTipo) return false;
    if (filtroCategoria && item.categoria !== filtroCategoria) return false;
    if (busca && !descricao.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroDataInicio && dataItem.isBefore(dayjs(filtroDataInicio), "day")) return false;
    if (filtroDataFim && dataItem.isAfter(dayjs(filtroDataFim), "day")) return false;
    return true;
  });

  return (
    <div className="bg-fundo min-h-full">
      <EditarLancamentoModal lancamento={editando} onClose={() => setEditando(null)} onSalvo={recarregar} />

      <div className="bg-gradient-to-br from-[#065f46] to-[#10B981] px-5 pt-10 pb-10 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />
        <div className="relative">
          <p className="text-white text-xl font-bold">Extrato</p>
          <p className="text-white/60 text-sm capitalize mt-0.5">{dayjs().format("MMMM [de] YYYY")}</p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 mb-1">
        <div className="flex gap-2.5">
          <input
            className="flex-1 bg-white border-2 border-border rounded-xl px-3.5 py-3 text-sm text-text-main placeholder:text-text-faint focus:outline-none focus:border-primary shadow-sm"
            placeholder="🔍 Buscar lançamento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={abrirFiltro}
            className={`bg-white border-2 rounded-xl p-3 shadow-sm relative transition-colors ${
              filtrosAtivos ? "border-primary bg-primary-light" : "border-border"
            }`}
          >
            <SlidersHorizontal size={20} color={filtrosAtivos ? "#10B981" : "#888"} />
            {filtrosAtivos && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>
      </div>

      <p className="text-xs text-text-soft mx-4 mb-3 mt-3">
        {exibidos.length} lançamento{exibidos.length !== 1 ? "s" : ""}
      </p>

      {carregando ? (
        <div className="flex flex-col items-center pt-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-soft">Carregando...</p>
        </div>
      ) : exibidos.length === 0 ? (
        <p className="text-center text-text-soft text-sm mt-10">Nenhum lançamento encontrado.</p>
      ) : (
        <div className="px-4 flex flex-col gap-2 pb-6">
          {exibidos.map((item: any) => {
            const cat = CATEGORIAS.find((c) => c.value === item.categoria);
            const CatIcon = cat?.icone ?? Package;
            const catCor = cat?.cor ?? "#9CA3AF";
            const catBadge = (
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: catCor + "22" }}>
                <CatIcon size={18} color={catCor} />
              </div>
            );
            if (item.avulso) {
              return (
                <div key={item.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-border-light border-l-4" style={{ borderLeftColor: item.tipo === "receita" ? "#22C55E" : "#EF4444" }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {catBadge}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-main truncate">{item.descricao}</p>
                        <p className="text-xs text-text-soft mt-0.5">{cat?.label ?? item.categoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                          {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-text-faint mt-0.5">{dayjs(item.data).format("DD/MM/YYYY")}</p>
                      </div>
                      <button onClick={() => setEditando(item)} className="text-text-faint hover:text-primary p-1 ml-1">
                        <Pencil size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const expandido = expandidos.has(item.chave);
            const parcelasPagas = item.parcelas.filter((p: any) =>
              dayjs(p.data).isBefore(dayjs(), "month")
            ).length;
            const totalParcelado = item.parcelas.reduce((s: number, p: any) => s + Number(p.valor), 0);

            return (
              <div key={item.chave}>
                <button
                  onClick={() => toggleExpandir(item.chave)}
                  className="w-full bg-white rounded-xl px-4 py-3 shadow-sm border-l-4 border-t border-r border-b border-border-light text-left"
                  style={{ borderLeftColor: item.tipo === "receita" ? "#22C55E" : "#EF4444" }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {catBadge}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-main truncate">{item.descricaoBase}</p>
                        <p className="text-xs text-text-soft mt-0.5">{cat?.label ?? item.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <p className={`text-sm font-bold ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                        {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}/mês
                      </p>
                      <p className="text-[10px] text-text-faint mt-0.5">Total R$ {totalParcelado.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <div className="h-1.5 bg-border-light rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(parcelasPagas / item.totalParcelas) * 100}%` }} />
                    </div>
                    <div className="flex justify-end items-center gap-1">
                      <span className="text-[10px] text-text-soft">{parcelasPagas}/{item.totalParcelas} parcelas</span>
                      {expandido ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />}
                    </div>
                  </div>
                </button>
                {expandido && item.parcelas.map((parcela: any) => {
                  const isPago = dayjs(parcela.data).isBefore(dayjs(), "month");
                  return (
                    <div key={parcela.id} className={`mx-4 mb-0.5 px-3 py-2.5 rounded-lg flex justify-between items-center ${isPago ? "bg-success-light" : "bg-primary-soft"}`}>
                      <p className="text-xs text-text-secondary flex-1">{parcela.descricao}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-text-main">R$ {Number(parcela.valor).toFixed(2)}</p>
                        <p className="text-[10px] text-text-faint">{dayjs(parcela.data).format("MM/YYYY")}</p>
                        {isPago && <span className="text-[10px] text-success font-bold">✓ pago</span>}
                        <button onClick={() => setEditando(parcela)} className="text-text-faint hover:text-primary p-0.5">
                          <Pencil size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {filtroAberto && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setFiltroAberto(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-4 border-b border-border-light sticky top-0 bg-white">
              <h3 className="text-base font-bold text-text-main">Filtros</h3>
              <div className="flex items-center gap-3">
                <button onClick={limparFiltros} className="text-danger text-sm font-semibold">Limpar</button>
                <button onClick={() => setFiltroAberto(false)}><X size={20} className="text-text-soft" /></button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Tipo</p>
                <div className="flex gap-2">
                  {(["todos", "receita", "despesa"] as FiltroTipo[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRascTipo(t)}
                      className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                        rascTipo === t ? "bg-primary border-primary text-white" : "bg-fundo border-border text-text-secondary"
                      }`}
                    >
                      {t === "todos" ? "Todos" : t === "receita" ? "💰 Receitas" : "💸 Despesas"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Período</p>
                <div className="flex gap-2">
                  <input type="date" value={rascDataInicio} onChange={(e) => setRascDataInicio(e.target.value)}
                    className={`flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary ${rascDataInicio ? "border-primary bg-primary-light" : "border-border bg-fundo"}`} />
                  <input type="date" value={rascDataFim} onChange={(e) => setRascDataFim(e.target.value)}
                    className={`flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary ${rascDataFim ? "border-primary bg-primary-light" : "border-border bg-fundo"}`} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Categoria</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRascCategoria("")}
                    className={`px-3.5 py-1.5 rounded-full border text-sm font-semibold ${rascCategoria === "" ? "bg-primary border-primary text-white" : "bg-fundo border-border text-text-secondary"}`}
                  >Todas</button>
                  {CATEGORIAS.map((cat) => {
                    const FilterIcon = cat.icone;
                    const isSelected = rascCategoria === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setRascCategoria(cat.value)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-semibold ${isSelected ? "bg-primary border-primary text-white" : "bg-fundo border-border text-text-secondary"}`}
                      >
                        <FilterIcon size={13} color={isSelected ? "#fff" : cat.cor} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={aplicarFiltros} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-2">
                Aplicar Filtros
              </button>
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
