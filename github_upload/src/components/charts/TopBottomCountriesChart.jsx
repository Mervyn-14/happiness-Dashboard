import React, { useMemo } from "react";

export default function TopBottomCountriesChart({ allData }) {
    const { top10, bottom10 } = useMemo(() => {
        if (!allData) return { top10: [], bottom10: [] };

        // Sort by Ladder_score descending
        const sorted = [...allData].sort((a, b) => b.Ladder_score - a.Ladder_score);

        return {
            top10: sorted.slice(0, 10),
            bottom10: sorted.slice(-10).reverse(), // Show bottom 10, lowest last
        };
    }, [allData]);

    const BarRow = ({ country, score, maxScore }) => (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ width: "100px", fontSize: "12px", color: "#4b5563", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {country}
            </div>
            <div style={{ flex: 1, height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", margin: "0 12px" }}>
                <div
                    style={{
                        width: `${(score / maxScore) * 100}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(139, 92, 246, 0.2)"
                    }}
                />
            </div>
            <div style={{ width: "30px", fontSize: "11px", color: "#6b7280", textAlign: "right" }}>
                {score.toFixed(2)}
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "10px" }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
                <h3 style={{ color: "#fb7185", fontSize: "12px", fontWeight: "bold", marginBottom: "10px" }}>TOP 10 HAPPIEST COUNTRIES</h3>
                <div style={{ overflowY: "auto", height: "calc(100% - 25px)" }}>
                    {top10.map(c => (
                        <BarRow key={c.Country} country={c.Country} score={c.Ladder_score} maxScore={8} />
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
                <h3 style={{ color: "#fb7185", fontSize: "12px", fontWeight: "bold", marginBottom: "10px" }}>BOTTOM 10 LEAST HAPPY COUNTRIES</h3>
                <div style={{ overflowY: "auto", height: "calc(100% - 25px)" }}>
                    {bottom10.map(c => (
                        <BarRow key={c.Country} country={c.Country} score={c.Ladder_score} maxScore={8} />
                    ))}
                </div>
            </div>
        </div>
    );
}
