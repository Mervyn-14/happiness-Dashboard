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

export default function ScoreDistributionChart({ allData, selectedCountry }) {
    const chartData = useMemo(() => {
        if (!allData || !selectedCountry) return null;

        // Create bins
        const bins = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const distribution = new Array(bins.length - 1).fill(0);

        allData.forEach(c => {
            const score = c.Ladder_score;
            const binIndex = Math.floor(score);
            if (binIndex >= 0 && binIndex < distribution.length) {
                distribution[binIndex]++;
            }
        });

        const highlightIndex = Math.floor(selectedCountry.Ladder_score);

        const bgColors = distribution.map((_, i) =>
            i === highlightIndex ? "#fb7185" : "rgba(139, 92, 246, 0.5)"
        );

        return {
            labels: bins.slice(0, -1).map(b => `${b}-${b + 1}`),
            datasets: [
                {
                    label: "Countries",
                    data: distribution,
                    backgroundColor: bgColors,
                    borderRadius: 4,
                },
            ],
        };
    }, [allData, selectedCountry]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#6b7280", font: { size: 10 } }
            },
            y: {
                grid: { color: "rgba(0,0,0,0.05)" },
                ticks: { display: false } // Hide count for cleaner look
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    if (!chartData) return null;

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 className="card-title">SCORE DISTRIBUTION</h3>
            <div style={{ flex: 1 }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
