import express from "express";

import {
  addHabit,
  getHabits,
  deleteHabit,
  updateHabit,
} from "../controllers/habitController.js";

const router = express.Router();

router.get("/", getHabits);

router.post("/", addHabit);

router.put("/:id", updateHabit);

router.delete("/:id", deleteHabit);

export default router;