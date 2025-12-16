import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function LineChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((i) => i.Year),
    datasets: [
      {
        label: "Happiness Score Over Time",
        data: data.map((i) => i.Ladder_score),
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 3,
        fill: false,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Trend Over the Years</h3>
      <Line data={chartData} />
    </div>
  );
}
