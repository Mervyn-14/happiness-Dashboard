import React, { useMemo } from "react";

export default function ComparisonInsights({ countryA, countryB }) {
    const insights = useMemo(() => {
        if (!countryA || !countryB) return [];

        const notes = [];

        // 1. Overall Winner
        const scoreDiff = countryA.Ladder_score - countryB.Ladder_score;
        const winner = scoreDiff > 0 ? countryA : countryB;
        const loser = scoreDiff > 0 ? countryB : countryA;
        const diffVal = Math.abs(scoreDiff).toFixed(2);

        notes.push({
            type: "winner",
            text: `${winner.Country} ranks #${winner.Rank}, scoring ${diffVal} points higher than ${loser.Country}.`
        });

        // 2. Factor Analysis
        // Factors to check
        const factors = [
            { key: "Log_GDP_per_capita", label: "GDP per Capita", weight: 1 },
            { key: "Social_support", label: "Social Support", weight: 1 },
            { key: "Healthy_life_expectancy", label: "Life Expectancy", weight: 1 },
            { key: "Freedom_to_make_life_choices", label: "Freedom", weight: 1 },
            { key: "Generosity", label: "Generosity", weight: 1 },
            { key: "Perceptions_of_corruption", label: "Absence of Corruption", weight: 1 }, // Higher is usually better in this dataset? No, usually lower is better but dataset might invert it? 
            // In happiness report, "Perceptions of corruption" is usually subtracted or negatively correlated, BUT in the "explained by" values (which these likely are), higher = "explained by absence of corruption" = better.
        ];

        let maxAdvantage = { key: "", val: 0, country: null };

        factors.forEach(f => {
            const valA = countryA[f.key] || 0;
            const valB = countryB[f.key] || 0;
            const diff = valA - valB;

            // Check for significant advantage (> 10% relative diff approx, roughly > 0.1 in value)
            if (Math.abs(diff) > 0.1) {
                const leader = diff > 0 ? countryA.Country : countryB.Country;

                // Track max advantage
                if (Math.abs(diff) > maxAdvantage.val) {
                    maxAdvantage = { key: f.label, val: Math.abs(diff), country: leader };
                }
            }
        });

        if (maxAdvantage.country) {
            notes.push({
                type: "highlight",
                text: `${maxAdvantage.country} has a significant lead in ${maxAdvantage.key}.`
            });
        } else {
            notes.push({
                type: "highlight",
                text: "Both countries have very similar profiles across most factors."
            });
        }

        return notes;
    }, [countryA, countryB]);

    if (!countryA || !countryB) return null;

    return (
        <div className="insights-card">
            <h3>Smart Insights</h3>
            <div className="insights-list">
                {insights.map((note, i) => (
                    <div key={i} className={`insight-item ${note.type}`}>
                        <div className="insight-icon">
                            {note.type === 'winner' ? '🏆' : '💡'}
                        </div>
                        <p>{note.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
