import dns from "dns";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import resumesRouter from "./routes/resumes.js";
import dashboardRouter from "./routes/dashboard.js";
import insightRouter from "./routes/insights.js";
import versionRouter from "./routes/versions.js";
import historyRouter from "./routes/history.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
mongoose.set("strictQuery", true);

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: true, // reflect request origin - allows everything while keeping credentials working
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/insights", insightRouter);
app.use("/api/versions", versionRouter);
app.use("/api/history", historyRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Server listening on http://localhost:${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) =>{
    console.error("unhandledRejection", reason);
})

start();

export {app};
