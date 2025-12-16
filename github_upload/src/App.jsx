import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ComparisonLayout from "./components/ComparisonLayout";
import happinessData from "./data/happinessData.json";
import "./App.css";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("World (Overall)");
  const [countryData, setCountryData] = useState([]);

  // Comparison Mode State
  const [viewMode, setViewMode] = useState("single"); // 'single' | 'compare'
  const [compareCountryA, setCompareCountryA] = useState(null);
  const [compareCountryB, setCompareCountryB] = useState(null);

  // Calculate World Averages
  const worldData = useMemo(() => {
    const count = happinessData.length;
    const sum = (field) => happinessData.reduce((acc, curr) => acc + (curr[field] || 0), 0);

    return {
      Country: "World (Overall)",
      Rank: "—",
      Ladder_score: (sum("Ladder_score") / count).toFixed(3),
      Log_GDP_per_capita: (sum("Log_GDP_per_capita") / count).toFixed(3),
      Social_support: (sum("Social_support") / count).toFixed(3),
      Healthy_life_expectancy: (sum("Healthy_life_expectancy") / count).toFixed(3),
      Freedom_to_make_life_choices: (sum("Freedom_to_make_life_choices") / count).toFixed(3),
      Generosity: (sum("Generosity") / count).toFixed(3),
      Perceptions_of_corruption: (sum("Perceptions_of_corruption") / count).toFixed(3),
      Dystopia_plus_residual: (sum("Dystopia_plus_residual") / count).toFixed(3),
      upperwhisker: 0,
      lowerwhisker: 0
    };
  }, []);

  // Sort countries alphabetically
  const sortedCountries = useMemo(() => {
    return [...happinessData].sort((a, b) => a.Country.localeCompare(b.Country));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    if (selectedCountry === "World (Overall)") {
      setCountryData([worldData]);
      return;
    }

    const cleanName = selectedCountry.trim().toLowerCase();

    const filtered = happinessData.filter(item => {
      const datasetName = item.Country.trim().toLowerCase();
      return datasetName === cleanName;
    });

    setCountryData(filtered.length > 0 ? filtered : null);
  }, [selectedCountry, worldData]);

  // Lazy load comparison layout (could also just import at top, but let's just keep it simple)
  // We need to import it at the top level

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>World Happiness Analytics Dashboard</h1>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => setViewMode('single')}
          >
            Single View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'compare' ? 'active' : ''}`}
            onClick={() => setViewMode('compare')}
          >
            Compare Mode
          </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <>
          <div className="country-selector">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="World (Overall)">World (Overall)</option>
              {sortedCountries.map((d, i) => (
                <option key={i} value={d.Country}>
                  {d.Country}
                </option>
              ))}
            </select>
          </div>

          <DashboardLayout
            selectedCountry={selectedCountry}
            countryData={countryData}
            allData={happinessData}
            onCountrySelect={setSelectedCountry}
          />
        </>
      ) : (
        <ComparisonLayout
          countryA={compareCountryA}
          countryB={compareCountryB}
          setCountryA={setCompareCountryA}
          setCountryB={setCompareCountryB}
          allData={happinessData}
        />
      )}
    </div>
  );
}
