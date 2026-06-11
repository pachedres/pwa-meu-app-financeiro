import { LucideIcon } from "lucide-react";

type Opcao = { label: string; value: string; icone: LucideIcon; cor: string };

type Props = {
  label: string;
  opcoes: Opcao[];
  valor: string;
  onChange: (v: string) => void;
};

export default function ChipSelector({ label, opcoes, valor, onChange }: Props) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((op) => {
          const isSelected = valor === op.value;
          const Icon = op.icone;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => onChange(op.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-white text-text-soft"
              }`}
            >
              <Icon size={13} color={isSelected ? "#6C63FF" : op.cor} />
              {op.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
