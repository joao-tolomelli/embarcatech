import React from "react";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import TemperatureCard from "./Components/TemperatureCard";
import HumidityCard from "./Components/HumidityCard";
import CollisionCard from "./Components/CollisionCard";
import BoxStatusCard from "./Components/BoxStatusCard";
import ActivityLogCard from "./Components/ActivityLogCard";

function App() {
  const simulatedTemperatureData = [22.0, 23.5, 23.0, 24.1, 23.8, 24.2, 24.5];
  const currentTemperature = 24.5;

  const simulatedHumidityData = [50.0, 51.5, 52.0, 53.1, 52.8, 53.2, 53.5];
  const currentHumidity = 53.5;

  const simulatedCollisionData = true;
  const lastGForce = "2.8";

  const logs = [
    {
      id: 1,
      time: "10:22:25",
      message: "Verificação de Status: OK",
      type: "info",
    },
    {
      id: 2,
      time: "10:21:30",
      message: "Verificação de Status: OK",
      type: "info",
    },
    {
      id: 3,
      time: "10:15:00",
      message: "**ALERTA**: Impacto Detectado (2.8G)",
      type: "alert",
    },
    {
      id: 4,
      time: "10:14:55",
      message: "Verificação de Status: OK",
      type: "info",
    },
    {
      id: 5,
      time: "10:00:00",
      message: "Sistema Iniciado - Conectado ao WiFi",
      type: "success",
    },
    {
      id: 6,
      time: "09:55:00",
      message: "Aguardando conexão...",
      type: "warning",
    },
    {
      id: 7,
      time: "09:55:00",
      message: "Aguardando conexão...",
      type: "warning",
    },
    {
      id: 8,
      time: "09:55:00",
      message: "Aguardando conexão...",
      type: "warning",
    },
  ];

  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col h-full p-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-800 shrink-0">
          Monitoramento de Encomenda
        </h1>

        {/* Cards Superiores */}
        <section className="flex flex-row gap-4 shrink-0">
          <TemperatureCard
            currentTemperature={currentTemperature}
            temperatureData={simulatedTemperatureData}
          />
          <HumidityCard
            currentHumidity={currentHumidity}
            HumidityData={simulatedHumidityData}
          />
          <CollisionCard
            hasCollision={simulatedCollisionData}
            lastGForce={lastGForce}
          />
          <BoxStatusCard isOpen={false} luxValue={"2.1"} />
        </section>

        {/* Conteúdo Principal (Gráfico e Logs) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          {/* Coluna Esquerda: Gráfico Principal (Ocupa 2/3) */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex items-center justify-center text-gray-400 border border-gray-200">
              [Área reservada para o Gráfico Histórico Completo]
            </div>
          </div>

          {/* Coluna Direita: Logs (Ocupa 1/3) */}
          <div className="lg:col-span-1 h-full">
            <ActivityLogCard logs={logs} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
