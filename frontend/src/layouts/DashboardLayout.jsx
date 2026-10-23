import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Map, AlertTriangle, FileWarning, Route as RoadIcon,
  Users, BarChart3, Settings, CloudSun, FileText, Search, User, LogOut, PlusCircle, CheckSquare
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/map", label: "Risk Map", icon: Map },
  { to: "/admin/alerts", label: "Alerts", icon: AlertTriangle, badge: 5 },
  { to: "/admin/incidents", label: "Incidents", icon: FileWarning },
  { to: "/admin/roads", label: "Roads", icon: RoadIcon },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const officerNavItems = [
  { to: "/officer", label: "Field Tasks", icon: CheckSquare },
  { to: "/officer/map", label: "Risk Map", icon: Map },
  { to: "/officer/roads", label: "Roads Status", icon: RoadIcon },
];

const citizenNavItems = [
  { to: "/citizen", label: "My Reports", icon: FileWarning },
  { to: "/citizen/report", label: "Report Incident", icon: PlusCircle },
  { to: "/citizen/map", label: "Risk Map", icon: Map },
  { to: "/citizen/alerts", label: "Early Warnings", icon: AlertTriangle },
  { to: "/citizen/roads", label: "Road Status", icon: RoadIcon },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let items = adminNavItems;
  if (user?.role === "field_officer") items = officerNavItems;
  else if (user?.role === "citizen") items = citizenNavItems;


  return (
    <div className="flex h-screen bg-[#070b14] text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1321] border-r border-slate-800 flex flex-col justify-between shrink-0 relative z-20">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Area */}
          <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800">
            <Logo className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-white font-bold text-lg leading-none tracking-wide">Bhu-Drishti</h1>
              <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-wider">Early Warning for Safer Tomorrow</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
            {items.map((item) => {
              const isActive = location.pathname === item.to || (item.to === "/admin" && location.pathname === "/");
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-blue-600/20 text-blue-400 font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Image Area */}
        <div className="relative h-48 m-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0">
          <img src="/ner_mountains_bg.jpg" className="absolute inset-0 w-full h-full object-cover" alt="NER Mountains" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white font-bold italic leading-tight text-lg mb-1">Safer Northeast<br/>Stronger Tomorrow</h3>
            <p className="text-[10px] text-green-400 font-semibold tracking-wider">AI | Geo-Spatial | Real Impact</p>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0f1c] overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1321] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
           {/* Left */}
           <div className="flex items-center gap-4 bg-[#141d30] px-3 py-2 rounded-lg border border-slate-700/50 w-80">
              <Search className="h-4 w-4 text-slate-500" />
              <input type="text" placeholder="Search location, district..." className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full" />
           </div>
           
           {/* Right */}
           <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer hover:bg-red-500/20 transition">
               <AlertTriangle className="h-3.5 w-3.5" /> Heavy rainfall alert in Meghalaya
             </div>
             
             <div className="hidden lg:flex items-center gap-3 border-l border-r border-slate-700 px-5">
                <CloudSun className="h-5 w-5 text-slate-300" />
                <div>
                  <p className="text-white font-bold text-sm leading-none">22°C</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Shillong, Meghalaya</p>
                </div>
             </div>

              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center border border-blue-500 shrink-0">
                   <User className="h-4 w-4 text-white" />
                 </div>
                 <div className="hidden md:block text-left">
                   <p className="text-xs font-semibold text-white leading-tight">{user?.name || "User"}</p>
                   <p className="text-[10px] text-slate-400 capitalize">{user?.role ? user.role.replace("_", " ") : "Member"}</p>
                 </div>
                 <button
                   onClick={handleLogout}
                   title="Log out"
                   className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                 >
                   <LogOut className="h-4 w-4" />
                 </button>
              </div>
           </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
           {children}
        </main>
      </div>
    </div>
  );
}
