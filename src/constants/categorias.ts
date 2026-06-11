import { LucideIcon, Utensils, GraduationCap, TrendingUp, Gamepad2, Home, PawPrint, User, HeartPulse, Wallet, Car, Shirt, Package } from "lucide-react";

export type Categoria = {
  label: string;
  value: string;
  icone: LucideIcon;
  cor: string;
};

export const CATEGORIAS: Categoria[] = [
  { label: "Alimentação",  value: "alimentacao",  icone: Utensils,      cor: "#F59E0B" },
  { label: "Educação",     value: "educacao",     icone: GraduationCap, cor: "#8B5CF6" },
  { label: "Investimentos",value: "investimentos",icone: TrendingUp,    cor: "#22C55E" },
  { label: "Lazer",        value: "lazer",        icone: Gamepad2,      cor: "#EC4899" },
  { label: "Moradia",      value: "moradia",      icone: Home,          cor: "#3B82F6" },
  { label: "Pets",         value: "pets",         icone: PawPrint,      cor: "#F97316" },
  { label: "Pessoal",      value: "pessoal",      icone: User,          cor: "#8B5CF6" },
  { label: "Saúde",        value: "saude",        icone: HeartPulse,    cor: "#EF4444" },
  { label: "Salário",      value: "salario",      icone: Wallet,        cor: "#22C55E" },
  { label: "Transporte",   value: "transporte",   icone: Car,           cor: "#0EA5E9" },
  { label: "Vestuário",    value: "vestuario",    icone: Shirt,         cor: "#EC4899" },
  { label: "Outros",       value: "outros",       icone: Package,       cor: "#9CA3AF" },
];
