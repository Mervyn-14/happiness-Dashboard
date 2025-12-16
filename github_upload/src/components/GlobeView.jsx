import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import { feature } from "topojson-client";
import { countryFixMap } from "../data/countryMap";

export default function GlobeView({ onCountrySelect, selectedCountry, triggerZoom }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const selectedPolygonRef = useRef(null);
  const worldInstance = useRef(null);

  const selectedCountryRef = useRef(selectedCountry);
  const onCountrySelectRef = useRef(onCountrySelect);

  useEffect(() => {
    onCountrySelectRef.current = onCountrySelect;
  }, [onCountrySelect]);

  useEffect(() => {
    selectedCountryRef.current = selectedCountry;

    // If selectedCountry changes (and is not null), find the polygon to zoom to
    if (worldInstance.current) {
      const world = worldInstance.current;
      const polygons = world.polygonsData();

      // Find the polygon object
      let found = null;
      if (selectedCountry) {
        found = polygons.find(p => {
          const rawName = p.properties.name;
          const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;
          return cleanName === selectedCountry;
        });
      }

      if (found) {
        selectedPolygonRef.current = found;
      }

      // Update styling to highlight selected country
      world.polygonCapColor((d) => {
        const rawName = d.properties.name;
        const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;
        const isSelected = cleanName && cleanName === selectedCountry;
        return isSelected ? "rgba(0,255,180,0.65)" : "rgba(30,144,255,0.35)";
      });

      world.polygonAltitude((d) => {
        const rawName = d.properties.name;
        const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;
        const isSelected = cleanName && cleanName === selectedCountry;
        return isSelected ? 0.08 : 0.01;
      });

      // Force a re-render of the polygons to ensure color update is applied immediately
      world.polygonsData([...polygons]);
    }
  }, [selectedCountry]);

  // Handle Delayed Zoom Trigger
  useEffect(() => {
    if (triggerZoom && selectedPolygonRef.current && worldInstance.current) {
      const polygon = selectedPolygonRef.current;

      // Calculate centroid
      let centroidLat = 0, centroidLng = 0, pointCount = 0;

      const processCoords = (coords) => {
        coords.forEach(coord => {
          centroidLng += coord[0];
          centroidLat += coord[1];
          pointCount++;
        });
      };

      if (polygon.geometry.type === 'Polygon') {
        processCoords(polygon.geometry.coordinates[0]);
      } else if (polygon.geometry.type === 'MultiPolygon') {
        polygon.geometry.coordinates.forEach(poly => {
          processCoords(poly[0]);
        });
      }

      if (pointCount > 0) {
        centroidLat /= pointCount;
        centroidLng /= pointCount;
      }

      // Perform the zoom
      worldInstance.current.pointOfView({ lat: centroidLat, lng: centroidLng, altitude: 0.5 }, 1500);
    }
  }, [triggerZoom]);

  // Initialize Globe only once
  useEffect(() => {
    if (globeRef.current.world) return; // Already initialized

    // Initialize Globe
    const world = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      .showAtmosphere(true)
      .atmosphereColor("#3a7bd5")
      .atmosphereAltitude(0.25)
      .polygonCapColor(() => "rgba(30,144,255,0.35)")
      .polygonSideColor(() => "rgba(0,0,0,0.1)")
      .polygonStrokeColor(() => "rgba(0,150,255,0.8)")
      .polygonLabel(({ properties }) => `
        <div style="
          padding: 6px; 
          color: white; 
          font-size: 14px; 
          background: rgba(0,0,0,0.7);
          border-radius: 6px;">
          ${properties.name}
        </div>
      `)
      .polygonsTransitionDuration(300);

    // Store world instance
    globeRef.current.world = world;
    worldInstance.current = world;

    // Initial Controls Settings
    const controls = world.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.56; // Increased by 40% from 0.4
    controls.enableZoom = true;
    controls.dampingFactor = 0.1; // Smooth out controls
    controls.enableDamping = true;

    // Function to update dimensions
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        world.width(clientWidth);
        world.height(clientHeight);
        // Center view initially
        world.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
      }
    };

    // Initial size
    updateSize();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateSize); // Debounce/Sync with frame
    });
    resizeObserver.observe(containerRef.current);

    // Load world map
    fetch("//unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((topology) => {
        const countries = feature(topology, topology.objects.countries).features;

        world.polygonsData(countries);

        // Hover glow effect
        world.onPolygonHover((polygon) => {
          // If a country is selected, we want to maintain its highlight
          // But we can also show hover for other countries if desired.
          // The user wants the selected country to STAY floating green.

          world.polygonAltitude((d) => {
            const rawName = d.properties.name;
            const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;
            const isSelected = cleanName && cleanName === selectedCountryRef.current;

            if (isSelected) return 0.08; // Always keep selected country raised
            return d === polygon ? 0.08 : 0.01; // Hover effect for others
          });

          world.polygonCapColor((d) => {
            const rawName = d.properties.name;
            const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;
            const isSelected = cleanName && cleanName === selectedCountryRef.current;

            if (isSelected) return "rgba(0,255,180,0.65)"; // Always keep selected country green
            return d === polygon ? "rgba(0,255,180,0.65)" : "rgba(30,144,255,0.35)"; // Hover effect for others
          });

          // Pause rotation on hover
          const c = world.controls();
          if (c) {
            if (polygon) {
              c.autoRotate = false;
            } else {
              // Resume only if no country is selected
              if (!selectedCountryRef.current) {
                c.autoRotate = true;
                c.autoRotateSpeed = 0.56;
              }
            }
          }
        });

        // CLICK event → Focus and Select
        world.onPolygonClick((polygon) => {
          const rawName = polygon.properties.name;
          const cleanName = countryFixMap[rawName] !== undefined ? countryFixMap[rawName] : rawName;

          if (cleanName) {
            selectedPolygonRef.current = polygon;

            // Stop rotation immediately on click
            const c = world.controls();
            c.autoRotate = false;

            // Notify parent of selection (starts flag transition)
            // NOTE: We do NOT zoom here anymore. Zoom happens when triggerZoom prop changes.
            if (onCountrySelectRef.current) {
              onCountrySelectRef.current(cleanName);
            }
            setIsFocused(true);
          }
        });
      });

    return () => {
      resizeObserver.disconnect();
      // Clean up if necessary, but usually Globe instance cleanup is complex
    };
  }, []); // Run once on mount

  // Handle Rotation State based on selectedCountry
  useEffect(() => {
    if (worldInstance.current) {
      const controls = worldInstance.current.controls();
      if (controls) {
        if (!selectedCountry) {
          // Resume rotation and zoom out
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.56; // Enforce speed every time we resume

          // Zoom out to default view
          worldInstance.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1500);
        } else {
          // Stop rotation
          controls.autoRotate = false;
        }
      }
    }
  }, [selectedCountry]);

  // Handle Esc key to reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFocused(false);
        if (worldInstance.current) {
          const world = worldInstance.current;
          world.controls().autoRotate = true;
          // Reset view to default
          world.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <div className="globe-container" ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div ref={globeRef} /></div>;
}
