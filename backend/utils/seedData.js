/**
 * Seeds demo/fictional data across the North Eastern Region for the SIH demo.
 * Run with: npm run seed
 * All data here is clearly fictional/demo data - not official government records.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import RiskZone from "../models/RiskZone.js";
import Road from "../models/Road.js";
import { computeRiskScore } from "../services/riskEngine.js";

dotenv.config();

const demoUsers = [
  { name: "Admin User", email: "admin@Bhu-Drishti.ai", password: "Admin@123", role: "admin" },
  { name: "Admin User (Alt)", email: "admin@landguard.ai", password: "Admin@123", role: "admin" },
  {
    name: "Field Officer Rina Marak",
    email: "officer@Bhu-Drishti.ai",
    password: "Officer@123",
    role: "field_officer",
    location: { district: "East Khasi Hills", state: "Meghalaya" },
  },
  {
    name: "Field Officer Rina Marak (Alt)",
    email: "officer@landguard.ai",
    password: "Officer@123",
    role: "field_officer",
    location: { district: "East Khasi Hills", state: "Meghalaya" },
  },
  {
    name: "Citizen Bipul Das",
    email: "citizen@Bhu-Drishti.ai",
    password: "Citizen@123",
    role: "citizen",
    location: { district: "Kamrup", state: "Assam" },
  },
  {
    name: "Citizen Bipul Das (Alt)",
    email: "citizen@landguard.ai",
    password: "Citizen@123",
    role: "citizen",
    location: { district: "Kamrup", state: "Assam" },
  },
];

const demoZonesRaw = [
  { name: "Cherrapunji Ridge", district: "East Khasi Hills", state: "Meghalaya", latitude: 25.2702, longitude: 91.7323, rainfall24h: 165, rainfall72h: 310, soilMoisture: 84, slope: 42, elevation: 1484, historicalLandslides: 6, distanceFromRoad: 80, distanceFromRiver: 150, population: 3200, roadStatus: "AT_RISK" },
  { name: "Aizawl Hill Slope", district: "Aizawl", state: "Mizoram", latitude: 23.7271, longitude: 92.7176, rainfall24h: 90, rainfall72h: 210, soilMoisture: 65, slope: 33, elevation: 1132, historicalLandslides: 4, distanceFromRoad: 150, distanceFromRiver: 400, population: 5200, roadStatus: "OPEN" },
  { name: "Kohima Bypass Zone", district: "Kohima", state: "Nagaland", latitude: 25.6751, longitude: 94.1086, rainfall24h: 45, rainfall72h: 95, soilMoisture: 48, slope: 22, elevation: 1444, historicalLandslides: 2, distanceFromRoad: 60, distanceFromRiver: 500, population: 2100, roadStatus: "OPEN" },
  { name: "Itanagar Foothills", district: "Papum Pare", state: "Arunachal Pradesh", latitude: 27.0844, longitude: 93.6053, rainfall24h: 30, rainfall72h: 70, soilMoisture: 38, slope: 18, elevation: 480, historicalLandslides: 1, distanceFromRoad: 300, distanceFromRiver: 220, population: 1800, roadStatus: "OPEN" },
  { name: "Imphal East Slope", district: "Imphal East", state: "Manipur", latitude: 24.8170, longitude: 93.9368, rainfall24h: 120, rainfall72h: 240, soilMoisture: 74, slope: 36, elevation: 950, historicalLandslides: 5, distanceFromRoad: 90, distanceFromRiver: 180, population: 4300, roadStatus: "AT_RISK" },
  { name: "Gangtok Ridge Road", district: "East Sikkim", state: "Sikkim", latitude: 27.3389, longitude: 88.6065, rainfall24h: 55, rainfall72h: 140, soilMoisture: 58, slope: 40, elevation: 1650, historicalLandslides: 7, distanceFromRoad: 40, distanceFromRiver: 300, population: 6100, roadStatus: "OPEN" },
  { name: "Agartala Border Slope", district: "West Tripura", state: "Tripura", latitude: 23.8315, longitude: 91.2868, rainfall24h: 20, rainfall72h: 45, soilMoisture: 30, slope: 12, elevation: 60, historicalLandslides: 0, distanceFromRoad: 500, distanceFromRiver: 700, population: 900, roadStatus: "OPEN" },
  { name: "Dima Hasao Corridor", district: "Dima Hasao", state: "Assam", latitude: 25.4939, longitude: 93.0161, rainfall24h: 175, rainfall72h: 330, soilMoisture: 88, slope: 45, elevation: 1120, historicalLandslides: 8, distanceFromRoad: 30, distanceFromRiver: 100, population: 3900, roadStatus: "BLOCKED" },
  { name: "Tawang Monastery Road", district: "Tawang", state: "Arunachal Pradesh", latitude: 27.58, longitude: 91.86, rainfall24h: 80, rainfall72h: 180, soilMoisture: 60, slope: 38, elevation: 3048, historicalLandslides: 3, distanceFromRoad: 10, distanceFromRiver: 500, population: 2000, roadStatus: "AT_RISK" },
  { name: "Zunheboto Hill Range", district: "Zunheboto", state: "Nagaland", latitude: 25.96, longitude: 94.52, rainfall24h: 110, rainfall72h: 260, soilMoisture: 72, slope: 41, elevation: 1874, historicalLandslides: 5, distanceFromRoad: 120, distanceFromRiver: 200, population: 3100, roadStatus: "OPEN" },
  { name: "Lunglei South Terrain", district: "Lunglei", state: "Mizoram", latitude: 22.88, longitude: 92.73, rainfall24h: 140, rainfall72h: 290, soilMoisture: 78, slope: 35, elevation: 1222, historicalLandslides: 4, distanceFromRoad: 50, distanceFromRiver: 350, population: 2800, roadStatus: "AT_RISK" },
  { name: "Tura Peak Surroundings", district: "West Garo Hills", state: "Meghalaya", latitude: 25.51, longitude: 90.22, rainfall24h: 200, rainfall72h: 410, soilMoisture: 92, slope: 48, elevation: 872, historicalLandslides: 9, distanceFromRoad: 20, distanceFromRiver: 80, population: 4500, roadStatus: "BLOCKED" },
  { name: "Mangan District Highway", district: "Mangan", state: "Sikkim", latitude: 27.50, longitude: 88.53, rainfall24h: 60, rainfall72h: 150, soilMoisture: 55, slope: 39, elevation: 1200, historicalLandslides: 6, distanceFromRoad: 5, distanceFromRiver: 150, population: 1500, roadStatus: "OPEN" },
  { name: "Silchar Basin", district: "Cachar", state: "Assam", latitude: 24.83, longitude: 92.77, rainfall24h: 180, rainfall72h: 360, soilMoisture: 89, slope: 15, elevation: 22, historicalLandslides: 2, distanceFromRoad: 100, distanceFromRiver: 50, population: 12000, roadStatus: "BLOCKED" },
  { name: "Churachandpur Valley", district: "Churachandpur", state: "Manipur", latitude: 24.33, longitude: 93.68, rainfall24h: 85, rainfall72h: 200, soilMoisture: 68, slope: 25, elevation: 914, historicalLandslides: 3, distanceFromRoad: 40, distanceFromRiver: 180, population: 5500, roadStatus: "OPEN" },
  { name: "Kailashahar Border", district: "Unakoti", state: "Tripura", latitude: 24.32, longitude: 92.01, rainfall24h: 40, rainfall72h: 85, soilMoisture: 45, slope: 14, elevation: 35, historicalLandslides: 1, distanceFromRoad: 200, distanceFromRiver: 300, population: 3400, roadStatus: "OPEN" },
];

const demoRoads = [
  { name: "NH-06", location: "Shillong - Silchar stretch, Meghalaya", state: "Meghalaya", status: "OPEN", riskLevel: "MODERATE", latitude: 25.30, longitude: 91.80, importance: "National Highway" },
  { name: "Road-21", location: "Aizawl outer ring, Mizoram", state: "Mizoram", status: "AT_RISK", riskLevel: "HIGH", latitude: 23.73, longitude: 92.70, importance: "State Highway" },
  { name: "Road-31", location: "Dima Hasao corridor, Assam", state: "Assam", status: "BLOCKED", riskLevel: "CRITICAL", blockageReason: "Debris and mud flow following heavy rainfall", latitude: 25.49, longitude: 93.02, importance: "National Highway" },
  { name: "Road-44", location: "Imphal East bypass, Manipur", state: "Manipur", status: "OPEN", riskLevel: "MODERATE", latitude: 24.82, longitude: 93.94, importance: "District Road" },
  { name: "NH-10", location: "Siliguri to Gangtok, Sikkim", state: "Sikkim", status: "OPEN", riskLevel: "MODERATE", latitude: 27.30, longitude: 88.50, importance: "National Highway" },
  { name: "NH-15", location: "Tezpur to Lakhimpur, Assam", state: "Assam", status: "AT_RISK", riskLevel: "HIGH", latitude: 26.90, longitude: 93.80, importance: "National Highway" },
  { name: "NH-13", location: "Tawang to Bomdila, Arunachal Pradesh", state: "Arunachal Pradesh", status: "OPEN", riskLevel: "LOW", latitude: 27.40, longitude: 92.10, importance: "National Highway" },
  { name: "NH-2", location: "Dimapur to Kohima, Nagaland", state: "Nagaland", status: "AT_RISK", riskLevel: "HIGH", latitude: 25.75, longitude: 93.90, importance: "National Highway" },
  { name: "NH-202", location: "Mokokchung to Tuensang, Nagaland", state: "Nagaland", status: "BLOCKED", riskLevel: "CRITICAL", blockageReason: "Major landslide at Chare", latitude: 26.20, longitude: 94.60, importance: "National Highway" },
  { name: "NH-54", location: "Silchar to Aizawl, Mizoram", state: "Mizoram", status: "AT_RISK", riskLevel: "HIGH", latitude: 24.50, longitude: 92.75, importance: "National Highway" },
];

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await RiskZone.deleteMany({});
  await Road.deleteMany({});

  await User.create(demoUsers);
  console.log(`Seeded ${demoUsers.length} demo users.`);

  const zonesWithScores = demoZonesRaw.map((z) => {
    const prediction = computeRiskScore(z);
    return { ...z, ...prediction, isDemoData: true };
  });
  await RiskZone.insertMany(zonesWithScores);
  console.log(`Seeded ${zonesWithScores.length} demo risk zones.`);

  await Road.insertMany(demoRoads);
  console.log(`Seeded ${demoRoads.length} demo roads.`);

  console.log("\nDemo credentials:");
  demoUsers.forEach((u) => console.log(`  ${u.role.padEnd(14)} ${u.email} / ${u.password}`));

  await mongoose.disconnect();
  console.log("\nSeed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
