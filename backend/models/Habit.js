import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
  type: String,
  required: true,
},
    icon: {
      type: String,
      default: "🎯",
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },

    frequency: {
      type: String,
      default: "daily",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Habit", habitSchema);