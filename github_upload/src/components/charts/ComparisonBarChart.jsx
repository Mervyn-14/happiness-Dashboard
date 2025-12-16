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

export default function ComparisonBarChart({ countryA, countryB }) {
    const chartData = useMemo(() => {
        if (!countryA || !countryB) return null;

        return {
            labels: [
                "Log GDP",
                "Social Support",
                "Life Expectancy",
                "Freedom",
                "Generosity",
                "Corruption",
            ],
            datasets: [
                {
                    label: countryA.Country,
                    data: [
                        countryA.Log_GDP_per_capita / 2, // Scaling
                        countryA.Social_support,
                        countryA.Healthy_life_expectancy,
                        countryA.Freedom_to_make_life_choices,
                        countryA.Generosity + 0.2, // Offset
                        countryA.Perceptions_of_corruption,
                    ],
                    backgroundColor: "#8b5cf6", // Violet-500
                    borderRadius: 4,
                },
                {
                    label: countryB.Country,
                    data: [
                        countryB.Log_GDP_per_capita / 2, // Scaling
                        countryB.Social_support,
                        countryB.Healthy_life_expectancy,
                        countryB.Freedom_to_make_life_choices,
                        countryB.Generosity + 0.2, // Offset
                        countryB.Perceptions_of_corruption,
                    ],
                    backgroundColor: "#f472b6", // Pink-400
                    borderRadius: 4,
                },
            ],
        };
    }, [countryA, countryB]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "#1f2937",
                    font: { size: 11 }
                }
            },
            title: {
                display: true,
                text: "FACTOR COMPARISON",
                color: "#db2777", // Pink-600
                font: {
                    size: 12,
                    weight: "bold",
                },
                align: "start",
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                display: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    color: "#4b5563",
                    font: { size: 10 }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#4b5563",
                    font: {
                        size: 9
                    },
                },
            },
        },
    };

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}
