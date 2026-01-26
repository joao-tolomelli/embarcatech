import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import TemperatureCard from "./Components/TemperatureCard";
import HumidityCard from "./Components/HumidityCard";
import CollisionCard from "./Components/CollisionCard";
import BoxStatusCard from "./Components/BoxStatusCard";
import ActivityLogCard from "./Components/ActivityLogCard";
import HistoryChart from "./Components/HistoryChart";
import { getHistorico, getLeituraAtual, getLogs } from "./services/api";

function App() {
  const [currentData, setCurrentData] = useState({
    temperatura: 0,
    umidade: 0,
    colisao: false,
    caixaAberta: false,
    lux: 0,
  });

  const [historyTemp, setHistoryTemp] = useState([]);
  const [historyHum, setHistoryHum] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchData = async () => {
    // Busca Leitura Atual
    const leitura = await getLeituraAtual();
    if (leitura) {
      setCurrentData({
        temperatura: leitura.temperatura,
        umidade: leitura.umidade,
        colisao: leitura.colisao,
        caixaAberta: leitura.caixaAberta, 
        lux: 0, 
      });
    }

    // Busca Histórico e processa para o Gráfico
    const historico = await getHistorico();
    if (historico.length > 0) {
      const temps = historico.map((item) => item.temperatura);
      const hums = historico.map((item) => item.umidade);
      setHistoryTemp(temps);
      setHistoryHum(hums);
    }

    // Busca Logs
    const logData = await getLogs();
    if (logData) {
      setLogs(logData);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col h-full p-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-800 shrink-0">
          Monitoramento de Encomenda
        </h1>

        {/* Cards Superiores */}
        <section className="flex flex-row gap-4 shrink-0">
          <TemperatureCard
            currentTemperature={currentData.temperatura}
            temperatureData={historyTemp}
          />
          <HumidityCard
            currentHumidity={currentData.umidade}
            HumidityData={historyHum}
          />
          <CollisionCard hasCollision={currentData.colisao} lastGForce="--" />
          <BoxStatusCard
            isOpen={currentData.caixaAberta}
            luxValue={currentData.lux}
          />
        </section>

        {/* Conteúdo Principal (Gráfico e Logs) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          {/* Coluna Esquerda: Gráfico Principal */}
          <div className="lg:col-span-2 h-full">
            <HistoryChart
              temperatureData={historyTemp}
              humidityData={historyHum}
            />
          </div>

          {/* Coluna Direita: Logs */}
          <div className="lg:col-span-1 h-full">
            <ActivityLogCard logs={logs} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
