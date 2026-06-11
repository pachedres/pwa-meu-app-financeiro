import { useRegisterSW } from "virtual:pwa-register/react";

export default function AtualizacaoPrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
      <div className="bg-text-main text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-xl gap-3">
        <p className="text-sm font-medium leading-snug">Nova versão disponível</p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0"
        >
          Atualizar
        </button>
      </div>
    </div>
  );
}
