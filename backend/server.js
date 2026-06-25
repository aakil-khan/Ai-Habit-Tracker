import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import logRoutes from "./routes/logRoutes.js";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import habitRoutes from "./routes/habitRoutes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {

  origin(origin, cb) {

    // Allow requests with no origin
    if (!origin) return cb(null, true);

    // Allow localhost in development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }

    // Allow frontend URL from env
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/logs", logRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Logs API working" });
});

app.use("/api/habits", habitRoutes);

// Health Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// Error Middleware
app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {

  app.listen(PORT, () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  });

});