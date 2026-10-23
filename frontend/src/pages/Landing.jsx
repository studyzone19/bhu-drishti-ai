import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CloudRain,
  Map,
  MapPinned,
  Radio,
  Satellite,
  ShieldAlert,
  Search,
  Menu,
  Droplets,
  Thermometer,
  Wind,
  Cloud,
  Mountain,
  Activity,
  MapPin,
  Clock,
  PersonStanding,
  ChevronRight,
  AlertTriangle,
  Languages
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../translations.js";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line 
} from "recharts";
import api from "../services/api.js";
import RiskBadge from "../components/RiskBadge.jsx";
import RiskMapView from "../maps/RiskMapView.jsx";
import MiniSatelliteView from "../maps/MiniSatelliteView.jsx";

const rainfallData = [
  { time: "12AM", val: 20 }, { time: "4AM", val: 40 }, 
  { time: "8AM", val: 30 }, { time: "12PM", val: 60 }, 
  { time: "4PM", val: 50 }, { time: "8PM", val: 80 }, { time: "12AM", val: 94 }
];

const movementData = [
  { time: "12AM", val: 2 }, { time: "4AM", val: 3 }, 
  { time: "8AM", val: 5 }, { time: "12PM", val: 4 }, 
  { time: "4PM", val: 10 }, { time: "8PM", val: 14 }, { time: "12AM", val: 18 }
];

const riskData = [
  { time: "12AM", val: 10 }, { time: "4AM", val: 15 }, 
  { time: "8AM", val: 20 }, { time: "12PM", val: 40 }, 
  { time: "4PM", val: 60 }, { time: "8PM", val: 75 }, { time: "12AM", val: 90 }
];

