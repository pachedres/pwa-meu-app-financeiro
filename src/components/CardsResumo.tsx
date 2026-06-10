type Props = { receitas: number; despesas: number; saldo?: number };

export default function CardsResumo({ receitas, despesas, saldo }: Props) {
  const saldoFinal = saldo ?? receitas - despesas;

  return (
    <div className="grid grid-cols-3 gap-3 mx-4 my-4">
      <Card label="Receitas" valor={receitas} cor="text-success" bg="bg-success-light" />
      <Card label="Despesas" valor={despesas} cor="text-danger" bg="bg-danger-light" />
      <Card label="Saldo" valor={saldoFinal} cor={saldoFinal >= 0 ? "text-success" : "text-danger"} bg="bg-white" destaque />
    </div>
  );
}

function Card({ label, valor, cor, bg, destaque }: { label: string; valor: number; cor: string; bg: string; destaque?: boolean }) {
  return (
    <div className={`${bg} ${destaque ? "shadow-md" : ""} rounded-xl p-3 border border-border-light`}>
      <p className="text-[10px] font-semibold text-text-soft uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-bold ${cor} leading-tight`}>
        R$ {Math.abs(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
