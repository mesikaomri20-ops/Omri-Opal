"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { createClient } from "@/lib/supabase/client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Pin {
  id?: string;
  destination: string;
  year: number;
  lat: number;
  lng: number;
  countryId?: string;
}

interface DBTravel {
  id?: string;
  destination?: string;
  country?: string;
  year?: number;
  lat?: number;
  lng?: number;
  countryId?: string;
}

interface TopologyGeography {
  rsmKey: string;
  id: string;
  properties: {
    name: string;
  };
  geometry: object;
  type: string;
}

export default function WorldMap() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const supabase = createClient();

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    // Attempting to fetch from travels table. Using flexible columns.
    const { data, error } = await supabase.from("travels").select("*");
    if (data) {
      const formattedPins = data.map((row: DBTravel) => ({
        id: row.id,
        destination: row.destination || row.country || "מיקום נבחר",
        year: row.year || new Date().getFullYear(),
        lat: row.lat || 0,
        lng: row.lng || 0,
        countryId: row.countryId || ""
      })).filter((p: Pin) => p.lat !== 0 && p.lng !== 0); // Only keep valid coordinates
      setPins(formattedPins);
    }
  };

  const handleCountryClick = async (geo: TopologyGeography) => {
    const centroid = geoCentroid(geo as Parameters<typeof geoCentroid>[0]);
    const lng = centroid[0];
    const lat = centroid[1];
    const countryName = geo.properties.name;

    // Don't pin if already pinned to avoid stacking identically centered pins
    if (pins.some(p => p.countryId === geo.id)) return;

    const newPin: Pin = {
      destination: countryName,
      year: new Date().getFullYear(),
      lat,
      lng,
      countryId: geo.id
    };

    // Optimistic UI update
    setPins(prev => [...prev, newPin]);

    // Insert into Supabase
    const { error } = await supabase.from("travels").insert([
      { destination: countryName, year: newPin.year, lat, lng, countryId: geo.id }
    ]);

    if (error) {
      console.error("Error saving pin:", error);
      // rollback
      setPins(prev => prev.filter(p => p.countryId !== geo.id));
    }
  };

  return (
    <div className="w-full relative bg-[#FaFaFa] py-12 rounded-3xl overflow-hidden shadow-inner border border-brand-border/30" dir="ltr">
      <ComposableMap 
        projectionConfig={{ scale: 140 }} 
        width={800} 
        height={400} 
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isPinned = pins.some(p => p.countryId === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => {
                        // Could highlight country
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: isPinned ? "rgba(212,175,55,0.2)" : "#EAEAEC",
                        outline: "none",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        transition: "all 0.3s ease",
                      },
                      hover: {
                        fill: "rgba(212,175,55,0.4)",
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#D4AF37",
                        outline: "none",
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Render Pins */}
          {pins.map((pin, i) => (
            <Marker 
              key={pin.id || i} 
              coordinates={[pin.lng, pin.lat]}
              onMouseEnter={(e) => {
                const rect = (e.target as Element).getBoundingClientRect();
                setTooltipPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 30 });
                setTooltipContent(`${pin.destination} · ${pin.year}`);
              }}
              onMouseLeave={() => setTooltipContent("")}
            >
              <circle r={3} fill="#D4AF37" stroke="#FFFFFF" strokeWidth={1} />
              <circle r={8} fill="rgba(212,175,55,0.4)" className="animate-pulse" />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div 
          className="fixed z-50 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-brand-border text-xs font-medium text-foreground tracking-widest whitespace-nowrap pointer-events-none transform -translate-x-1/2"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          dir="rtl"
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
