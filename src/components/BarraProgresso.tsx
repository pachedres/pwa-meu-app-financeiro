type Props = { progresso: number; cor: string; rotulo: string };

export default function BarraProgresso({ progresso, cor, rotulo }: Props) {
  const pct = Math.min(progresso * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-soft">{rotulo}</span>
        <span className="text-xs font-semibold text-text-secondary">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-border-light rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: cor }}
        />
      </div>
    </div>
  );
}
