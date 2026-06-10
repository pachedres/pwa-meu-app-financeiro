import { useState, useEffect, useCallback } from "react";
import { buscarLancamentos } from "@/lib/db";

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await buscarLancamentos();
      setLancamentos(dados);
    } catch (e) {
      console.error("Erro ao carregar lançamentos:", e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { lancamentos, carregando, recarregar };
}
