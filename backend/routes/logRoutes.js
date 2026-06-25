import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  markHabit,
  unmarkHabit,
  getTodayLogs,
  getRangeLogs,
    getStats,
} from "../controllers/logController.js";

const router = express.Router();

router.post("/", protect, markHabit);

router.delete("/", protect, unmarkHabit);

router.get("/today", protect, getTodayLogs);

router.get("/range", protect, getRangeLogs);

router.get("/stats", protect, getStats);

export default router;