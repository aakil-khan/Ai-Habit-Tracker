import { model } from "../utils/gemini.js";

export const getHabitSuggestion = async (req, res) => {
  try {
    const goal = "I want to wake up early and study consistently";

    const prompt = `
    Suggest healthy habits for this goal:
    ${goal}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      success: true,
      suggestion: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};