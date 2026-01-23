import React from "react";
import { Card } from "primereact/card";
import CollisionIcon from "../../Icons/CollisionIcon";

function CollisionCard({ hasCollision, lastGForce = "0.0" }) {
  
  // Definição de estilos baseados no estado (Seguro vs Perigo)
  const isDanger = hasCollision;

  const theme = {
    bgIcon: isDanger ? "bg-red-100" : "bg-green-100",
    fillIcon: isDanger ? "#EF4444" : "#10B981", // Vermelho ou Verde
    textColor: isDanger ? "text-red-600" : "text-green-600",
    statusText: isDanger ? "COLISÃO!" : "SEGURO",
    subText: isDanger ? "Impacto Detectado" : "Transporte Estável",
  };

  return (
    <Card className="flex-1 shadow-sm border-round-xl bg-white">
      
      {/* Cabeçalho do Card */}
      <div className="flex align-items-center gap-3 mb-2">
        <div className={`flex align-items-center justify-content-center ${theme.bgIcon} border-circle w-3rem h-3rem rounded-full p-5`}>
          <CollisionIcon fill={theme.fillIcon} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-gray-500 text-sm uppercase tracking-wide">
            Status Colisão
          </span>
        </div>
      </div>

      {/* Valor Principal */}
      <div className="flex flex-col">
        <span className={`text-3xl font-bold ${theme.textColor} my-2 text-center`}>
          {theme.statusText}
        </span>
      </div>

      {/* Rodapé */}
      <div className="h-4rem w-full mt-4 flex flex-col justify-center text-center">
        <span className="text-gray-600 font-medium">
            {theme.subText}
        </span>
        
        {/* Mostra a Força G se houver colisão, senão mostra mensagem padrão */}
        {isDanger && (
            <span className="text-xs text-gray-400 mt-1">
                Força G estimada: {lastGForce}G
            </span>
        )}
         {!isDanger && (
            <span className="text-xs text-gray-400 mt-1">
                Nenhuma anomalia registrada
            </span>
        )}
      </div>
    </Card>
  );
}

export default CollisionCard;