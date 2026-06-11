import { LucideIcon, Zap, CreditCard, ArrowLeftRight, FileText, Banknote, Building2 } from "lucide-react";

export type FormaPagamento = { label: string; value: string; icone: LucideIcon; cor: string };
export type Banco = { label: string; value: string; icone: LucideIcon; cor: string };

export const FORMAS_PAGAMENTO: FormaPagamento[] = [
  { label: "PIX",      value: "pix",      icone: Zap,              cor: "#00BDAE" },
  { label: "Crédito",  value: "credito",  icone: CreditCard,       cor: "#6C63FF" },
  { label: "Débito",   value: "debito",   icone: CreditCard,       cor: "#22C55E" },
  { label: "TED",      value: "ted",      icone: ArrowLeftRight,   cor: "#F59E0B" },
  { label: "Boleto",   value: "boleto",   icone: FileText,         cor: "#888888" },
  { label: "Dinheiro", value: "dinheiro", icone: Banknote,         cor: "#22C55E" },
];

export const BANCOS: Banco[] = [
  { label: "Nubank", value: "nubank", icone: Building2, cor: "#8A05BE" },
  { label: "Inter",  value: "inter",  icone: Building2, cor: "#FF7A00" },
];
