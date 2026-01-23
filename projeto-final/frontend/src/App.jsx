import React from "react";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import TemperatureCard from "./Components/TemperatureCard";
import HumidityCard from "./Components/HumidityCard";
import CollisionCard from "./Components/CollisionCard";
import BoxStatusCard from "./Components/BoxStatusCard";

function App() {
  const simulatedTemperatureData = [22.0, 23.5, 23.0, 24.1, 23.8, 24.2, 24.5];
  const currentTemperature = 24.5;

  const simulatedHumidityData = [50.0, 51.5, 52.0, 53.1, 52.8, 53.2, 53.5];
  const currentHumidity = 53.5;

  const simulatedCollisionData = true;
  const lastGForce = "2.8";

  return (
    <main className="flex flex-col w-screen h-screen p-8 gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        Monitoramento de Encomenda
      </h1>

      <section className="flex flex-row gap-4">
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
    </main>
  );
}

export default App;
