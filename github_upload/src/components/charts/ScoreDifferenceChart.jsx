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

export default function ScoreDifferenceChart({ countryA, countryB }) {
    const chartData = useMemo(() => {
        if (!countryA || !countryB) return null;

        const factors = [
            { key: "Log_GDP_per_capita", label: "GDP" },
            { key: "Social_support", label: "Social Support" },
            { key: "Healthy_life_expectancy", label: "Life Expect." },
            { key: "Freedom_to_make_life_choices", label: "Freedom" },
            { key: "Generosity", label: "Generosity" },
            { key: "Perceptions_of_corruption", label: "Corruption" },
        ];

        // Calculate A - B. 
        // Positive = A leads (Violet). Negative = B leads (Pink).
        const data = factors.map(f => {
            const valA = countryA[f.key] || 0;
            const valB = countryB[f.key] || 0;
            // Scaling GDP down because it's ~10 vs others ~1
            let diff = valA - valB;
            if (f.key === "Log_GDP_per_capita") diff = diff / 2;
            return diff;
        });

        // Dynamic colors based on value
        const bgColors = data.map(v => v >= 0 ? "#a78bfa" : "#f472b6");

        return {
            labels: factors.map(f => f.label),
            datasets: [
                {
                    label: "Score Difference",
                    data: data,
                    backgroundColor: bgColors,
                    borderRadius: 4,
                },
            ],
        };
    }, [countryA, countryB]);

    const options = {
        indexAxis: 'y', // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "SCORE DIFFERENCE (Left = B Leads, Right = A Leads)",
                color: "#db2777",
                font: {
                    size: 11,
                    weight: "bold",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const val = context.raw;
                        const label = val > 0 ? `+${val.toFixed(3)} (${countryA.Country})` : `${val.toFixed(3)} (${countryB.Country})`;
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                    zeroLineColor: "#1f2937",
                    zeroLineWidth: 2,
                },
                ticks: {
                    color: "#4b5563",
                    callback: (val) => Math.abs(val).toFixed(2) // Show absolute values
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#1f2937",
                    font: {
                        size: 11,
                        weight: "bold"
                    }
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
