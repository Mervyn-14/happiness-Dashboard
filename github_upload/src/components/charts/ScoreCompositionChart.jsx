import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ScoreCompositionChart({ countryData }) {
    if (!countryData) return null;

    const data = {
        labels: [
            "GDP",
            "Social Support",
            "Life Expectancy",
            "Freedom",
            "Generosity",
            "Corruption",
        ],
        datasets: [
            {
                data: [
                    countryData.Log_GDP_per_capita || 0,
                    countryData.Social_support || 0,
                    countryData.Healthy_life_expectancy ? countryData.Healthy_life_expectancy / 10 : 0, // Scale down for visibility
                    countryData.Freedom_to_make_life_choices || 0,
                    countryData.Generosity || 0,
                    countryData.Perceptions_of_corruption || 0,
                ],
                backgroundColor: [
                    "#8b5cf6", // Violet
                    "#ec4899", // Pink
                    "#10b981", // Emerald
                    "#f59e0b", // Amber
                    "#3b82f6", // Blue
                    "#ef4444", // Red
                ],
                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%", // Makes it a doughnut
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#4b5563",
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                    },
                    usePointStyle: true,
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#1f2937",
                bodyColor: "#1f2937",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 className="card-title">HAPPINESS SCORE COMPOSITION</h3>
            <div style={{ flex: 1, position: "relative" }}>
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
