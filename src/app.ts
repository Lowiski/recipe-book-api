import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import { ENV } from "@/config/env";
import routes from "@/routes";

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    // Only the configured frontend origin may make credentialed requests.
    origin: ENV.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

// --- Health checks ---
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: `${ENV.APP_NAME} is running`,
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// --- Feature routes (registered before the 404 handler) ---
app.use("/api", routes);

// --- 404 handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// --- Global error handler ---
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error:", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    message:
      ENV.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

export default app;
