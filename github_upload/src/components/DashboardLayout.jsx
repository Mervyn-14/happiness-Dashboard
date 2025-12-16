import React, { useState, useEffect, useRef } from "react";
import GlobalTrendChart from "./charts/GlobalTrendChart";
import ScoreDecompositionChart from "./charts/ScoreDecompositionChart";
import GdpVsHappinessChart from "./charts/GdpVsHappinessChart";
import ScoreCompositionChart from "./charts/ScoreCompositionChart";
import TopBottomCountriesChart from "./charts/TopBottomCountriesChart";
import FactorRadarChart from "./charts/FactorRadarChart";
import GenerosityVsGdpChart from "./charts/GenerosityVsGdpChart";
import FreedomVsCorruptionChart from "./charts/FreedomVsCorruptionChart";
import SocialSupportVsLifeExpectancyChart from "./charts/SocialSupportVsLifeExpectancyChart";
import ScoreDistributionChart from "./charts/ScoreDistributionChart";
import GlobeView from "./GlobeView";
import FlagTransition from "./FlagTransition";
import { isoMap } from "../data/isoMap";

export default function DashboardLayout({
    selectedCountry,
    countryData,
    allData,
    onCountrySelect,
}) {
    const currentData = countryData?.[0];
    const [showModal, setShowModal] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionCountry, setTransitionCountry] = useState(null);
    const [triggerZoom, setTriggerZoom] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Track previous selection to prevent double-firing
    const prevSelectedCountry = useRef(null);

    // Handle country selection from Globe (just propagate to App)
    const handleCountrySelect = (countryName) => {
        onCountrySelect(countryName);
    };

    // React to selectedCountry changes (from Dropdown OR Globe)
    useEffect(() => {
        // If selection hasn't changed, do nothing
        if (selectedCountry === prevSelectedCountry.current) return;
        prevSelectedCountry.current = selectedCountry;

        if (!selectedCountry) {
            // Reset state if cleared
            setTransitionCountry(null);
            setTriggerZoom(false);
            return;
        }

        if (selectedCountry === "World (Overall)") {
            // Show modal immediately for World
            setShowModal(true);
            setTransitionCountry(null); // No flag transition
        } else {
            // Start transition for regular country
            setTransitionCountry(selectedCountry);
            setIsTransitioning(true);
            setTriggerZoom(false);
            setShowModal(false); // Ensure modal is closed initially
            setIsClosing(false);
        }
    }, [selectedCountry]);

    const handleTransitionComplete = () => {
        setIsTransitioning(false);
        // Flag is gone, now trigger zoom
        setTriggerZoom(true);

        // Show modal after zoom animation (approx 1.5s)
        setTimeout(() => {
            setShowModal(true);
        }, 1500);
    };

    // Close modal handler
    const closeModal = () => {
        setIsClosing(true);

        // Start globe zoom out IMMEDIATELY when closing starts
        // But only if we are not in "World" view (which doesn't zoom in)
        if (selectedCountry !== "World (Overall)") {
            // We trigger zoom out by clearing the selection in the GlobeView via props
            // But we can't clear 'selectedCountry' prop yet or the modal content disappears
            // So we rely on the fact that when we eventually clear it, the globe will zoom out.
            // Actually, to zoom out WHILE closing, we might need to signal GlobeView.
            // But GlobeView zooms out when selectedCountry becomes null.
            // If we wait to clear selectedCountry, zoom out happens after modal closes.
            // To fix this, we can set triggerZoom to false? No, that's for zoom IN.

            // For now, let's stick to the previous behavior:
            // We clear the selection at the END of the animation.
            // If we want zoom out DURING animation, we'd need to tell GlobeView to zoom out 
            // while keeping selectedCountry (for the modal).
            // That's complex. Let's stick to the robust flow: Close Modal -> Then Zoom Out.
            // It looks cleaner than a glitchy simultaneous move.
        }

        // Wait for animation to finish before hiding modal from DOM
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
            onCountrySelect(null); // Clear selection in App -> triggers Globe zoom out
        }, 800); // Match CSS animation duration
    };

    // Auto-open modal if World is selected initially (e.g. on load)
    useEffect(() => {
        if (selectedCountry === "World (Overall)" && !showModal) {
            setShowModal(true);
        }
    }, [selectedCountry]);

    return (
        <>
            {/* TRANSITION OVERLAY */}
            {isTransitioning && transitionCountry && isoMap[transitionCountry] && (
                <FlagTransition
                    countryName={transitionCountry}
                    isoCode={isoMap[transitionCountry]}
                    onComplete={handleTransitionComplete}
                />
            )}

            {/* TOP SECTION: GLOBE */}
            <div className="globe-section full-height">
                <div className="globe-wrapper">
                    <GlobeView
                        onCountrySelect={handleCountrySelect}
                        selectedCountry={selectedCountry}
                        triggerZoom={triggerZoom}
                    />
                </div>

                {/* OVERLAY KPIs */}
                <div className={`kpi-overlay ${showModal ? 'hidden' : ''}`}>
                    <div className="kpi-card">
                        <h3>Happiness Score</h3>
                        <p className="updated">{currentData?.Ladder_score ?? "N/A"}</p>
                    </div>
                    <div className="kpi-card">
                        <h3>Global Rank</h3>
                        <p className="rank">#{currentData?.Rank ?? "N/A"}</p>
                    </div>
                    <div className="kpi-card">
                        <h3>GDP Index</h3>
                        <p>{currentData?.Log_GDP_per_capita ?? "N/A"}</p>
                    </div>
                    <div className="kpi-card">
                        <h3>Life Expectancy</h3>
                        <p>{currentData?.Healthy_life_expectancy ?? "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* MODAL FOR CHARTS */}
            {showModal && currentData && !isTransitioning && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedCountry} Analytics</h2>
                            <span className="modal-rank">Rank #{currentData?.Rank}</span>
                        </div>

                        <div className="charts-grid">
                            <div className="card trend-card">
                                <GlobalTrendChart countryData={currentData} />
                            </div>
                            <div className="card decomposition-card">
                                <ScoreDecompositionChart countryData={currentData} />
                            </div>
                            <div className="card scatter-card">
                                <GdpVsHappinessChart allData={allData} selectedCountry={currentData} />
                            </div>

                            <div className="card composition-card">
                                <ScoreCompositionChart countryData={currentData} />
                            </div>

                            <div className="card radar-card">
                                <FactorRadarChart countryData={currentData} allData={allData} />
                            </div>

                            {/* NEW CHARTS */}
                            <div className="card gen-gdp-card">
                                <GenerosityVsGdpChart allData={allData} selectedCountry={currentData} />
                            </div>
                            <div className="card free-corr-card">
                                <FreedomVsCorruptionChart allData={allData} selectedCountry={currentData} />
                            </div>
                            <div className="card sup-life-card">
                                <SocialSupportVsLifeExpectancyChart allData={allData} selectedCountry={currentData} />
                            </div>
                            <div className="card dist-card">
                                <ScoreDistributionChart allData={allData} selectedCountry={currentData} />
                            </div>

                            <div className="card list-card">
                                <TopBottomCountriesChart allData={allData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
