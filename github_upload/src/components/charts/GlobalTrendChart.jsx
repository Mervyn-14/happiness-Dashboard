import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GlobalTrendChart({ countryData }) {
  const chartData = useMemo(() => {
    if (!countryData) return null;

    const currentScore = countryData.Ladder_score;
    const years = Array.from({ length: 14 }, (_, i) => 2011 + i);
    
    // Generate mock historical data
    // We'll create a random walk that ends at the current score
    const dataPoints = [];
    let score = currentScore;
    
    // Work backwards from 2024
    for (let i = years.length - 1; i >= 0; i--) {
        dataPoints[i] = score;
        // Random change between -0.3 and +0.3
        const change = (Math.random() - 0.5) * 0.6; 
        score -= change;
        // Clamp between 2 and 8
        score = Math.max(2, Math.min(8, score));
    }

    return {
      labels: years,
      datasets: [
        {
          label: "Happiness Score",
          data: dataPoints,
          borderColor: "#8b5cf6", // Violet-500
          backgroundColor: "rgba(139, 92, 246, 0.5)",
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  }, [countryData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "GLOBAL HAPPINESS TREND (2011 - 2024)",
        color: "#d946ef", // Fuchsia-500
        font: {
          size: 12,
          weight: "bold",
        },
        align: "start",
        padding: {
            bottom: 20
        }
      },
      tooltip: {
          mode: 'index',
          intersect: false,
      }
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
              size: 10
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
              size: 10
          }
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
