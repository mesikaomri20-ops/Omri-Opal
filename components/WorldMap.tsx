"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { createClient } from "@/lib/supabase/client";
import { translateCountry } from "@/lib/countries";

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
  
  const [geoData, setGeoData] = useState<TopologyGeography[]>([]);
  const [formDest, setFormDest] = useState("");
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    const { data, error } = await supabase.from("travels").select("*");
    if (data) {
      const formattedPins = data.map((row: DBTravel) => ({
        id: row.id,
        destination: row.destination || row.country || "יעד לא ידוע",
        year: row.year || new Date().getFullYear(),
        lat: row.lat || 0,
        lng: row.lng || 0,
        countryId: row.countryId || ""
      })).filter((p: Pin) => p.lat !== 0 && p.lng !== 0);
      setPins(formattedPins);
    }
  };

  const handleCountryClick = (geo: TopologyGeography) => {
    // Auto-fill the form destination instead of auto-pinning immediately
    // This allows the user to verify the location and set the year.
    setFormDest(geo.properties.name);
    // Smooth scroll back to form could be added here if needed
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDest) return;

    const geo = geoData.find(g => g.properties.name === formDest);
    if (!geo) return;

    // Prevent duplicates to the identical country to keep pins clean
    if (pins.some(p => p.countryId === geo.id)) {
      alert("כבר סימנתם את היעד הזה!");
      return;
    }

    setIsSubmitting(true);

    const centroid = geoCentroid(geo as Parameters<typeof geoCentroid>[0]);
    const lng = centroid[0];
    const lat = centroid[1];
    const newPin: Pin = {
      destination: formDest,
      year: formYear,
      lat,
      lng,
      countryId: geo.id
    };

    // Optimistic UI update
    setPins(prev => [...prev, newPin]);

    // DB Insert
    const { error } = await supabase.from("travels").insert([
      { destination: formDest, year: formYear, lat, lng, countryId: geo.id }
    ]);

    if (error) {
      console.error("Error saving pin:", error);
      setPins(prev => prev.filter(p => p.countryId !== geo.id));
    } else {
      // Complete! Reset Destination field to let them pick more.
      setFormDest("");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in" dir="rtl">
      {/* Input Form Section */}
      <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-brand-border/40 p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"/>
        
        <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2">יעד (לחצו על המפה)</label>
            <select 
              value={formDest} 
              onChange={(e) => setFormDest(e.target.value)}
              className="w-full bg-transparent border-b border-brand-border/60 pb-3 outline-none text-foreground text-sm md:text-base focus:border-brand-gold transition-colors"
              required
            >
              <option value="" disabled>בחר/י יעד מהרשימה או מהמפה...</option>
              {geoData
                .map(g => g.properties.name)
                .sort((a,b) => translateCountry(a).localeCompare(translateCountry(b), 'he'))
                .map(name => (
                  <option key={name} value={name}>{translateCountry(name)}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-32">
             <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2">שנה</label>
             <input 
                type="number" 
                value={formYear} 
                onChange={e => setFormYear(Number(e.target.value))} 
                min={1950} max={2050}
                className="w-full bg-transparent border-b border-brand-border/60 pb-3 outline-none text-foreground text-center text-sm md:text-base focus:border-brand-gold transition-colors"
                required 
              />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !formDest} 
            className="w-full md:w-auto px-8 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold/90 transition-all font-medium text-sm tracking-wider whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "שומר..." : "נעץ סיכה!"}
          </button>
        </form>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-[#FaFaFa] py-8 md:py-12 rounded-[2rem] overflow-hidden shadow-inner border border-brand-border/30" dir="ltr">
        <ComposableMap 
          projectionConfig={{ scale: 140 }} 
          width={800} 
          height={400} 
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                // Safely capture topology state for dropdown list without render loop issues
                if (geoData.length === 0 && geographies.length > 0) {
                  setTimeout(() => setGeoData(geographies as TopologyGeography[]), 0);
                }

                return geographies.map((geo) => {
                  const isPinned = pins.some(p => p.countryId === geo.id);
                  const isSelected = formDest === geo.properties.name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo as TopologyGeography)}
                      onMouseEnter={() => {
                        if (!isPinned) setTooltipContent(translateCountry(geo.properties.name));
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{
                        default: {
                          fill: isPinned ? "rgba(212,175,55,0.25)" : isSelected ? "rgba(212,175,55,0.1)" : "#EAEAEC",
                          outline: "none",
                          stroke: isSelected ? "#D4AF37" : "#FFFFFF",
                          strokeWidth: isSelected ? 1 : 0.5,
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
                });
              }}
            </Geographies>

            {/* Placed Pins */}
            {pins.map((pin, i) => (
              <Marker 
                key={pin.id || i} 
                coordinates={[pin.lng, pin.lat]}
                onMouseEnter={(e) => {
                  const rect = (e.target as Element).getBoundingClientRect();
                  setTooltipPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 30 });
                  setTooltipContent(`${translateCountry(pin.destination)} · ${pin.year}`);
                }}
                onMouseLeave={() => setTooltipContent("")}
              >
                <circle r={3} fill="#D4AF37" stroke="#FFFFFF" strokeWidth={1} />
                <circle r={8} fill="rgba(212,175,55,0.4)" className="animate-pulse" />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Global Floating Tooltip */}
        {tooltipContent && (
          <div 
            className="fixed z-50 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-brand-border/50 text-xs font-semibold text-foreground tracking-widest whitespace-nowrap pointer-events-none transform -translate-x-1/2"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
            dir="rtl"
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </div>
  );
}
