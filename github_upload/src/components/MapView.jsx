import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countriesUrl from "../data/countries.geojson?url";
import happinessData from "../data/happinessData.json";

export default function MapView({ selectedCountry }) {
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    fetch(countriesUrl)
      .then((res) => res.json())
      .then((json) => setCountries(json))
      .catch((err) => console.error("GeoJSON load failed:", err));
  }, []);

  // Color scale like WHR map
  const getColor = (score) => {
    return score >= 7 ? "#6C1E80" :
           score >= 6 ? "#8B3C9E" :
           score >= 5 ? "#A85BBB" :
           score >= 4 ? "#C68CD4" :
           score >= 3 ? "#E2B9EB" :
           score > 0  ? "#F3DDF7" :
                        "#E5E5E5";     // no data
  };

  // Style each country
  const style = (feature) => {
    const countryName = feature.properties.name;

    // match our dataset
    const match = happinessData.find(
      (d) => d.Country.toLowerCase() === countryName.toLowerCase()
    );

    const score = match ? match["Happiness Score"] : null;

    return {
      fillColor: getColor(score),
      color: "#555",
      weight: 0.8,
      fillOpacity: 0.85,
    };
  };

  if (!countries) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading map…
      </div>
    );
  }

  return (
    <div style={{ height: "430px", width: "100%", marginTop: "20px" }}>
      <MapContainer
        key={selectedCountry}
        style={{ height: "100%", width: "100%" }}
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON data={countries} style={style} />
      </MapContainer>
    </div>
  );
}
