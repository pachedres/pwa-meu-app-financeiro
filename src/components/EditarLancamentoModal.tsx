import { useState, useEffect } from "react";
import { X } from "lucide-react";
import dayjs from "dayjs";
import { editarLancamento } from "@/lib/db";
import { CATEGORIAS } from "@/constants/categorias";
import { FORMAS_PAGAMENTO, BANCOS } from "@/constants/pagamentos";
import IconDropdown from "./IconDropdown";

function formatarValor(texto: string) {
  const soNumeros = texto.replace(/\D/g, "");
  if (!soNumeros) return "";
  const numero = parseInt(soNumeros, 10);
  return (numero / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Props = {
  lancamento: any | null;
  onClose: () => void;
  onSalvo: () => void;
};

export default function EditarLancamentoModal({ lancamento, onClose, onSalvo }: Props) {
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [banco, setBanco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (lancamento) {
      setTipo(lancamento.tipo);
      setDescricao(lancamento.descricao);
      setValor(Number(lancamento.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setCategoria(lancamento.categoria ?? "");
      setData(lancamento.data ?? dayjs().format("YYYY-MM-DD"));
      setFormaPagamento(lancamento.forma_pagamento ?? "");
      setBanco(lancamento.banco ?? "");
      setFeedback("");
    }
  }, [lancamento]);

  if (!lancamento) return null;

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor || !categoria) { setFeedback("Preencha todos os campos!"); return; }
    const valorNumerico = parseFloat(valor.replace(/\./g, "").replace(",", "."));
    if (isNaN(valorNumerico) || valorNumerico <= 0) { setFeedback("Valor inválido!"); return; }
    setSalvando(true); setFeedback("");
    try {
      await editarLancamento(lancamento.id, {
        tipo,
        descricao,
        valor: valorNumerico,
        categoria,
        data,
        forma_pagamento: formaPagamento || null,
        banco: banco || null,
      });
      onSalvo();
      onClose();
    } catch {
      setFeedback("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border-light sticky top-0 bg-white">
          <h2 className="text-base font-bold text-text-main">Editar Lançamento</h2>
          <button onClick={onClose} className="p-1 text-text-soft"><X size={20} /></button>
        </div>

        <form onSubmit={salvar} className="p-4">
          <div className="flex gap-3 mb-4">
            <button type="button" onClick={() => setTipo("receita")}
              className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${tipo === "receita" ? "border-success bg-success-light text-text-main" : "border-border bg-white text-text-soft"}`}>
              💰 Receita
            </button>
            <button type="button" onClick={() => setTipo("despesa")}
              className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${tipo === "despesa" ? "border-danger bg-danger-light text-text-main" : "border-border bg-white text-text-soft"}`}>
              💸 Despesa
            </button>
          </div>

          <input
            className="w-full border border-border rounded-lg px-3 py-3 mb-3 text-sm text-text-main focus:outline-none focus:border-primary"
            placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}
          />
          <input
            className="w-full border border-border rounded-lg px-3 py-3 mb-3 text-sm text-text-main focus:outline-none focus:border-primary"
            placeholder="R$ 0,00" value={valor} inputMode="numeric"
            onChange={(e) => setValor(formatarValor(e.target.value))}
          />
          <div className="flex justify-center mb-3">
            <input type="date" value={data} max={dayjs().format("YYYY-MM-DD")}
              onChange={(e) => setData(e.target.value)}
              className="w-11/12 text-center border border-border rounded-lg px-3 py-3 text-sm text-text-main bg-fundo focus:outline-none focus:border-primary"
            />
          </div>

          <p className="text-xs font-semibold text-text-secondary mb-2">Categoria</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CATEGORIAS.map((cat) => {
              const Icon = cat.icone;
              const isSelected = categoria === cat.value;
              return (
                <button type="button" key={cat.value} onClick={() => setCategoria(cat.value)}
                  className={`flex flex-col items-center p-2 rounded-lg border text-center transition-colors ${isSelected ? "border-primary bg-primary-light" : "border-border bg-fundo"}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.cor + "22" }}>
                    <Icon size={16} color={isSelected ? "#10B981" : cat.cor} />
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${isSelected ? "text-primary" : "text-text-secondary"}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <IconDropdown label="Forma de Pagamento" placeholder="Selecione..." opcoes={FORMAS_PAGAMENTO} valor={formaPagamento} onChange={setFormaPagamento} />
          <IconDropdown label="Banco" placeholder="Selecione..." opcoes={BANCOS} valor={banco} onChange={setBanco} />

          {feedback && <p className="text-sm text-center mb-3 text-danger">{feedback}</p>}

          <button type="submit" disabled={salvando}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-60 mb-2">
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </>
  );
}
