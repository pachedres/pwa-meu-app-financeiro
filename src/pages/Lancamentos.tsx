import { useState } from "react";
import dayjs from "dayjs";
import { Trash2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { adicionarLancamento, adicionarLancamentoParcelado, deletarLancamento } from "@/lib/db";
import { CATEGORIAS, type Categoria } from "@/constants/categorias";
import { FORMAS_PAGAMENTO, BANCOS } from "@/constants/pagamentos";
import { useLancamentos } from "@/hooks/useLancamentos";
import { agruparParcelas } from "@/utils/agruparParcelas";
import IconDropdown from "@/components/IconDropdown";

function CatIcone({ cat, size = 18 }: { cat?: Categoria; size?: number }) {
  const Icon = cat?.icone ?? Package;
  const cor = cat?.cor ?? "#9CA3AF";
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cor + "22" }}>
      <Icon size={size} color={cor} />
    </div>
  );
}

function formatarValor(texto: string) {
  const soNumeros = texto.replace(/\D/g, "");
  if (!soNumeros) return "";
  const numero = parseInt(soNumeros, 10);
  return (numero / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Lancamentos() {
  const { lancamentos, recarregar } = useLancamentos();
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(dayjs().format("YYYY-MM-DD"));
  const [parcelado, setParcelado] = useState(false);
  const [numeroParcelas, setNumeroParcelas] = useState("2");
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [formaPagamento, setFormaPagamento] = useState("");
  const [banco, setBanco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");

  const lancamentosAgrupados = agruparParcelas(lancamentos);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor || !categoria) { setFeedback("Preencha todos os campos!"); return; }
    const valorNumerico = parseFloat(valor.replace(/\./g, "").replace(",", "."));
    if (isNaN(valorNumerico) || valorNumerico <= 0) { setFeedback("Informe um valor válido!"); return; }
    if (parcelado) {
      const n = parseInt(numeroParcelas);
      if (isNaN(n) || n < 2 || n > 48) { setFeedback("Número de parcelas entre 2 e 48."); return; }
    }
    setSalvando(true); setFeedback("");
    try {
      if (parcelado) {
        const valorParcela = valorNumerico / parseInt(numeroParcelas);
        await adicionarLancamentoParcelado(tipo, descricao, valorParcela, categoria, data, parseInt(numeroParcelas), formaPagamento, banco);
      } else {
        await adicionarLancamento(tipo, descricao, valorNumerico, categoria, data, formaPagamento, banco);
      }
      setDescricao(""); setValor(""); setCategoria(""); setData(dayjs().format("YYYY-MM-DD"));
      setParcelado(false); setNumeroParcelas("2"); setFormaPagamento(""); setBanco("");
      await recarregar();
      setFeedback(parcelado ? `✅ ${numeroParcelas} parcelas criadas!` : "✅ Lançamento salvo!");
    } catch {
      setFeedback("❌ Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function deletar(id: string, todos = false, chaveGrupo?: string) {
    if (!confirm(todos ? "Excluir TODAS as parcelas?" : "Excluir este lançamento?")) return;
    try {
      if (todos && chaveGrupo) {
        const grupo = lancamentosAgrupados.find((g) => g.chave === chaveGrupo) as any;
        if (grupo) await Promise.all(grupo.parcelas.map((p: any) => deletarLancamento(p.id)));
      } else {
        await deletarLancamento(id);
      }
      await recarregar();
    } catch { alert("Não foi possível excluir."); }
  }

  function toggleExpandir(chave: string) {
    setExpandidos((prev) => { const n = new Set(prev); n.has(chave) ? n.delete(chave) : n.add(chave); return n; });
  }

  const categoriaLabel = (value: string) => CATEGORIAS.find((c) => c.value === value);

  return (
    <div className="bg-fundo min-h-full pb-6">
      <div className="flex gap-3 p-4">
        <button
          onClick={() => setTipo("receita")}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
            tipo === "receita" ? "border-success bg-success-light text-text-main" : "border-border bg-white text-text-soft"
          }`}
        >
          💰 Receita
        </button>
        <button
          onClick={() => setTipo("despesa")}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
            tipo === "despesa" ? "border-danger bg-danger-light text-text-main" : "border-border bg-white text-text-soft"
          }`}
        >
          💸 Despesa
        </button>
      </div>

      <form onSubmit={salvar} className="bg-white rounded-xl mx-4 p-4 shadow-sm border border-border-light overflow-hidden">
        <input
          className="w-full border border-border rounded-lg px-3 py-3 mb-3 text-sm text-text-main focus:outline-none focus:border-primary"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          className="w-full border border-border rounded-lg px-3 py-3 mb-3 text-sm text-text-main focus:outline-none focus:border-primary"
          placeholder="R$ 0,00"
          value={valor}
          inputMode="numeric"
          onChange={(e) => setValor(formatarValor(e.target.value))}
        />
        <input
          type="date"
          value={data}
          max={dayjs().format("YYYY-MM-DD")}
          onChange={(e) => setData(e.target.value)}
          className="w-full min-w-0 border border-border rounded-lg px-3 py-3 mb-3 text-sm text-text-main bg-fundo focus:outline-none focus:border-primary"
        />

        <div className="flex items-center justify-between mb-3 py-1">
          <div>
            <p className="text-sm font-semibold text-text-main">💳 Parcelado</p>
            <p className="text-xs text-text-soft mt-0.5">Lançar em vários meses</p>
          </div>
          <button
            type="button"
            onClick={() => setParcelado(!parcelado)}
            className={`w-12 h-6 rounded-full transition-colors relative overflow-hidden ${parcelado ? "bg-primary" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 left-0 w-5 h-5 rounded-full bg-white shadow transition-transform ${parcelado ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>

        {parcelado && (
          <div className="bg-primary-soft rounded-lg p-3 mb-3">
            <p className="text-xs text-text-secondary mb-2">Número de parcelas</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {["2","3","4","5","6","7","8","9","10","12"].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNumeroParcelas(n)}
                  className={`px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                    numeroParcelas === n ? "bg-primary border-primary text-white" : "bg-white border-border text-text-secondary"
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
            <p className="text-xs text-primary font-semibold text-center">
              {numeroParcelas}x de R$ {valor ? (parseFloat(valor.replace(/\./g, "").replace(",", ".")) / parseInt(numeroParcelas)).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"} · Total R$ {valor || "0,00"}
            </p>
          </div>
        )}

        <p className="text-xs font-semibold text-text-secondary mb-2">Categoria</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {CATEGORIAS.map((cat) => {
            const Icon = cat.icone;
            const isSelected = categoria === cat.value;
            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`flex flex-col items-center p-2 rounded-lg border text-center transition-colors ${
                  isSelected ? "border-primary bg-primary-light" : "border-border bg-fundo"
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.cor + "22" }}>
                  <Icon size={16} color={isSelected ? "#6C63FF" : cat.cor} />
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isSelected ? "text-primary" : "text-text-secondary"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <IconDropdown label="Forma de Pagamento" placeholder="Selecione..." opcoes={FORMAS_PAGAMENTO} valor={formaPagamento} onChange={setFormaPagamento} />
        <IconDropdown label="Banco" placeholder="Selecione..." opcoes={BANCOS} valor={banco} onChange={setBanco} />

        {feedback && (
          <p className={`text-sm text-center mb-3 ${feedback.startsWith("✅") ? "text-success" : "text-danger"}`}>{feedback}</p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar Lançamento"}
        </button>
      </form>

      <h2 className="text-base font-bold text-text-main mx-4 mt-5 mb-3">Últimos Lançamentos</h2>
      {lancamentosAgrupados.length === 0 && (
        <p className="text-center text-text-soft text-sm mt-4">Nenhum lançamento ainda.</p>
      )}

      <div className="mx-4 flex flex-col gap-2">
        {lancamentosAgrupados.map((item: any) => {
          const cat = categoriaLabel(item.categoria);
          if (item.avulso) {
            return (
              <div key={item.id} className="bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm border border-border-light">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CatIcone cat={cat} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate">{item.descricao}</p>
                    <p className="text-xs text-text-soft mt-0.5">{cat?.label ?? item.categoria} · {dayjs(item.data).format("DD/MM/YYYY")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <span className={`text-sm font-bold ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                    {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                  </span>
                  <button onClick={() => deletar(item.id)} className="text-text-faint hover:text-danger p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          }

          const expandido = expandidos.has(item.chave);
          const parcelasPagas = item.parcelas.filter((p: any) =>
            dayjs(p.data).isBefore(dayjs(), "month")
          ).length;

          return (
            <div key={item.chave}>
              <button
                onClick={() => toggleExpandir(item.chave)}
                className="w-full bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm border-l-4 border-primary border-t border-r border-b border-border-light text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CatIcone cat={cat} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate">{item.descricaoBase}</p>
                    <p className="text-xs text-text-soft mt-0.5">{cat?.label ?? item.categoria} · {parcelasPagas}/{item.totalParcelas} parcelas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${item.tipo === "receita" ? "text-success" : "text-danger"}`}>
                      {item.tipo === "receita" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                    </p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deletar("", true, item.chave); }} className="text-text-faint hover:text-danger p-1">
                    <Trash2 size={15} />
                  </button>
                  {expandido ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-primary" />}
                </div>
              </button>
              {expandido && item.parcelas.map((parcela: any) => {
                const isPago = dayjs(parcela.data).isBefore(dayjs(), "month");
                return (
                  <div key={parcela.id} className={`mx-4 mb-0.5 px-3 py-2.5 rounded-lg flex justify-between items-center ${isPago ? "bg-success-light" : "bg-primary-soft"}`}>
                    <p className="text-xs text-text-secondary">{parcela.descricao}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-text-soft">{dayjs(parcela.data).format("MM/YYYY")}</p>
                      {isPago && <span className="text-xs text-success font-bold">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
