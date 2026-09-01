import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO URI is not defined in the environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT SECRET is not defined in the environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE CLIENT ID is not defined in the environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE CLIENT SECRET is not defined in the environment variables");
}
export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

export default config;
