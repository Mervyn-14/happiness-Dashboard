import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChart({ data }) {
  if (!data || data.length === 0) return null;

  const latest = data[data.length - 1];

  const chartData = {
    labels: [
      "GDP",
      "Freedom",
      "Social Support",
      "Generosity",
      "Life Expectancy",
      "Corruption",
    ],
    datasets: [
      {
        label: "Happiness Factors",
        data: [
          latest.Log_GDP_per_capita,
          latest.Freedom_to_make_life_choices,
          latest.Social_support,
          latest.Generosity,
          latest.Healthy_life_expectancy,
          latest.Perceptions_of_corruption,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Happiness Factor Breakdown</h3>
      <Bar data={chartData} />
    </div>
  );
}
