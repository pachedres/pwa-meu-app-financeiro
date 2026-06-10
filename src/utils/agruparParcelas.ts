import dayjs from "dayjs";

export type LancamentoRaw = {
  id: string;
  descricao: string;
  categoria: string;
  tipo: string;
  valor: number;
  data: string;
  criado_em: string;
  [key: string]: any;
};

export type ItemAvulso = LancamentoRaw & { chave: string; avulso: true };

export type ItemAgrupado = {
  chave: string;
  avulso: false;
  descricaoBase: string;
  totalParcelas: number;
  categoria: string;
  tipo: string;
  valor: number;
  parcelas: LancamentoRaw[];
};

export type ItemLista = ItemAvulso | ItemAgrupado;

export function agruparParcelas(lancamentos: LancamentoRaw[]): ItemLista[] {
  const mapa: Record<string, any> = {};
  const avulsos: LancamentoRaw[] = [];

  lancamentos.forEach((item) => {
    const match = item.descricao.match(/^(.+) \((\d+)\/(\d+)\)$/);
    if (match) {
      const chave = `${match[1]}_${item.categoria}_${item.tipo}`;
      if (!mapa[chave]) {
        mapa[chave] = {
          chave,
          avulso: false,
          descricaoBase: match[1],
          totalParcelas: parseInt(match[3]),
          categoria: item.categoria,
          tipo: item.tipo,
          valor: item.valor,
          parcelas: [],
        };
      }
      mapa[chave].parcelas.push(item);
    } else {
      avulsos.push(item);
    }
  });

  const grupos = Object.values(mapa).map((g) => ({
    ...g,
    parcelas: g.parcelas.sort((a: LancamentoRaw, b: LancamentoRaw) =>
      dayjs(a.data).diff(dayjs(b.data)),
    ),
  }));

  return [
    ...avulsos.map((i) => ({ ...i, chave: i.id, avulso: true as const })),
    ...grupos,
  ].sort((a: any, b: any) => {
    const dataA = a.avulso ? a.criado_em : a.parcelas[0]?.criado_em;
    const dataB = b.avulso ? b.criado_em : b.parcelas[0]?.criado_em;
    return new Date(dataB).getTime() - new Date(dataA).getTime();
  });
}
