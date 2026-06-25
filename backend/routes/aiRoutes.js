import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getHabitSuggestion,
  chatWithAI,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/suggest-habits", protect, getHabitSuggestion);

router.post("/chat", protect, chatWithAI);

export default router;