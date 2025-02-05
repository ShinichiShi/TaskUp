import mongoose from "mongoose";

const URI = process.env.URI as string;

if (!URI) {
  throw new Error("Please define URI");
}

export const dbconnect = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};