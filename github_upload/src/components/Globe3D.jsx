import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";

export default function Globe3D({ selectedCountry, onCountrySelect }) {
  const globeRef = useRef(null);

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .showAtmosphere(true)
      .atmosphereColor("#3a7bd5")
      .atmosphereAltitude(0.18)
      .backgroundColor("#020617")
      .width(550)
      .height(550);

    // Load country polygons
    fetch("//unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const countries = Globe().topojson.feature(worldData, worldData.objects.countries).features;

        globe
          .polygonsData(countries)
          .polygonStrokeColor(() => "#111")
          .polygonAltitude(() => 0.02)
          .polygonCapColor((feat) =>
            feat.properties.name === selectedCountry ? "orange" : "#777"
          )
          .onPolygonClick((feat) => {
            onCountrySelect(feat.properties.name);
          });
      });

  }, [selectedCountry]);

  return (
    <div
      ref={globeRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    ></div>
  );
}
