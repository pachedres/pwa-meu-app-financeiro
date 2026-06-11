type Props = { receitas: number; despesas: number; saldo?: number };

function fmt(valor: number): string {
  const abs = Math.abs(valor);
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  if (abs >= 10_000)    return `${(abs / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`;
  return abs.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CardsResumo({ receitas, despesas, saldo }: Props) {
  const saldoFinal = saldo ?? receitas - despesas;
  const positivo = saldoFinal >= 0;
  const saldoBg = positivo ? "bg-success" : "bg-danger";

  return (
    <div className="mx-4 my-4 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div
          className="bg-success-light rounded-xl px-3 py-3 border border-border-light"
          title={`R$ ${receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        >
          <p className="text-[10px] font-semibold text-text-soft uppercase tracking-wide mb-1">Receitas</p>
          <p className="text-sm font-bold text-success">
            <span className="text-[10px] font-semibold mr-0.5">R$</span>
            {fmt(receitas)}
          </p>
        </div>
        <div
          className="bg-danger-light rounded-xl px-3 py-3 border border-border-light"
          title={`R$ ${despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        >
          <p className="text-[10px] font-semibold text-text-soft uppercase tracking-wide mb-1">Despesas</p>
          <p className="text-sm font-bold text-danger">
            <span className="text-[10px] font-semibold mr-0.5">R$</span>
            {fmt(despesas)}
          </p>
        </div>
      </div>

      <div
        className={`${saldoBg} rounded-xl px-4 py-4 flex items-center justify-between shadow-md`}
        title={`R$ ${Math.abs(saldoFinal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
      >
        <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Saldo</p>
        <p className="text-2xl font-bold text-white">
          {!positivo && "−"}
          <span className="text-sm font-semibold mr-0.5">R$</span>
          {fmt(saldoFinal)}
        </p>
      </div>
    </div>
  );
}
