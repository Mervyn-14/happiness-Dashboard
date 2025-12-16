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

export default function FactorRadarChart({ countryData, allData }) {
    const chartData = useMemo(() => {
        if (!countryData || !allData) return null;

        // Calculate Global Averages
        const factors = [
            "Log_GDP_per_capita",
            "Social_support",
            "Healthy_life_expectancy",
            "Freedom_to_make_life_choices",
            "Generosity",
            "Perceptions_of_corruption",
        ];

        const averages = factors.map((factor) => {
            const sum = allData.reduce((acc, curr) => acc + (curr[factor] || 0), 0);
            let avg = sum / allData.length;
            // Normalize Life Expectancy to be comparable (e.g., divide by 10 or 100)
            if (factor === "Healthy_life_expectancy") avg /= 10;
            return avg;
        });

        const countryValues = factors.map((factor) => {
            let val = countryData[factor] || 0;
            if (factor === "Healthy_life_expectancy") val /= 10;
            return val;
        });

        return {
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
                    label: countryData.Country,
                    data: countryValues,
                    backgroundColor: "rgba(139, 92, 246, 0.2)",
                    borderColor: "#8b5cf6",
                    pointBackgroundColor: "#8b5cf6",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "#8b5cf6",
                    fill: true,
                },
                {
                    label: "Global Average",
                    data: averages,
                    backgroundColor: "rgba(209, 213, 219, 0.2)",
                    borderColor: "#9ca3af",
                    pointBackgroundColor: "#9ca3af",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "#9ca3af",
                    fill: true,
                    borderDash: [5, 5],
                },
            ],
        };
    }, [countryData, allData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                pointLabels: {
                    color: "#4b5563",
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                    },
                },
                ticks: {
                    display: false, // Hide scale numbers for cleaner look
                    backdropColor: "transparent",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#4b5563",
                    font: { size: 11 },
                    usePointStyle: true,
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

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 className="card-title">FACTOR COMPARISON</h3>
            <div style={{ flex: 1 }}>
                <Radar data={chartData} options={options} />
            </div>
        </div>
    );
}
