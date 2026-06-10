import { supabase } from "./supabase";
import dayjs from "dayjs";

export async function adicionarLancamento(
  tipo: string,
  descricao: string,
  valor: number,
  categoria: string,
  data: string,
  formaPagamento?: string,
  banco?: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const { error } = await supabase.from("lancamentos").insert({
    usuario_id: user.id,
    tipo,
    descricao,
    valor,
    categoria,
    data,
    forma_pagamento: formaPagamento,
    banco,
  });
  if (error) throw error;
}

export async function buscarLancamentos(): Promise<any[]> {
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function buscarLancamentosPorMes(mes: string, ano: string): Promise<any[]> {
  const inicio = `${ano}-${mes}-01`;
  const fim = dayjs(inicio).endOf("month").format("YYYY-MM-DD");
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .gte("data", inicio)
    .lte("data", fim)
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function buscarTotaisPorMes(
  mes: string,
  ano: string,
): Promise<{ receitas: number; despesas: number; saldo: number }> {
  const dados = await buscarLancamentosPorMes(mes, ano);
  const receitas = dados.filter((i) => i.tipo === "receita").reduce((s, i) => s + Number(i.valor), 0);
  const despesas = dados.filter((i) => i.tipo === "despesa").reduce((s, i) => s + Number(i.valor), 0);
  return { receitas, despesas, saldo: receitas - despesas };
}

export async function buscarTotaisPorCategoria(
  mes: string,
  ano: string,
): Promise<{ categoria: string; tipo: string; total: number }[]> {
  const dados = await buscarLancamentosPorMes(mes, ano);
  const mapa: Record<string, { categoria: string; tipo: string; total: number }> = {};
  dados.forEach((item) => {
    const chave = `${item.categoria}_${item.tipo}`;
    if (!mapa[chave]) {
      mapa[chave] = { categoria: item.categoria, tipo: item.tipo, total: 0 };
    }
    mapa[chave].total += Number(item.valor);
  });
  return Object.values(mapa).sort((a, b) => b.total - a.total);
}

export async function deletarLancamento(id: string): Promise<void> {
  const { error } = await supabase.from("lancamentos").delete().eq("id", id);
  if (error) throw error;
}

export async function adicionarLancamentoParcelado(
  tipo: string,
  descricao: string,
  valor: number,
  categoria: string,
  dataInicio: string,
  parcelas: number,
  formaPagamento?: string,
  banco?: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const inserções = Array.from({ length: parcelas }, (_, i) => ({
    usuario_id: user.id,
    tipo,
    descricao: `${descricao} (${i + 1}/${parcelas})`,
    valor,
    categoria,
    data: dayjs(dataInicio).add(i, "month").format("YYYY-MM-DD"),
    forma_pagamento: formaPagamento,
    banco,
  }));
  const { error } = await supabase.from("lancamentos").insert(inserções);
  if (error) throw error;
}
