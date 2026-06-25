import Log from "../models/log.js";
import Habit from "../models/Habit.js";

// ===============================
// Mark Habit Complete
// ===============================
export const markHabit = async (req, res) => {
  try {
    const { habitId, date } = req.body;

    const exists = await Log.findOne({
      user: req.user._id,
      habitId,
      completedDate: date,
    });

    if (exists) {
      return res.json(exists);
    }

    const log = await Log.create({
      user: req.user._id,
      habitId,
      completedDate: date,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Today's Logs
// ===============================
export const getTodayLogs = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const logs = await Log.find({
      user: req.user._id,
      completedDate: today,
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Unmark Habit
// ===============================
export const unmarkHabit = async (req, res) => {
  try {
    const { habitId, date } = req.body;

    await Log.findOneAndDelete({
      user: req.user._id,
      habitId,
      completedDate: date,
    });

    res.json({
      message: "Habit unmarked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Logs Between Dates
// ===============================
export const getRangeLogs = async (req, res) => {
  try {
    const { start, end } = req.query;

    const logs = await Log.find({
      user: req.user._id,
      completedDate: {
        $gte: start,
        $lte: end,
      },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Statistics
// ===============================
export const getStats = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
    });

    const logs = await Log.find({
      user: req.user._id,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const perHabit = habits.map((habit) => {
      const habitLogs = logs.filter(
        (log) => String(log.habitId) === String(habit._id)
      );

      const completions30d = habitLogs.filter(
        (log) => new Date(log.completedDate) >= thirtyDaysAgo
      ).length;

      return {
        habitId: habit._id,
        name: habit.title,
        icon: habit.icon,
        color: habit.color,
        category: habit.category,

        currentStreak: habit.streak || 0,

        longestStreak: habit.longestStreak || 0,

        completions30d,
      };
    });

    res.json({
      totalHabits: habits.length,
      totalCompletions: logs.length,
      perHabit,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};