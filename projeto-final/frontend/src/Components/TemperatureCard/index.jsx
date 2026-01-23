import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "primeicons/primeicons.css";
import TemperatureIcon from "../../Icons/TemperatureIcon";

function TemperatureCard({ currentTemperature, temperatureData }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {

    const data = {
      labels: temperatureData.map((_, index) => index + 1), // Labels invisíveis
      datasets: [
        {
          data: temperatureData,
          fill: true,
          borderColor: '#F87171',
          backgroundColor: '#fee2e2',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [temperatureData]);

  return (
    <Card className="flex-1 shadow-sm border-round-xl bg-gray-50">
      {/* Cabeçalho do Card */}
      <div className="flex align-items-center gap-3 mb-2">
        <div className="flex align-items-center justify-content-center bg-red-100 border-circle w-3rem h-3rem rounded-full p-2">
          <TemperatureIcon/>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-gray-500 text-sm uppercase tracking-wide">
            Temperatura
          </span>
        </div>
      </div>

      {/* Valor Principal */}
      <div className="flex flex-col">
        <span className="text-4xl font-bold text-gray-800 my-2 text-center">
          {currentTemperature} °C
        </span>
      </div>

      {/* Gráfico Sparkline no rodapé */}
      <div className="h-4rem w-full mt-2">
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          height="60px"
        />
      </div>
    </Card>
  );
}

export default TemperatureCard;
