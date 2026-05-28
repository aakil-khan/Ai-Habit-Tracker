import express from "express";
import { getHabitSuggestion } from "../controllers/aiController.js";

const router = express.Router();

router.get("/suggest", getHabitSuggestion);

export default router;