import React from "react";

function ActivityLogCard({ logs = [] }) {
  return (
    // CONTAINER EXTERNO: Define o tamanho do "Card"
    // relative: Permite posicionar coisas lá dentro absolutamente
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
      
      {/* CABEÇALHO (Fixo no topo) */}
      <div className="flex-none p-4 border-b border-gray-200 flex align-items-center gap-2 bg-white z-10">
        <i className="pi pi-history text-gray-500 text-lg"></i>
        <span className="font-semibold text-gray-700 text-md uppercase tracking-wide flex items-center ">
          Registro de Atividades
        </span>
      </div>

      {/* ÁREA DE SCROLL (A mágica acontece aqui) 
          - absolute: Ignora o fluxo normal e se prende às bordas
          - top-[60px]: Empurra para baixo para não cobrir o cabeçalho (ajuste se precisar)
          - bottom-0/left-0/right-0: Cola nas bordas de baixo e lados
          - overflow-y-auto: Habilita o scroll
      */}
      <div className="absolute top-[60px] bottom-0 left-0 right-0 overflow-y-auto p-2 custom-scrollbar">
        
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Nenhuma atividade registrada.
          </div>
        ) : (
          <ul className="list-none p-0 m-0 pb-2">
            {logs.map((log, index) => {
              const isAlert = log.type === 'alert';
              const isWarning = log.type === 'warning';
              const isSuccess = log.type === 'success';

              return (
                <li 
                  key={log.id || index} 
                  className="flex flex-col border-b last:border-none border-gray-200 py-3 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 mb-1"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                      {log.time}
                    </span>
                    
                    {isAlert && (
                       <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                         Crítico
                       </span>
                    )}
                    {isSuccess && (
                       <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                         Info
                       </span>
                    )}
                  </div>

                  <span className={`text-sm mt-1 leading-snug ${
                    isAlert ? 'text-red-600 font-bold' : 
                    isWarning ? 'text-orange-500 font-medium' : 
                    'text-gray-600'
                  }`}>
                    {log.message}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ActivityLogCard;