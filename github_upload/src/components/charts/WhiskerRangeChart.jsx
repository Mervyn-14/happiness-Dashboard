import React from "react";
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

export default function WhiskerRangeChart({ countryData }) {
    if (!countryData) return null;

    const lower = countryData.lowerwhisker;
    const upper = countryData.upperwhisker;
    const score = countryData.Ladder_score;

    const data = {
        labels: ["Score Range"],
        datasets: [
            {
                label: "Range",
                data: [[lower, upper]], // Floating bar format [start, end]
                backgroundColor: "rgba(139, 92, 246, 0.5)",
                borderColor: "#8b5cf6",
                borderWidth: 1,
                barPercentage: 0.5,
            },
            {
                label: "Actual Score",
                data: [[score - 0.02, score + 0.02]], // Small bar to represent the point
                backgroundColor: "#fb7185",
                borderColor: "#fb7185",
                borderWidth: 1,
                barPercentage: 0.8,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bar
        scales: {
            x: {
                min: Math.floor(lower * 10) / 10 - 0.1,
                max: Math.ceil(upper * 10) / 10 + 0.1,
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                display: false,
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        if (context.datasetIndex === 0) return `Range: ${lower} - ${upper}`;
                        return `Score: ${score}`;
                    }
                }
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 className="card-title">CONFIDENCE INTERVAL</h3>
            <div style={{ flex: 1 }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
