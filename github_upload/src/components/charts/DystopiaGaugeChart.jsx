import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DystopiaGaugeChart({ countryData }) {
    if (!countryData) return null;

    const dystopia = countryData.Dystopia_plus_residual || 0;
    const maxVal = 4; // Approximate max based on data
    const remaining = Math.max(0, maxVal - dystopia);

    const data = {
        labels: ["Dystopia + Residual", "Remaining"],
        datasets: [
            {
                data: [dystopia, remaining],
                backgroundColor: ["#8b5cf6", "#e5e7eb"],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 className="card-title">DYSTOPIA + RESIDUAL</h3>
            <div style={{ flex: 1, width: "100%", position: "relative" }}>
                <Doughnut data={data} options={options} />
                <div style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6" }}>
                        {dystopia.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
