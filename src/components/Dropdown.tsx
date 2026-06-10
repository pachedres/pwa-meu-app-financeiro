type Opcao = { label: string; value: string; emoji?: string };

type Props = {
  label: string;
  placeholder: string;
  opcoes: Opcao[];
  valor: string;
  onChange: (v: string) => void;
};

export default function Dropdown({ label, placeholder, opcoes, valor, onChange }: Props) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-md px-3 py-3 text-sm text-text-main bg-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">{placeholder}</option>
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.emoji ? `${op.emoji} ` : ""}{op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
