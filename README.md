# LANDGUARD AI

**AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region of India**
Built for Smart India Hackathon 2026 — Problem Statement **SIH26001**.

> Demo data disclosure: risk zone environmental readings, weather, sensor values, and the ML
> training dataset in this repository are clearly labeled synthetic/demo data for development
> and presentation purposes. They are not official government records or real-time official data.

---

## 1. Overview

LANDGUARD AI predicts landslide risk across NER states (Assam, Arunachal Pradesh, Meghalaya,
Manipur, Mizoram, Nagaland, Tripura, Sikkim) from rainfall, soil moisture, terrain, and
historical data, visualizes it on a live GIS map, and drives an end-to-end disaster-management
workflow:

```
Data Collection → Risk Analysis → AI Prediction → GIS Visualization →
Early Warning → Citizen Reporting → Field Verification → Emergency Prioritization
```

## 2. SIH26001 requirement mapping

| Requirement | Where it's implemented |
|---|---|
| A. Data collection (rainfall, soil moisture, terrain, historical) | `RiskZone` model, `weatherService.js`, `Sensor` model |
| B. AI/ML risk prediction | `ml-service/` (FastAPI + RandomForest), `services/riskEngine.js` fallback |
| C. Alerts to authorities/officers/citizens | `services/alertEngine.js`, `Alert` model, Alerts page |
| D. GIS heatmaps, roads, villages | `frontend/src/maps/RiskMapView.jsx` (Leaflet), `Road` model |
| E. Citizen geo-tagged reporting | `ReportIncident.jsx`, `Incident` model, mock image analysis |
| F. Dashboard: severity, roads, weather, emergency priority | `AdminDashboard.jsx`, `services/priorityEngine.js` |
| Multilingual + offline | `vite-plugin-pwa` config, i18n scaffold (see §8) |

## 3. Architecture

```
landguard-ai/
  frontend/    React + Vite + Tailwind + Leaflet + Recharts (port 5173)
  backend/     Node.js + Express + MongoDB + Mongoose + JWT (port 5000)
  ml-service/  Python + FastAPI + scikit-learn RandomForest (port 8000)
```

The Node backend calls the FastAPI ML service over HTTP for `/api/risk-zones/:id/predict`.
If the ML service is unreachable, the backend falls back to a transparent rule-based engine
(`services/riskEngine.js`) and labels the response accordingly — it never silently fabricates
an ML prediction.

## 4. Technology stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Leaflet/React-Leaflet, Recharts, Lucide icons, vite-plugin-pwa
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, CORS
- **ML:** Python, pandas, NumPy, scikit-learn (RandomForestClassifier), FastAPI, joblib

## 5. Installation & setup

### Prerequisites
Node.js 18+, Python 3.10+, MongoDB running locally or a connection string (e.g. MongoDB Atlas).

### Backend
```bash
cd backend
cp .env.example .env        # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed                # loads demo users, risk zones, and roads
npm run dev                 # http://localhost:5000
```

### ML service
```bash
cd ml-service
pip install -r requirements.txt
python data/generate_synthetic_data.py     # writes synthetic_landslide_data.csv
mv synthetic_landslide_data.csv data/      # if not already in data/
python train.py                            # trains and saves model/landslide_model.joblib
uvicorn app:app --reload --port 8000       # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## 6. Environment variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/landguard_ai
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:8000
WEATHER_API_KEY=
WEATHER_MODE=mock
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## 7. Demo credentials (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@landguard.ai | Admin@123 |
| Field Officer | officer@landguard.ai | Officer@123 |
| Citizen | citizen@landguard.ai | Citizen@123 |

## 8. API reference (summary)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/risk-zones
GET    /api/risk-zones/:id
POST   /api/risk-zones                 (admin)
PUT    /api/risk-zones/:id             (admin)
DELETE /api/risk-zones/:id             (admin)
POST   /api/risk-zones/:id/predict     (admin, field_officer)
POST   /api/risk/predict               (ad-hoc, no persistence)

POST   /api/incidents                  (multipart: image/video)
GET    /api/incidents
GET    /api/incidents/:id
PUT    /api/incidents/:id              (admin, field_officer)

GET    /api/alerts
POST   /api/alerts                     (admin)
PUT    /api/alerts/:id                 (admin)

POST   /api/sensors/data
GET    /api/sensors

GET    /api/roads
POST   /api/roads                      (admin)
PUT    /api/roads/:id                  (admin, field_officer)

GET    /api/tasks
POST   /api/tasks                      (admin)
PUT    /api/tasks/:id                  (admin, field_officer)

GET    /api/analytics/overview
GET    /api/analytics/risk
GET    /api/analytics/incidents
```

## 9. Demo workflow (13-stage script for judges)

1. Normal conditions — a zone shows LOW risk (rainfall 25mm, soil moisture 40%).
2. Admin edits the zone with heavy-rainfall values (150mm / 82% / 38° slope) via `PUT /api/risk-zones/:id`.
3. Admin clicks **Re-run AI prediction** on the Risk Map page → ML service (or fallback) returns risk score 87, CRITICAL.
4. The GIS map marker for that zone turns red immediately.
5. An early warning is auto-created (`alertEngine.js`) and appears on the Alerts page.
6. A citizen submits a Ground Crack report with a photo and GPS coordinates via **Report Incident**.
7. Admin sees the new report as PENDING on the Incidents page.
8. Admin advances the report to VERIFIED.
9. Admin creates a P1 Field Task for that incident/zone (`POST /api/tasks`).
10. The field officer logs in, sees the P1 task, accepts it, and uploads evidence notes.
11. Admin or field officer updates the nearby road from OPEN → BLOCKED on the Roads page.
12. `priorityEngine.js` reflects the updated composite priority.
13. Dashboard KPI cards and the risk-distribution chart update to reflect the new CRITICAL zone, active alert, and blocked road.

## 10. What's implemented vs. scaffolded

**Fully implemented and functional:** auth + JWT + roles, risk zone CRUD, rule-based risk engine,
ML service with a trained RandomForest model and graceful fallback, citizen incident reporting
with file upload, alert generation, emergency priority scoring, road status workflow, field task
workflow, analytics endpoints + charts, GIS map with live zone data, PWA manifest/service-worker config.

**Scaffolded with a clear mock/demo layer, ready for real integration (per the spec's own rules
for mock services where real external access is unavailable):**
- Weather: `weatherService.js` returns labeled mock data; swap in a real IMD-compatible API call.
- Image analysis: `mockImageAnalysis()` in `incidentController.js`; replace with a real YOLO/OpenCV service.
- SMS/email/push notifications: fields exist on `Alert.notificationsSent`; wire up a real provider (e.g. Twilio, SES) before setting those flags true.
- Sensors: `POST /api/sensors/data` accepts real payloads today; an ESP32/IoT device can call it directly.
- Multilingual (English/Hindi+): PWA/i18n structure is in place (`frontend/src/i18n/`); translation strings for Hindi and other NER languages should be added there.
- Offline sync (IndexedDB queue + background sync) is scaffolded via `vite-plugin-pwa`'s Workbox config; full local-write queuing for incident submissions is a next step.

## 11. Security notes

- Passwords are hashed with bcrypt; JWT secret and DB URI are read from `.env`, never hard-coded.
- Role-based authorization is enforced server-side on every mutating route, not just hidden in the UI.
- File uploads are restricted by type and size (25MB) via Multer.
