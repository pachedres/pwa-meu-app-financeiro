import { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

type Opcao = { label: string; value: string; icone: LucideIcon; cor: string };

type Props = {
  label: string;
  placeholder: string;
  opcoes: Opcao[];
  valor: string;
  onChange: (v: string) => void;
};

export default function IconDropdown({ label, placeholder, opcoes, valor, onChange }: Props) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selecionado = opcoes.find((o) => o.value === valor);

  useEffect(() => {
    function fechar(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  return (
    <div className="mb-3 relative" ref={ref}>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg border text-sm transition-colors bg-white ${
          aberto ? "border-primary ring-1 ring-primary" : "border-border"
        }`}
      >
        {selecionado ? (
          <span className="flex items-center gap-2">
            <selecionado.icone size={16} color={selecionado.cor} />
            <span className="text-text-main font-medium">{selecionado.label}</span>
          </span>
        ) : (
          <span className="text-text-soft">{placeholder}</span>
        )}
        <ChevronDown
          size={16}
          className={`text-text-soft transition-transform shrink-0 ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
          {opcoes.map((op) => (
            <button
              key={op.value}
              type="button"
              onClick={() => { onChange(op.value); setAberto(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-3 text-sm transition-colors text-left border-b border-border-light last:border-0 ${
                valor === op.value ? "bg-primary-light text-primary font-semibold" : "text-text-main hover:bg-fundo"
              }`}
            >
              <op.icone size={16} color={valor === op.value ? "#10B981" : op.cor} />
              {op.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
