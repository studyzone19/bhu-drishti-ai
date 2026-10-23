import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RiskMapPage from "./pages/RiskMapPage.jsx";
import IncidentsList from "./pages/IncidentsList.jsx";
import AlertsPage from "./pages/AlertsPage.jsx";
import RoadsPage from "./pages/RoadsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ReportIncident from "./pages/ReportIncident.jsx";
import FieldOfficerDashboard from "./pages/FieldOfficerDashboard.jsx";
import PublicAwareness from "./pages/PublicAwareness.jsx";
import PublicSensors from "./pages/PublicSensors.jsx";
import PublicAlerts from "./pages/PublicAlerts.jsx";
import PublicResources from "./pages/PublicResources.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AIChatbot from "./components/AIChatbot.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public-awareness" element={<PublicAwareness />} />
        <Route path="/public-sensors" element={<PublicSensors />} />
        <Route path="/public-alerts" element={<PublicAlerts />} />
        <Route path="/public-resources" element={<PublicResources />} />
        <Route path="/citizen/map" element={<RiskMapPage standalone />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/map" element={<ProtectedRoute roles={["admin"]}><RiskMapPage /></ProtectedRoute>} />
        <Route path="/admin/incidents" element={<ProtectedRoute roles={["admin"]}><IncidentsList /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute roles={["admin"]}><AlertsPage /></ProtectedRoute>} />
        <Route path="/admin/roads" element={<ProtectedRoute roles={["admin"]}><RoadsPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={["admin"]}><AnalyticsPage /></ProtectedRoute>} />

        {/* Field officer */}
        <Route path="/officer" element={<ProtectedRoute roles={["field_officer"]}><FieldOfficerDashboard /></ProtectedRoute>} />
        <Route path="/officer/map" element={<ProtectedRoute roles={["field_officer"]}><RiskMapPage /></ProtectedRoute>} />
        <Route path="/officer/roads" element={<ProtectedRoute roles={["field_officer"]}><RoadsPage /></ProtectedRoute>} />

        {/* Citizen */}
        <Route path="/citizen" element={<ProtectedRoute roles={["citizen"]}><IncidentsList /></ProtectedRoute>} />
        <Route path="/citizen/alerts" element={<ProtectedRoute roles={["citizen"]}><AlertsPage /></ProtectedRoute>} />
        <Route path="/citizen/roads" element={<ProtectedRoute roles={["citizen"]}><RoadsPage /></ProtectedRoute>} />
        <Route path="/citizen/report" element={<ProtectedRoute roles={["citizen"]}><ReportIncident /></ProtectedRoute>} />
      </Routes>
      <AIChatbot />
    </>
  );
}