export default function Landing() {
  const { lang, toggle } = useLanguage();
  const t = translations[lang];

  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [topZones, setTopZones] = useState([]);
  const [publicSummary, setPublicSummary] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [blockedRoads, setBlockedRoads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);


  const defaultRoads = [
    { id: "nh6", name: 'NH-6 (Meghalaya)', status: 'At Risk', reason: 'High Soil Moisture Detected', positions: [[25.5, 91.8]] },
    { id: "nh10", name: 'NH-10 (Sikkim)', status: 'Open', reason: 'Stable Terrain', positions: [[26.7, 88.4]] },
    { id: "nh2", name: 'NH-2 (Nagaland)', status: 'Blocked', reason: 'Landslide Debris Cleared', positions: [[25.6, 94.1]] },
    { id: "nh29", name: 'NH-29 (Assam)', status: 'Open', reason: 'Normal Operations', positions: [[25.8, 93.7]] },
    { id: "nh44", name: 'NH-44 (Tripura)', status: 'At Risk', reason: 'Heavy Rainfall Warning', positions: [[23.8, 91.2]] }
  ];

  const [tickerIndex, setTickerIndex] = useState(0);
  const [userLocked, setUserLocked] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyZone, setEmergencyZone] = useState(null);

  // Helper: trigger alert if zone risk >= 70
  const triggerAlertIfHighRisk = (zone) => {
    if (zone && zone.riskScore >= 70) {
      setEmergencyZone(zone);
      setShowEmergencyAlert(true);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
        },
        (err) => {
          console.log("Geolocation error:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && zones.length > 0 && !userLocked) {
      // Find nearest zone
      let minDiff = Infinity;
      let closest = zones[0];
      for (let z of zones) {
        if (!z.latitude || !z.longitude) continue;
        const diff = Math.abs(z.latitude - userLocation[0]) + Math.abs(z.longitude - userLocation[1]);
        if (diff < minDiff) {
          minDiff = diff;
          closest = z;
        }
      }
      
      setSelectedZone(closest);
      setUserLocked(true);
      
      // Show alert if risk score >= 70
      triggerAlertIfHighRisk(closest);
    }
  }, [userLocation, zones, userLocked]);

  useEffect(() => {
    if (userLocked) return;
    const interval = window.setInterval(() => {
      setTickerIndex(prev => (prev + 1) % (blockedRoads.length > 0 ? blockedRoads.length : defaultRoads.length));
    }, 2500);
    return () => window.clearInterval(interval);
  }, [blockedRoads, userLocked]);

  
  useEffect(() => {
    const loadRoads = () => {
      const saved = localStorage.getItem('Bhu-Drishti_blocked_roads');
      if (saved) setBlockedRoads(JSON.parse(saved));
    };
    loadRoads();
    window.addEventListener('storage', loadRoads);
    window.addEventListener('roads_updated', loadRoads);
    return () => {
      window.removeEventListener('storage', loadRoads);
      window.removeEventListener('roads_updated', loadRoads);
    }
  }, []);
  
  useEffect(() => {
    if (showEmergencyAlert && emergencyZone) {
      const interval = setInterval(() => {
        setEmergencyZone(prev => {
          if (!prev) return prev;
          let newScore = prev.riskScore + (Math.random() * 6 - 3);
          newScore = Math.min(99, Math.max(60, newScore));
          
          let newSoil = (prev.soilMoisture || 58) + (Math.random() * 2 - 1);
          newSoil = Math.min(100, Math.max(40, newSoil));
          
          let newRain = (prev.rainfall24h || 55) + (Math.random() * 5 - 2);
          newRain = Math.max(0, newRain);

          return {
            ...prev,
            riskScore: parseFloat(newScore.toFixed(1)),
            soilMoisture: parseFloat(newSoil.toFixed(1)),
            rainfall24h: parseFloat(newRain.toFixed(1))
          };
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [showEmergencyAlert]);

  useEffect(() => {
    if (showEmergencyAlert && emergencyZone?.riskScore > 75) {
      const playAudio = () => {
        const audio = document.getElementById('emergency-siren');
        if (audio) {
          audio.play().catch(e => console.log('Autoplay blocked:', e));
        }
      };
      
      playAudio();
      const interval = setInterval(playAudio, 1000);
      setTimeout(() => clearInterval(interval), 5000);
      return () => clearInterval(interval);
    } else {
      // stop if score drops below 75
      const audio = document.getElementById('emergency-siren');
      if (audio) { audio.pause(); audio.currentTime = 0; }
    }
  }, [showEmergencyAlert, emergencyZone?.riskScore]);
  


  
  // NOTE: useMemo must come before other derived variables (Rules of Hooks)
  const nearestRoad = React.useMemo(() => {
    if (!selectedZone) return null;
    const roadsToSearch = blockedRoads.length > 0 ? blockedRoads : defaultRoads;
    if (!roadsToSearch.length) return null;
    let minDiff = Infinity;
    let closest = roadsToSearch[0];
    for (let r of roadsToSearch) {
      if (!r.positions) return roadsToSearch[0]; // fallback
      const pLat = r.positions[0][0];
      const pLng = r.positions[0][1];
      const diff = Math.abs(pLat - selectedZone.latitude) + Math.abs(pLng - selectedZone.longitude);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    return closest;
  }, [selectedZone, blockedRoads]);

  // Safe derived variables (not hooks)
  const activeRoadList = blockedRoads.length > 0 ? blockedRoads : defaultRoads;
  const currentTickerRoad = activeRoadList[tickerIndex % activeRoadList.length] || activeRoadList[0];
  const displayRoad = (userLocked && nearestRoad) ? nearestRoad : currentTickerRoad;



  useEffect(() => {
    api.get("/risk-zones").then((res) => {
      const allZones = res.data.zones || [];
      setZones(allZones);
      setTopZones(allZones.slice(0, 8));
      if (allZones.length > 0) setSelectedZone(allZones[0]);
      const counts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
      allZones.forEach((z) => (counts[z.riskLevel] = (counts[z.riskLevel] || 0) + 1));
      setStats({ total: allZones.length, counts });
      // Find zone with highest riskScore
      const highestRiskZone = allZones.reduce((max, z) => 
        (z.riskScore > (max?.riskScore || 0)) ? z : max, null
      );
      // Auto-trigger alert for highest risk zone on page open
      if (highestRiskZone && highestRiskZone.riskScore >= 70) {
        setEmergencyZone(highestRiskZone);
        setShowEmergencyAlert(true);
      }
    }).catch(() => {});

    api.get("/analytics/public-summary").then((res) => {
      setPublicSummary(res.data.data);
    }).catch(() => {
      setPublicSummary({ weatherStations: 0, sensorFeeds: 0, monitoredDistricts: 0, peopleSafer: 0 });
    });
  }, []);

  const cityWeather = [
    { city: "Guwahati", temp: "28°C", condition: "Haze", humidity: "75%", wind: "5 km/h", rain: "12 mm", riskLevel: "LOW" },
    { city: "Shillong", temp: "18°C", condition: "Light Rain", humidity: "90%", wind: "12 km/h", rain: "85 mm", riskLevel: "HIGH" },
    { city: "Itanagar", temp: "22°C", condition: "Cloudy", humidity: "85%", wind: "8 km/h", rain: "30 mm", riskLevel: "LOW" },
    { city: "Aizawl", temp: "20°C", condition: "Rain", humidity: "88%", wind: "10 km/h", rain: "110 mm", riskLevel: "CRITICAL" },
    { city: "Imphal", temp: "24°C", condition: "Partly Cloudy", humidity: "70%", wind: "6 km/h", rain: "10 mm", riskLevel: "LOW" },
    { city: "Gangtok", temp: "15°C", condition: "Cloudy", humidity: "80%", wind: "15 km/h", rain: "25 mm", riskLevel: "LOW" },
    { city: "Agartala", temp: "29°C", condition: "Clear", humidity: "65%", wind: "4 km/h", rain: "0 mm", riskLevel: "LOW" }
  ];


  const currentRiskScore = selectedZone ? selectedZone.riskScore : 78;
  const currentRiskLevel = selectedZone ? selectedZone.riskLevel : "HIGH";
  
  const dynRain = rainfallData.map(d => ({ ...d, val: Math.round(d.val * ((selectedZone?.rainfall24h || 94) / 94)) }));
  const dynMove = movementData.map(d => ({ ...d, val: Math.round(d.val * ((selectedZone?.riskScore || 78) / 78)) }));
  const dynRisk = riskData.map(d => ({ ...d, val: Math.round(d.val * (currentRiskScore / 78)) }));

  const whenStr = currentRiskLevel === 'CRITICAL' ? 'Immediate' : currentRiskLevel === 'HIGH' ? '3 - 6 Hours' : 'Monitoring';
  const actionStr = (currentRiskLevel === 'CRITICAL' || currentRiskLevel === 'HIGH') ? 'Evacuate' : 'Stay Alert';

  const baseWeather = [
    { city: "Guwahati",  baseTemp: 28.5, cond: "Haze",          baseHum: 78, baseRain: 12,  risk: "LOW",      color: "bg-green-600/80" },
    { city: "Shillong",  baseTemp: 18.2, cond: "Heavy Rain",    baseHum: 95, baseRain: 145, risk: "CRITICAL", color: "bg-red-600/90" },
    { city: "Itanagar",  baseTemp: 22.0, cond: "Light Rain",    baseHum: 82, baseRain: 45,  risk: "MODERATE", color: "bg-yellow-500/80 text-slate-900" },
    { city: "Aizawl",    baseTemp: 20.4, cond: "Moderate Rain", baseHum: 90, baseRain: 85,  risk: "HIGH",     color: "bg-orange-500/90" },
    { city: "Imphal",    baseTemp: 24.1, cond: "Partly Cloudy", baseHum: 72, baseRain: 5,   risk: "LOW",      color: "bg-green-600/80" },
    { city: "Gangtok",   baseTemp: 15.0, cond: "Cloudy",        baseHum: 80, baseRain: 25,  risk: "LOW",      color: "bg-green-600/80" },
    { city: "Agartala",  baseTemp: 29.1, cond: "Clear",         baseHum: 65, baseRain: 0,   risk: "LOW",      color: "bg-green-600/80" },
    { city: "Kohima",    baseTemp: 17.4, cond: "Heavy Rain",    baseHum: 92, baseRain: 110, risk: "HIGH",     color: "bg-orange-500/90" },
  ];

  const [liveWeather, setLiveWeather] = useState(() =>
    baseWeather.map(w => ({ ...w, temp: w.baseTemp.toFixed(1), hum: w.baseHum, rain: w.baseRain.toFixed(1) }))
  );

  const wmoToCondition = (code) => {
    if (code === 0) return "Clear";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95) return "Thunderstorm";
    return "Cloudy";
  };

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const lats = "26.14,25.57,27.09,23.72,24.81,27.33,23.83,25.67";
        const lons = "91.73,91.88,93.61,92.71,93.93,88.61,91.27,94.10";
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (isMounted && Array.isArray(data)) {
          const updatedWeather = baseWeather.map((w, index) => {
            const apiData = data[index]?.current;
            if (!apiData) return w;
            return {
              ...w,
              temp: apiData.temperature_2m.toFixed(1),
              hum: apiData.relative_humidity_2m,
              rain: apiData.precipitation.toFixed(1),
              cond: wmoToCondition(apiData.weather_code),
              wind: apiData.wind_speed_10m.toFixed(1)
            };
          });
          setLiveWeather(updatedWeather);
        }
      } catch (err) {
        console.error("Failed to fetch live weather", err);
      }
    };
    
    fetchWeather();
    const weatherInterval = window.setInterval(fetchWeather, 300000); // 5 mins
    return () => {
      isMounted = false;
      window.clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      {/* IMD-Style Header */}
      <header
        className="border-b border-slate-700 relative z-50"
        style={{
          backgroundImage: 'url(/header_hero_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Gradient overlay — dark at top, lighter at bottom so logo pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a3a]/90 via-[#002b5e]/75 to-[#001a3a]/85 pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 text-white text-xs py-1 px-4 flex justify-end items-center border-b border-white/10">
          <div className="flex gap-4 items-center">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Logo + Nav bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white shadow-lg border-2 border-white/30">
              <Logo className="h-7 w-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-orange-400 leading-tight tracking-wide drop-shadow-md">Bhu-Drishti <span className="text-sm font-medium bg-orange-400 text-[#001a3a] px-1.5 py-0.5 rounded-sm ml-1">NER</span></h1>
              <p className="text-xs text-blue-100 font-semibold mt-0.5 drop-shadow">{t.tagline}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setShowSearchDrop(false); }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setSearchQuery(q);
                  if (q.trim().length > 0) {
                    const matches = zones.filter(z =>
                      z.name.toLowerCase().includes(q.toLowerCase()) ||
                      z.district.toLowerCase().includes(q.toLowerCase()) ||
                      z.state.toLowerCase().includes(q.toLowerCase())
                    ).sort((a, b) => b.riskScore - a.riskScore).slice(0, 15);
                    setSearchResults(matches);
                    setShowSearchDrop(true);
                  } else {
                    // Show all zones sorted by risk when empty
                    setSearchResults([...zones].sort((a, b) => b.riskScore - a.riskScore).slice(0, 15));
                    setShowSearchDrop(true);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0 && searchResults.length > 0) {
                    setShowSearchDrop(true);
                  } else {
                    // Show all zones on focus (click/tap)
                    setSearchResults([...zones].sort((a, b) => b.riskScore - a.riskScore).slice(0, 15));
                    setShowSearchDrop(true);
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="pl-3 pr-9 py-1.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-md text-sm w-64 text-white placeholder-blue-200 focus:outline-none focus:border-orange-400"
              />
              <Search className="absolute right-2 top-1.5 h-4 w-4 text-blue-200" />

              {/* Dropdown */}
              {showSearchDrop && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-[#0b1a35] border border-slate-600 rounded-lg shadow-2xl z-[9999] overflow-hidden max-h-[400px] overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-700 bg-slate-800/50">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">NER Monitored Zones — Sorted by Risk</span>
                  </div>
                  {searchResults.map((z, i) => {
                    const riskColors = { CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MODERATE: 'bg-yellow-500', LOW: 'bg-green-500' };
                    return (
                      <button
                        key={z._id || i}
                        onMouseDown={() => {
                          setSelectedZone(z);
                          setUserLocked(true);
                          setSearchQuery(z.name);
                          setShowSearchDrop(false);
                          // Trigger alert if high risk zone
                          triggerAlertIfHighRisk(z);
                          // Scroll to map section
                          document.querySelector('#risk-map-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-700/60 flex items-center gap-3 border-b border-slate-700/50 last:border-0 transition-colors"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${riskColors[z.riskLevel] || 'bg-gray-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold whitespace-normal leading-snug">{z.name}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{z.district}, {z.state}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${riskColors[z.riskLevel]} text-white`}>{z.riskLevel}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5">{z.riskScore}/100</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {showSearchDrop && searchResults.length === 0 && searchQuery.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-[#0b1a35] border border-slate-600 rounded-lg shadow-2xl z-[9999] px-3 py-3 text-slate-400 text-xs">
                  No zones found for "{searchQuery}"
                </div>
              )}
            </div>
            <Link to="/login" className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md text-sm font-bold transition shadow-lg shadow-orange-900/30">
              {t.authorityLogin}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-2 rounded-md text-sm font-bold transition shadow-md"
              title={lang === "en" ? "हिन्दी में बदलें" : "Switch to English"}
            >
              <Languages className="h-4 w-4" />
              <span>{lang === "en" ? "हिन्दी" : "EN"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* IMD-Style Navigation Menu */}
      <nav className="bg-[#003d82] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex">
          <Link to="/" className="px-4 py-3 text-sm font-medium hover:bg-blue-700 bg-blue-800">{t.home}</Link>
          <Link to="/citizen/map" className="px-4 py-3 text-sm font-medium hover:bg-blue-700">{t.riskMap}</Link>
          <Link to="/public-alerts" className="px-4 py-3 text-sm font-medium hover:bg-blue-700">{t.warnings}</Link>
          <Link to="/public-sensors" className="px-4 py-3 text-sm font-medium hover:bg-blue-700">{t.liveSensorData}</Link>
          <Link to="/public-resources" className="px-4 py-3 text-sm font-medium hover:bg-blue-700">Awareness & Resources</Link>
          <Link to="/login" className="px-4 py-3 text-sm font-medium hover:bg-blue-700 flex items-center gap-1"><ShieldAlert className="h-4 w-4" /> Report Incident</Link>
        </div>
      </nav>

      {/* Marquee Alerts */}
      <div className="bg-red-600 text-white text-sm font-medium py-2 px-4 shadow-inner flex items-center">
        <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold mr-3 whitespace-nowrap">{t.latestAlert}</span>
        <marquee className="flex-1" speed="50">
          {topZones.length > 0 
            ? topZones.filter(z => ['CRITICAL', 'HIGH'].includes(z.riskLevel)).map(z => `⚠️ ${z.riskLevel} LANDSLIDE RISK in ${z.name.toUpperCase()} (${z.state}) due to ${z.rainfall24h > 100 ? 'heavy rainfall (' + z.rainfall24h + 'mm/24h)' : 'critical soil moisture (' + z.soilMoisture + '%)'}.`).join("   ") + "   Stay clear of vulnerable slopes and monitor local alerts."
            : t.allClear}
        </marquee>
      </div>

      {/* AI Risk Assessment Preview */}
      <section className="bg-[#070b14] text-slate-200 py-6 border-t-[4px] border-[#002b5e] z-10 relative shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" /> {t.liveAiAnalytics}
              </h2>
              <p className="text-slate-400 text-xs mt-1">{t.liveAiSub}</p>
            </div>
            <Link to="/admin" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">{t.openFullDashboard} <ChevronRight className="h-3 w-3" /></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg">
               <div className="flex items-center gap-2 mb-2">
                 <CloudRain className="h-3 w-3 text-blue-500" />
                 <h3 className="text-[10px] font-bold tracking-wider">{t.rainfallTrend}</h3>
               </div>
               <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynRain} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRainL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRainL)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg">
               <div className="flex items-center gap-2 mb-2">
                 <Mountain className="h-3 w-3 text-orange-500" />
                 <h3 className="text-[10px] font-bold tracking-wider">{t.groundMovement}</h3>
               </div>
               <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynMove} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMoveL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 20]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="val" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorMoveL)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg relative overflow-hidden flex flex-col justify-center">
                 <div className="absolute left-0 top-0 h-full w-1 transition-colors duration-300" style={{backgroundColor: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}></div>
                 <div className="flex items-center gap-2 mb-3">
                   <AlertTriangle className="h-4 w-4 transition-colors duration-300" style={{color: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}} />
                   <h3 className="text-[10px] font-bold tracking-wider text-slate-400">{t.nerRoadStatus}</h3>
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-white leading-tight mb-1">{displayRoad ? displayRoad.name : t.analyzing}</h2>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300" style={{color: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                        {displayRoad ? displayRoad.status : "..."}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate transition-all duration-300">
                        {displayRoad ? displayRoad.reason : "Loading network data"}
                      </span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="text-[10px] font-bold tracking-wider absolute top-3 left-3 flex items-center gap-1">
                <span className="text-blue-400">🧠</span> AI Risk
              </h3>
              <div className="mt-5 flex flex-col items-center justify-center relative">
                <div className="w-16 h-8 overflow-hidden relative">
                  <div className="w-16 h-16 rounded-full border-[8px] border-slate-800 absolute top-0 border-t-red-500 border-r-orange-500 border-l-yellow-500 transform rotate-45"></div>
                </div>
                <div className="absolute -bottom-1 text-center">
                   <span className="text-xl font-black text-white">{currentRiskScore}%</span>
                </div>
              </div>
              <span className="text-[9px] font-bold mt-2 tracking-widest px-2 py-0.5 rounded" style={{ color: currentRiskLevel === "CRITICAL" ? "#ef4444" : currentRiskLevel === "HIGH" ? "#f97316" : "#eab308", backgroundColor: "rgba(255,255,255,0.1)" }}>{currentRiskLevel} RISK</span>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl flex flex-col md:flex-row shadow-lg overflow-hidden">
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHERE</p>
                  <p className="text-xs font-bold text-white">{selectedZone ? selectedZone.name : "Zone A"}</p>
                  <p className="text-[10px] text-slate-500">{selectedZone ? `${selectedZone.district}, ${selectedZone.state}` : "NH-10, Assam"}</p>
                </div>
             </div>
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500"></div>
                <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHEN</p>
                  <p className="text-xs font-bold text-white">{whenStr}</p>
                  <p className="text-[10px] text-slate-500">{t.expectedWindow}</p>
                </div>
             </div>
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-orange-500"></div>
                <div className="bg-orange-500/20 p-2 rounded-full text-orange-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHY</p>
                  <p className="text-xs font-bold text-white">AI DETECTED</p>
                  <p className="text-[10px] text-slate-500">Rain: {selectedZone?.rainfall24h || 94}mm, Moisture: {selectedZone?.soilMoisture || 81}%</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Center Column: Map & Analytics */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 px-4 py-3 relative">
              <div className="flex items-center gap-3">
                <div 
                  className="z-[1000] relative"
                  onMouseEnter={() => setShowSideMenu(true)}
                  onMouseLeave={() => setShowSideMenu(false)}
                >
                  <button className="p-2 bg-white border border-slate-200 shadow-sm rounded-md hover:bg-slate-100 transition-colors text-[#002b5e] flex items-center justify-center cursor-pointer">
                    <Menu className="h-5 w-5" />
                  </button>
                  
                  {/* Invisible bridge to prevent hover loss */}
                  {showSideMenu && <div className="absolute top-full left-0 w-full h-3 bg-transparent"></div>}
                  
                  {showSideMenu && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-slate-50/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-200 transition-all duration-200 origin-top-left space-y-5">
                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <h2 className="bg-[#002b5e] text-white font-semibold py-2 px-4 flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4" /> Regional Warnings
                        </h2>
                        <div className="p-0 flex flex-col">
                          <Link to="/citizen/map" className="block px-4 py-3 border-b hover:bg-slate-50 text-sm font-medium text-slate-700">State-wise Risk Analysis</Link>
                          <Link to="/citizen/map" className="block px-4 py-3 border-b hover:bg-slate-50 text-sm font-medium text-slate-700">District-wise Nowcast</Link>
                          <Link to="/citizen/map" className="block px-4 py-3 border-b hover:bg-slate-50 text-sm font-medium text-slate-700">Highway & Road Status</Link>
                          <Link to="/public-alerts" className="block px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700">Rainfall Bulletins (NER)</Link>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <h2 className="bg-orange-500 text-white font-semibold py-2 px-4">Top Vulnerable Zones</h2>
                        <div className="p-3 space-y-3">
                          {topZones.length > 0 ? topZones.map(zone => (
                            <div key={zone._id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                              <div>
                                <p className="font-semibold text-slate-800">{zone.name}</p>
                                <p className="text-xs text-slate-500">{zone.state}</p>
                              </div>
                              <RiskBadge level={zone.riskLevel} />
                            </div>
                          )) : (
                            <p className="text-xs text-slate-500">Loading zones...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="font-semibold text-[#002b5e] flex items-center gap-2">
                  <Map className="h-5 w-5" /> Live Landslide Risk Map (NER)
                </h2>
              </div>
              <Link to="/citizen/map" className="text-xs text-blue-600 font-medium hover:underline">Full Screen Map</Link>
            </div>
            <div className="p-2 relative" id="risk-map-section">
            <RiskMapView zones={zones} height="650px" userLocation={userLocation} selectedZone={selectedZone} onSelectZone={(z) => { setSelectedZone(z); setUserLocked(true); triggerAlertIfHighRisk(z); }} />
            </div>
          </div>


        </div>

        {/* Right Column: Current Weather & Satellite */}
        <div className="lg:col-span-3 flex flex-col gap-6 max-h-[716px]">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
            <h2 className="bg-[#002b5e] text-white font-semibold py-2 px-4 flex items-center gap-2 shrink-0">
              <Thermometer className="h-4 w-4" /> Current Weather (NER)
            </h2>
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 custom-scrollbar">
              {liveWeather.map((cw, i) => (
                <div key={i} className="p-3 hover:bg-slate-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{cw.city}</span>
                    <span className="text-lg font-bold text-blue-600">{cw.temp}°C</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><CloudRain className="h-3 w-3" /> {cw.cond}</span>
                    <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {cw.wind || "0"} km/h</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t pt-2 border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500">
                      RAIN: <span className="text-blue-600">{cw.rain} mm</span>
                    </div>
                    <RiskBadge level={cw.risk} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/public-sensors" className="block text-center bg-slate-50 py-2 text-xs text-blue-600 font-medium border-t hover:bg-slate-100 shrink-0">View All Cities</Link>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden shrink-0">
             <h2 className="bg-slate-800 text-white font-semibold py-2 px-4 flex items-center gap-2">
              <Satellite className="h-4 w-4 text-blue-400" /> Live Satellite Feed
            </h2>
            <div className="relative bg-slate-100 h-[240px] w-full flex items-center justify-center overflow-hidden pointer-events-auto">
              <MiniSatelliteView />
            </div>
          </div>
        </div>
      </main>

      {/* Current Weather Across Major NER Cities */}
      <section
        className="text-white py-10 mt-8 border-t-[4px] border-[#002b5e] relative overflow-hidden"
        style={{
          backgroundImage: 'url(/ner_mountains_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001a3a]/80 via-[#002b5e]/75 to-[#001a3a]/90 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-center text-2xl md:text-3xl font-black tracking-widest mb-8">
            {t.currentWeather}
          </h2>
          <marquee behavior="scroll" direction="left" scrollamount="6" className="border-t border-white/10" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()}>
            <div className="flex border-l border-white/10 w-max">
              {liveWeather.map((cw, i) => (
                <div key={i} className="w-[280px] border-r border-b border-white/10 p-5 flex flex-col items-center justify-between min-h-[240px]">
                  <h3 className="text-[17px] font-bold mb-4">{cw.city}</h3>
                  <div className="flex w-full justify-between items-start text-sm mb-4">
                    {/* Left Side */}
                    <div className="flex flex-col items-center space-y-3 w-1/2">
                      <div className="flex flex-col items-center">
                        <Cloud className="h-5 w-5 mb-1 opacity-80" />
                        <span className="text-[11px] text-center">{cw.cond}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <CloudRain className="h-5 w-5 mb-1 opacity-80" />
                        <span className="text-[11px] text-center leading-tight">Rain (24h)<br/>{cw.rain} mm</span>
                      </div>
                    </div>
                    {/* Right Side */}
                    <div className="flex flex-col items-center space-y-3 w-1/2">
                      <div className="flex flex-col items-center">
                        <Thermometer className="h-5 w-5 mb-1 opacity-80" />
                        <span className="text-[11px] text-center">{cw.temp} °C</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Droplets className="h-5 w-5 mb-1 opacity-80" />
                        <span className="text-[11px] text-center">{cw.hum} %</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`w-full py-1.5 px-3 rounded-md flex justify-between items-center text-[11px] font-bold tracking-wider mb-4 shadow-sm ${cw.color}`}>
                    <span>{t.landslidRisk}</span>
                    <span>{cw.risk}</span>
                  </div>

                  <Link to="/public-sensors" className="text-[#facc15] text-[10px] font-bold tracking-widest hover:underline mt-auto">{t.forecastAlerts}</Link>
                </div>
              ))}
            </div>
          </marquee>
        </div>
      </section>

      {/* Emergency Geolocation Alert Modal */}
      {showEmergencyAlert && emergencyZone && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          {emergencyZone.riskScore > 75 && (
            <audio id="emergency-siren" src="/alert_siren2.mp3" autoPlay loop type="audio/mpeg" />
          )}
          <div className="bg-[#0b1121] border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>

            <div className="flex items-start gap-4 mb-5">
              <div className="bg-red-500/20 p-3 rounded-full border border-red-500/40 shrink-0 animate-pulse">
                <AlertTriangle className="w-9 h-9 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-1">{t.emergencyAlertSub}</p>
                <h2 className="text-lg font-black text-white leading-tight">{t.emergencyAlert}</h2>
                <p className="text-xs text-slate-400 mt-1">{t.yourLocationRisk}</p>
              </div>
            </div>

            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 mb-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.detectedZone}</span>
                <p className="text-white font-bold text-sm">{emergencyZone.name}</p>
                <p className="text-slate-400 text-xs">{emergencyZone.district}, {emergencyZone.state}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.riskLevel}</span>
                  <p className="text-red-400 font-black text-sm">{emergencyZone.riskLevel}</p>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Score</span>
                  <div className="flex items-center gap-2">
                    <p className="text-orange-400 font-black text-sm">{emergencyZone.riskScore}/100</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000 ease-in-out" 
                      style={{ width: `${emergencyZone.riskScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Window</span>
                  <p className="text-yellow-400 font-black text-sm">{t.timeWindow}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-950/30 border border-orange-700/40 rounded-lg p-3 mb-4">
              {/* Live Meters */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <span>💧 Soil Moisture</span>
                    <span className="text-blue-400">{emergencyZone.soilMoisture}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-700 ease-in-out"
                      style={{ width: `${emergencyZone.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <span>🌧️ Rainfall</span>
                    <span className="text-cyan-400">{emergencyZone.rainfall24h} mm</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-700 ease-in-out"
                      style={{ width: `${Math.min(100, (emergencyZone.rainfall24h / 150) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-orange-300 text-xs leading-relaxed font-medium">
                <strong>LANDSLIDE PREDICTED</strong> in the next <strong>3 to 6 hours</strong> based on critical soil saturation ({emergencyZone.soilMoisture}%), heavy rainfall ({emergencyZone.rainfall24h} mm/24h), and terrain instability detected by AI sensors.
              </p>
              <p className="text-slate-400 text-[10px] mt-2">Avoid steep slopes, drainage channels and blocked roads. Follow local authority instructions immediately.</p>
            </div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              <span className="text-[10px] text-green-400 font-bold tracking-wider uppercase">Live — Updating every 1.5s</span>
            </div>


            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyAlert(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-red-900/40"
              >
                I Understand — View Dashboard
              </button>
              <a
                href="tel:1070"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm flex items-center gap-2 border border-slate-600"
              >
                Call 1070
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#001f42] text-white mt-12 py-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-lg">Bhu-Drishti</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              An AI-based Early Warning and Landslide Risk Monitoring System specifically designed for the North Eastern Region of India. Built for SIH 2026.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">{t.importantLinks}</h3>
            <ul className="text-slate-300 text-xs space-y-2">
              <li><a href="https://www.moes.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Ministry of Earth Sciences</a></li>
              <li><a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">National Disaster Management Authority</a></li>
              <li><a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">India Meteorological Department</a></li>
              <li><a href="https://sdmassam.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">NER State Disaster Management</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">{t.contactUs}</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Bhu-Drishti AI Command Center<br />
              Guwahati, Assam - 781039<br />
              Emergency: 1070 (Toll Free)<br />
              Email: alerts@Bhu-Drishti.ai
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-700 text-center text-xs text-slate-400">
          © 2026 Bhu-Drishti AI. All Rights Reserved. (Demo Project for SIH26001)
        </div>
      </footer>
    </div>
  );
}
