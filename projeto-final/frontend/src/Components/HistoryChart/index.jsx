import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

function HistoryChart({ temperatureData = [], humidityData = [] }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color") || "#4b5563";
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary") || "#9ca3af";
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border") || "#e5e7eb";

    const tempColor = "#EF4444";
    const humColor = "#3B82F6";

    // Gera labels fictícias de horário baseadas na quantidade de dados
    // (No futuro, você passará um array de horários reais aqui)
    const labels = temperatureData.map((_, i) => {
        const now = new Date();
        now.setHours(now.getHours() - (temperatureData.length - 1 - i));
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Temperatura (°C)",
          fill: false,
          borderColor: tempColor,
          pointBackgroundColor: "#fff",
          pointBorderColor: tempColor,
          pointHoverBackgroundColor: tempColor,
          pointHoverBorderColor: "#fff",
          yAxisID: "y", // Vincula ao eixo Y da esquerda
          tension: 0.4,
          data: temperatureData,
          borderWidth: 3,
        },
        {
          label: "Umidade (%)",
          fill: false,
          borderColor: humColor,
          pointBackgroundColor: "#fff",
          pointBorderColor: humColor,
          pointHoverBackgroundColor: humColor,
          pointHoverBorderColor: "#fff",
          yAxisID: "y1", // Vincula ao eixo Y da direita
          tension: 0.4,
          data: humidityData,
          borderWidth: 3,
          borderDash: [5, 5], // Linha tracejada para diferenciar visualmente
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
          },
          position: 'top',
          align: 'end'
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: tempColor, // Cor do texto igual à linha
            callback: (value) => `${value.toFixed(1)}°C`
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: 'Temperatura',
            color: tempColor
          }
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          ticks: {
            color: humColor, // Cor do texto igual à linha
            callback: (value) => `${value.toFixed(1)}%`
          },
          grid: {
            drawOnChartArea: false, // Remove a grade para não poluir o visual
          },
          title: {
            display: true,
            text: 'Umidade',
            color: humColor
          }
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [temperatureData, humidityData]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Cabeçalho do Gráfico */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <i className="pi pi-chart-line text-blue-500 text-lg"></i>
            <h2 className="text-gray-700 font-bold text-lg">Histórico de Monitoramento</h2>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            Últimas 24h
        </span>
      </div>

      {/* Área do Gráfico (Flex 1 para ocupar o resto da altura) */}
      <div className="flex-1 min-h-0 w-full">
        <Chart type="line" data={chartData} options={chartOptions} className="h-full w-full" />
      </div>
    </div>
  );
}

export default HistoryChart;