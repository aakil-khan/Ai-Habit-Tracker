import Habit from "../models/Habit.js";

export const addHabit = async (req, res) => {
  try {
      
    const {
  name,
  icon,
  color,
  description,
  category,
  frequency,
} = req.body;

const habit = await Habit.create({
  user: req.user._id,
  name,
  icon,
  color,
  description,
  category,
  frequency,
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
    console.log("===== GET HABITS =====");
    console.log("REQ USER:", req.user);

    const habits = await Habit.find({
      user: req.user._id,
    });

    console.log("FOUND HABITS:", habits);

    res.json(habits);

  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteHabit = async (req, res) => {

  try {

    const habit = await Habit.findOneAndDelete({
  _id: req.params.id,
  user: req.user._id,
});

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

    const habit = await Habit.findOne({
  _id: req.params.id,
  user: req.user._id,
});

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