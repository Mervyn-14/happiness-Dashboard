import React from "react";
import { Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SocialSupportVsLifeExpectancyChart({ allData, selectedCountry }) {
    if (!allData || !selectedCountry) return null;

    const data = {
        datasets: [
            {
                label: "Countries",
                data: allData.map((c) => ({
                    x: c.Social_support,
                    y: c.Healthy_life_expectancy,
                    country: c.Country,
                })),
                backgroundColor: "rgba(59, 130, 246, 0.3)", // Blue
                pointRadius: 3,
            },
            {
                label: selectedCountry.Country,
                data: [
                    {
                        x: selectedCountry.Social_support,
                        y: selectedCountry.Healthy_life_expectancy,
                        country: selectedCountry.Country,
                    },
                ],
                backgroundColor: "#fb7185",
                pointRadius: 6,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: true, text: "Social Support", color: "#6b7280" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                title: { display: true, text: "Life Expectancy", color: "#6b7280" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw;
                        return `${point.country}: (${point.x}, ${point.y})`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 className="card-title">SUPPORT vs LIFE EXP.</h3>
            <div style={{ flex: 1 }}>
                <Scatter data={data} options={options} />
            </div>
        </div>
    );
}
