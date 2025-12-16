import React, { useState } from "react";
import ComparisonRadarChart from "./charts/ComparisonRadarChart";
import ComparisonBarChart from "./charts/ComparisonBarChart";
import ComparisonInsights from "./ComparisonInsights";
import ScoreDifferenceChart from "./charts/ScoreDifferenceChart";
import GlobeView from "./GlobeView";

export default function ComparisonLayout({
    countryA,
    countryB,
    allData,
    setCountryA,
    setCountryB
}) {
    const [activeSlot, setActiveSlot] = useState('A'); // 'A' or 'B'

    // Helper to get country object from name
    const getCountryData = (name) => {
        if (!name) return null;
        const clean = name.trim().toLowerCase();
        return allData.find(c => c.Country.trim().toLowerCase() === clean);
    };

    const dataA = getCountryData(countryA);
    const dataB = getCountryData(countryB);

    // Sort countries for dropdown
    const sortedCountries = [...allData].sort((a, b) => a.Country.localeCompare(b.Country));

    const handleGlobeSelect = (countryName) => {
        if (!countryName) return;
        if (activeSlot === 'A') {
            setCountryA(countryName);
            setActiveSlot('B'); // Auto-switch to B
        } else {
            setCountryB(countryName);
        }
    };

    const handleReset = () => {
        setCountryA(null);
        setCountryB(null);
        setActiveSlot('A');
    };

    const isReady = countryA && countryB;

    return (
        <div className="comparison-container">
            {/* 1. Globe Background */}
            <div className="globe-background">
                <GlobeView
                    onCountrySelect={handleGlobeSelect}
                    selectedCountry={activeSlot === 'A' ? countryA : countryB}
                    triggerZoom={false}
                />
            </div>

            {/* SELECTION INSTRUCTION OVERLAY */}
            {!isReady && (
                <div className="selection-instruction">
                    <h2>Select {activeSlot === 'A' ? "First" : "Second"} Country</h2>
                    <p>Click on the globe to choose {activeSlot === 'A' ? "Country A" : "Country B"}</p>
                </div>
            )}

            {/* 2. Top Right Selectors (Fixed) */}
            <div className="comparison-controls">
                <div
                    className={`control-group ${activeSlot === 'A' ? 'active' : ''}`}
                    onClick={() => setActiveSlot('A')}
                >
                    <label>Country A</label>
                    <select
                        value={countryA || ""}
                        onChange={(e) => {
                            setCountryA(e.target.value);
                            setActiveSlot('B');
                        }}
                        className="control-select"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="" disabled>Select Country</option>
                        {sortedCountries.map((c, i) => (
                            <option key={`a-${i}`} value={c.Country}>{c.Country}</option>
                        ))}
                    </select>
                </div>

                <div className="vs-badge-small">VS</div>

                <div
                    className={`control-group ${activeSlot === 'B' ? 'active' : ''}`}
                    onClick={() => setActiveSlot('B')}
                >
                    <label>Country B</label>
                    <select
                        value={countryB || ""}
                        onChange={(e) => setCountryB(e.target.value)}
                        className="control-select"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="" disabled>Select Country</option>
                        {sortedCountries.map((c, i) => (
                            <option key={`b-${i}`} value={c.Country}>{c.Country}</option>
                        ))}
                    </select>
                </div>

                {(countryA || countryB) && (
                    <button
                        className="control-reset-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        title="Reset Comparison"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* 3. Scrollable Content Overlay - ONLY IF READY */}
            {isReady && dataA && dataB && (
                <div className="comparison-content-overlay">
                    <button
                        className="dashboard-close-btn"
                        onClick={handleReset}
                        title="Close Comparison"
                    >
                        ✕ Close Comparison
                    </button>

                    {/* INSIGHTS SECTION */}
                    <ComparisonInsights countryA={dataA} countryB={dataB} />

                    {/* Head-to-Head Cards */}
                    <div className="head-to-head-grid">
                        {/* Score Comparison */}
                        <div className="h2h-card">
                            <h3>Happiness Score</h3>
                            <div className="h2h-row">
                                <span className="val-a">{dataA?.Ladder_score}</span>
                                <div className="bar-container">
                                    <div className="bar-bg">
                                        <div className="bar-fill-a" style={{ width: `${(dataA?.Ladder_score / 8) * 100}%` }}></div>
                                    </div>
                                    <div className="bar-bg">
                                        <div className="bar-fill-b" style={{ width: `${(dataB?.Ladder_score / 8) * 100}%` }}></div>
                                    </div>
                                </div>
                                <span className="val-b">{dataB?.Ladder_score}</span>
                            </div>
                        </div>

                        {/* Rank Comparison */}
                        <div className="h2h-card">
                            <h3>Global Rank</h3>
                            <div className="h2h-row">
                                <span className="val-a">#{dataA?.Rank}</span>
                                <span className="vs-small">vs</span>
                                <span className="val-b">#{dataB?.Rank}</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="comparison-charts-grid">
                        <div className="comp-chart-card trend-comp">
                            <ComparisonRadarChart countryA={dataA} countryB={dataB} />
                        </div>
                        <div className="comp-chart-card bar-comp">
                            <ScoreDifferenceChart countryA={dataA} countryB={dataB} />
                        </div>
                        <div className="comp-chart-card full-width-comp">
                            <ComparisonBarChart countryA={dataA} countryB={dataB} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
