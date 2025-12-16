import React from "react";
import happinessData from "../data/happinessData.json";

const KPICards = ({ selectedCountry }) => {
  const countryData = happinessData.find(
    (c) => c.Country.toLowerCase() === selectedCountry.toLowerCase()
  );

  return (
    <div className="kpi-container">
      <div className="kpi-card">
        <h3>Happiness Score</h3>
        <p>{countryData ? countryData.Ladder_score : "N/A"}</p>
      </div>

      <div className="kpi-card">
        <h3>GDP Index</h3>
        <p>{countryData ? countryData.Log_GDP_per_capita : "N/A"}</p>
      </div>

      <div className="kpi-card">
        <h3>Life Expectancy</h3>
        <p>{countryData ? countryData.Healthy_life_expectancy : "N/A"}</p>
      </div>

      <div className="kpi-card">
        <h3>Social Support</h3>
        <p>{countryData ? countryData.Social_support : "N/A"}</p>
      </div>
    </div>
  );
};

export default KPICards;
