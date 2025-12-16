import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ScoreDecompositionChart({ countryData }) {
    const chartData = useMemo(() => {
        if (!countryData) return null;

        return {
            labels: [
                "GDP",
                "Social Support",
                "Life Expectancy",
                "Freedom",
                "Generosity",
                "Corruption",
                "Dystopia",
            ],
            datasets: [
                {
                    label: "Contribution",
                    data: [
                        countryData.Log_GDP_per_capita / 2, // Scaling for visualization
                        countryData.Social_support,
                        countryData.Healthy_life_expectancy,
                        countryData.Freedom_to_make_life_choices,
                        countryData.Generosity + 0.2, // Offset for visibility if negative
                        countryData.Perceptions_of_corruption,
                        countryData.Dystopia_plus_residual,
                    ],
                    backgroundColor: [
                        "#a78bfa", // Violet-400
                        "#c084fc", // Purple-400
                        "#e879f9", // Fuchsia-400
                        "#f472b6", // Pink-400
                        "#fb7185", // Rose-400
                        "#a78bfa",
                        "#c084fc",
                    ],
                    borderRadius: 4,
                    barThickness: 20,
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
                text: "HAPPINESS SCORE DECOMPOSITION",
                color: "#fb7185", // Rose-400
                font: {
                    size: 12,
                    weight: "bold",
                },
                align: "start",
            },
        },
        scales: {
            y: {
                display: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 10 }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        size: 9
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
            },
        },
    };

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}
