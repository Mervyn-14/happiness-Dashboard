import React from "react";

export default function CountrySelector({ selectedCountry, setSelectedCountry }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          width: "200px",
        }}
      >
        <option value="Finland">Finland</option>
        <option value="Norway">Norway</option>
        <option value="Denmark">Denmark</option>
        <option value="Iceland">Iceland</option>
        <option value="Netherlands">Netherlands</option>
        <option value="Brazil">Brazil</option>
        <option value="India">India</option>
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
      </select>
    </div>
  );
}
