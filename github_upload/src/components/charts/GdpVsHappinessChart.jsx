import React, { useMemo } from "react";
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

export default function GdpVsHappinessChart({ allData, selectedCountry }) {
    const chartData = useMemo(() => {
        if (!allData) return null;

        const points = allData.map((d) => ({
            x: d.Log_GDP_per_capita,
            y: d.Ladder_score,
            country: d.Country,
        }));

        const selectedPoint = points.find(p => p.country === selectedCountry?.Country);
        const otherPoints = points.filter(p => p.country !== selectedCountry?.Country);

        return {
            datasets: [
                {
                    label: "Countries",
                    data: otherPoints,
                    backgroundColor: "rgba(139, 92, 246, 0.6)", // Violet-500
                    pointRadius: 3,
                    pointHoverRadius: 5,
                },
                {
                    label: "Selected",
                    data: selectedPoint ? [selectedPoint] : [],
                    backgroundColor: "#fb7185", // Rose-400
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                }
            ],
        };
    }, [allData, selectedCountry]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "GDP VS HAPPINESS SCORE",
                color: "#fb7185",
                font: {
                    size: 12,
                    weight: "bold",
                },
                align: "start",
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw;
                        return `${point.country}: GDP ${point.x}, Score ${point.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Happiness Score",
                    color: "#9ca3af",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
                ticks: { color: "#9ca3af" },
            },
            x: {
                title: {
                    display: true,
                    text: "Log GDP per Capita",
                    color: "#9ca3af",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
                ticks: { color: "#9ca3af" },
            },
        },
    };

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Scatter data={chartData} options={options} />
        </div>
    );
}
