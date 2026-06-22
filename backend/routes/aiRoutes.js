import express from "express";
import { getHabitSuggestion } from "../controllers/aiController.js";

const router = express.Router();

router.post("/suggest-habits", getHabitSuggestion);

export default router;