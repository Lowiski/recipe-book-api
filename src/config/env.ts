import dotenv from "dotenv";
dotenv.config();

function requireInProduction(name: string, fallback: string) {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production`);
  }
  return fallback;
}

export const ENV = {
  APP_NAME: process.env.APP_NAME || "Recipe Book API",
  PORT: Number.parseInt(process.env.PORT || "7000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:7000",
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: requireInProduction("JWT_SECRET", "dev_only_jwt_secret_change_me"),
  CSRF_SECRET: process.env.CSRF_SECRET,
};

export const IS_PRODUCTION = ENV.NODE_ENV === "production";
