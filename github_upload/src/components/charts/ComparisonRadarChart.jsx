import React, { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function ComparisonRadarChart({ countryA, countryB }) {
    const chartData = useMemo(() => {
        if (!countryA || !countryB) return null;

        // Helper to avoiding modifying correct data but scaling for visual
        // Using roughly the same scaling logic as ScoreDecompositionChart for consistency
        const processData = (c) => [
            c.Log_GDP_per_capita / 2,
            c.Social_support,
            c.Healthy_life_expectancy,
            c.Freedom_to_make_life_choices,
            c.Generosity + 0.2,
            c.Perceptions_of_corruption
        ];

        return {
            labels: [
                "GDP (Scaled)",
                "Social Support",
                "Life Expectancy",
                "Freedom",
                "Generosity",
                "Corruption",
            ],
            datasets: [
                {
                    label: countryA.Country,
                    data: processData(countryA),
                    backgroundColor: "rgba(139, 92, 246, 0.2)", // Violet-500 low opacity
                    borderColor: "#8b5cf6",
                    borderWidth: 2,
                    pointBackgroundColor: "#8b5cf6",
                },
                {
                    label: countryB.Country,
                    data: processData(countryB),
                    backgroundColor: "rgba(244, 114, 182, 0.2)", // Pink-400 low opacity
                    borderColor: "#f472b6",
                    borderWidth: 2,
                    pointBackgroundColor: "#f472b6",
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
                labels: {
                    color: "#1f2937",
                    font: { size: 11 }
                }
            },
            title: {
                display: true,
                text: "HAPPINESS PROFILE SHAPE",
                color: "#d946ef", // Fuchsia-500
                font: {
                    size: 12,
                    weight: "bold",
                },
                align: "start",
            },
        },
        scales: {
            r: {
                angleLines: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                pointLabels: {
                    color: "#4b5563",
                    font: {
                        size: 10
                    }
                },
                ticks: {
                    display: false, // Hide numeric ticks to avoid clutter
                    backdropColor: "transparent",
                },
                min: 0,
                suggestedMax: 1.5,
            },
        },
    };

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Radar data={chartData} options={options} />
        </div>
    );
}
