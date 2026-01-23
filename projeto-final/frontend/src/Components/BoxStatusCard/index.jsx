import React from "react";
import { Card } from "primereact/card";
import BoxStatusIcon from "../../Icons/BoxStatusIcon"; // Certifique-se do caminho correto

function BoxStatusCard({ isOpen, luxValue = "0.0" }) {
  
  // Definição de estilos baseados no estado
  // isOpen = true -> PERIGO (Vermelho)
  // isOpen = false -> SEGURO (Verde)
  const isDanger = isOpen;

  const theme = {
    bgIcon: isDanger ? "bg-red-100" : "bg-green-100",
    fillIcon: isDanger ? "#EF4444" : "#10B981", // Vermelho-500 ou Verde-500
    textColor: isDanger ? "text-red-600" : "text-green-600",
    statusText: isDanger ? "VIOLADA!" : "LACRADA",
    subText: isDanger ? "Abertura Detectada" : "Embalagem Íntegra",
  };

  return (
    <Card className="flex-1 shadow-sm border-round-xl bg-gray-50">
      
      {/* Cabeçalho do Card */}
      <div className="flex align-items-center gap-3 mb-2">
        {/* Mantido p-5 conforme solicitado no padrão anterior */}
        <div className={`flex align-items-center justify-content-center ${theme.bgIcon} border-circle w-3rem h-3rem rounded-full p-5`}>
          <BoxStatusIcon fill={theme.fillIcon} isOpen={isDanger} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-gray-500 text-sm uppercase tracking-wide">
            Status Caixa
          </span>
        </div>
      </div>

      {/* Valor Principal (Texto Centralizado) */}
      <div className="flex flex-col">
        <span className={`text-3xl font-bold ${theme.textColor} my-2 text-center`}>
          {theme.statusText}
        </span>
      </div>

      {/* Rodapé (Centralizado) */}
      <div className="h-4rem w-full mt-4 flex flex-col justify-center text-center">
        <span className="text-gray-600 font-medium">
            {theme.subText}
        </span>
        
        {/* Exibe o nível de luminosidade para contexto */}
        <span className="text-xs text-gray-400 mt-1">
            Luminosidade: {luxValue} lux
        </span>
      </div>
    </Card>
  );
}

export default BoxStatusCard;