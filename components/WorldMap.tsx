"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { createClient } from "@/lib/supabase/client";
import { translateCountry, isBlockedCountry } from "@/lib/countries";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Pin {
  id?: string;
  destination: string;      // Hebrew display name
  countryId: string;        // TopoJSON numeric/string ID for shape lookup
  year: number;
  lat: number;
  lng: number;
}

interface DBVisitedLocation {
  id?: string;
  country_id?: string;
  destination?: string;
  year?: number;
  lat?: number;
  lng?: number;
}

interface TopologyGeography {
  rsmKey: string;
  id: string;
  properties: { name: string };
  geometry: object;
  type: string;
}

export default function WorldMap() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [geoData, setGeoData] = useState<TopologyGeography[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Form state
  const [formDest, setFormDest] = useState("");            // English key (internal)
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    const { data, error } = await supabase.from("visited_locations").select("*");
    if (error) { console.error("[WorldMap] fetch error:", error.message); return; }
    if (data) {
      const formatted = (data as DBVisitedLocation[])
        .map(row => ({
          id: row.id,
          destination: row.destination ?? translateCountry(row.country_id ?? ""),
          countryId: row.country_id ?? "",
          year: row.year ?? new Date().getFullYear(),
          lat: row.lat ?? 0,
          lng: row.lng ?? 0,
        }))
        .filter(p => p.lat !== 0 && p.lng !== 0);
      setPins(formatted);
    }
  };

  // Click on map → auto-fill form destination
  const handleCountryClick = (geo: TopologyGeography) => {
    if (isBlockedCountry(geo.properties.name)) return;
    setFormDest(geo.properties.name);
    setSuccessMsg("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDest) return;

    if (pins.some(p => p.countryId === formDest)) {
      setSuccessMsg("כבר ביקרתם במדינה הזו!");
      return;
    }

    const geo = geoData.find(g => g.properties.name === formDest);
    if (!geo) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    const centroid = geoCentroid(geo as Parameters<typeof geoCentroid>[0]);
    const lng = centroid[0];
    const lat = centroid[1];
    const hebrewName = translateCountry(formDest);

    const newPin: Pin = {
      destination: hebrewName,
      countryId: formDest,
      year: formYear,
      lat,
      lng,
    };

    // Optimistic UI
    setPins(prev => [...prev, newPin]);

    const { error } = await supabase.from("visited_locations").insert([{
      country_id: formDest,
      destination: hebrewName,
      year: formYear,
      lat,
      lng,
    }]);

    if (error) {
      console.error("[WorldMap] insert error:", error.message);
      setPins(prev => prev.filter(p => p.countryId !== formDest));
      setSuccessMsg("שגיאה בשמירה. אנא נסו שוב.");
    } else {
      setSuccessMsg(`נעצה סיכה על ${hebrewName}!`);
      setFormDest("");
    }

    setIsSubmitting(false);
  };

  // Dropdown: only countries with Hebrew translations, excluding blocked
  const dropdownOptions = geoData
    .map(g => g.properties.name)
    .filter(name => !isBlockedCountry(name))
    .sort((a, b) => translateCountry(a).localeCompare(translateCountry(b), "he"));

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* ── PIN FORM ── */}
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-brand-border/40 p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

        <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-semibold tracking-widest text-brand-gold uppercase mb-2">
              יעד — לחצו על המפה או בחרו מהרשימה
            </label>
            <select
              value={formDest}
              onChange={(e) => setFormDest(e.target.value)}
              required
              className="w-full bg-transparent border-b border-brand-border/60 pb-3 outline-none text-foreground text-sm focus:border-brand-gold transition-colors"
            >
              <option value="" disabled>בחר/י יעד...</option>
              {dropdownOptions.map(name => (
                <option key={name} value={name}>{translateCountry(name)}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-28">
            <label className="block text-[10px] font-semibold tracking-widest text-brand-gold uppercase mb-2">שנה</label>
            <input
              type="number"
              value={formYear}
              onChange={e => setFormYear(Number(e.target.value))}
              min={1950} max={2050}
              required
              className="w-full bg-transparent border-b border-brand-border/60 pb-3 outline-none text-foreground text-center text-sm focus:border-brand-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formDest}
            className="w-full md:w-auto px-8 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold/90 transition-all text-sm tracking-wider font-medium whitespace-nowrap disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? "שומר..." : "📍 נעץ סיכה!"}
          </button>
        </form>

        {successMsg && (
          <p className={`mt-3 text-sm text-center ${successMsg.includes("שגיאה") ? "text-red-500" : "text-brand-gold"}`}>
            {successMsg}
          </p>
        )}
      </div>

      {/* ── WORLD MAP ── */}
      <div className="relative bg-[#F7F7F5] py-8 md:py-12 rounded-[2rem] overflow-hidden shadow-inner border border-brand-border/30" dir="ltr">
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                if (geoData.length === 0 && geographies.length > 0) {
                  setTimeout(() => setGeoData(geographies as TopologyGeography[]), 0);
                }

                return geographies.map((geo) => {
                  const name: string = geo.properties.name;
                  if (isBlockedCountry(name)) return null;

                  const isPinned = pins.some(p => p.countryId === name);
                  const isSelected = formDest === name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo as TopologyGeography)}
                      onMouseEnter={() => {
                        const label = translateCountry(name);
                        const pin = pins.find(p => p.countryId === name);
                        setTooltipContent(pin ? `${label} · ${pin.year}` : label);
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{
                        default: {
                          fill: isPinned ? "rgba(212,175,55,0.3)" : isSelected ? "rgba(212,175,55,0.15)" : "#E5E5E3",
                          outline: "none",
                          stroke: isSelected ? "#D4AF37" : "#FFFFFF",
                          strokeWidth: isSelected ? 1 : 0.5,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        },
                        hover: { fill: "rgba(212,175,55,0.45)", outline: "none", cursor: "pointer" },
                        pressed: { fill: "#D4AF37", outline: "none" },
                      }}
                    />
                  );
                });
              }}
            </Geographies>

            {/* Permanent pins */}
            {pins.map((pin, i) => (
              <Marker
                key={pin.id || i}
                coordinates={[pin.lng, pin.lat]}
                onMouseEnter={(e) => {
                  const rect = (e.target as Element).getBoundingClientRect();
                  setTooltipPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 36 });
                  setTooltipContent(`${pin.destination} · ${pin.year}`);
                }}
                onMouseLeave={() => setTooltipContent("")}
              >
                <circle r={3.5} fill="#D4AF37" stroke="#FFFFFF" strokeWidth={1.5} />
                <circle r={9} fill="rgba(212,175,55,0.3)" className="animate-pulse" />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {tooltipContent && (
          <div
            className="fixed z-50 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-brand-border/50 text-xs font-semibold text-foreground tracking-wide whitespace-nowrap pointer-events-none -translate-x-1/2"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
            dir="rtl"
          >
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Pin count */}
      {pins.length > 0 && (
        <p className="text-center text-xs tracking-widest text-brand-gold/60">
          {pins.length} יעדים שביקרנו בהם יחד
        </p>
      )}
    </div>
  );
}
