import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Bhu-Drishti_ai";

  try {
    await mongoose.connect(uri);
    console.log(`[Bhu-Drishti] MongoDB connected: ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn("[Bhu-Drishti] Local MongoDB unavailable, starting in-memory database...");
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Bhu-Drishti] MongoDB memory server connected: ${mongoose.connection.host}`);
  } catch (memoryErr) {
    console.error("[Bhu-Drishti] MongoDB connection failed:", memoryErr.message);
    process.exit(1);
  }
}
