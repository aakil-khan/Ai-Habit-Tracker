import Habit from "../models/Habit.js";

export const addHabit = async (req, res) => {

  try {

    const title = "Wake up at 6 AM";

    const habit = await Habit.create({
      user: "6855f123456789abcdef1234",
      title,
    });

    res.status(201).json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getHabits = async (req, res) => {

  try {

    const habits = await Habit.find();

    res.json(habits);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const deleteHabit = async (req, res) => {

  try {

    const habit = await Habit.findByIdAndDelete(
      req.params.id
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.json({
      message: "Habit deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


export const updateHabit = async (req, res) => {

  try {

    const habit = await Habit.findById(
      req.params.id
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    habit.completed = !habit.completed;

    if (habit.completed) {
      habit.streak += 1;
    }

    await habit.save();

    res.json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};