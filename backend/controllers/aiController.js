import { openrouter } from "../utils/openrouter.js";

export const getHabitSuggestion = async (req, res) => {
  try {
    const { goals, productiveTime, struggles } = req.body;

    const prompt = `
User Goal: ${goals}

Most Productive Time:
${productiveTime}

Current Struggles:
${struggles}

Suggest 3 practical habits.

Return ONLY valid JSON.

[
  {
    "name": "",
    "description": "",
    "category": "",
    "frequency": "",
    "reason": "",
    "icon": ""
  }
]
`;

    const completion =
      await openrouter.chat.completions.create({
   model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

   const text = completion.choices[0].message.content;

console.log("========== AI RESPONSE ==========");
console.log(text);
console.log("=================================");

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const suggestions = JSON.parse(cleaned);

    res.json({
      success: true,
      suggestions,
    });

  }catch (error) {
  console.error(error);

  return res.json({
    success: true,
    suggestions: [
      {
        name: "Study 30 Minutes Daily",
        description: "Focus on one topic every day",
        category: "Learning",
        frequency: "daily",
        reason: "Builds consistency",
        icon: "📚",
      },
      {
        name: "Wake Up Before 7 AM",
        description: "Start your day earlier",
        category: "Routine",
        frequency: "daily",
        reason: "Creates more productive hours",
        icon: "⏰",
      },
      {
        name: "Drink 2L Water",
        description: "Stay hydrated throughout the day",
        category: "Health",
        frequency: "daily",
        reason: "Improves energy and concentration",
        icon: "💧",
      },
      {
        name: "10-Minute Walk",
        description: "Take a short walk outdoors",
        category: "Fitness",
        frequency: "daily",
        reason: "Boosts mood and activity",
        icon: "🚶",
      },
      {
        name: "Read 10 Pages",
        description: "Read a book every day",
        category: "Learning",
        frequency: "daily",
        reason: "Improves knowledge gradually",
        icon: "📖",
      },
      {
        name: "No Phone After Waking Up",
        description: "Avoid screens for 30 minutes",
        category: "Mindfulness",
        frequency: "daily",
        reason: "Reduces distractions",
        icon: "📵",
      },
      {
        name: "Meditate 5 Minutes",
        description: "Practice mindfulness daily",
        category: "Mindfulness",
        frequency: "daily",
        reason: "Improves focus and reduces stress",
        icon: "🧘",
      },
      {
        name: "Plan Tomorrow Tonight",
        description: "Write tomorrow's tasks before sleeping",
        category: "Productivity",
        frequency: "daily",
        reason: "Creates clarity and direction",
        icon: "📝",
      },
      {
        name: "Exercise 20 Minutes",
        description: "Any physical activity counts",
        category: "Fitness",
        frequency: "daily",
        reason: "Improves health and stamina",
        icon: "🏋️",
      },
      {
        name: "Sleep 8 Hours",
        description: "Maintain a consistent sleep schedule",
        category: "Health",
        frequency: "daily",
        reason: "Supports recovery and focus",
        icon: "😴",
      },
      {
        name: "Practice Coding",
        description: "Solve one coding problem",
        category: "Learning",
        frequency: "daily",
        reason: "Builds technical skills",
        icon: "💻",
      },
      {
        name: "Journal Your Day",
        description: "Write down thoughts and progress",
        category: "Mindfulness",
        frequency: "daily",
        reason: "Improves self-awareness",
        icon: "📔",
      },
      {
        name: "Healthy Breakfast",
        description: "Eat a nutritious breakfast",
        category: "Health",
        frequency: "daily",
        reason: "Provides energy for the day",
        icon: "🥗",
      },
      {
        name: "Limit Social Media",
        description: "Reduce unnecessary scrolling",
        category: "Productivity",
        frequency: "daily",
        reason: "Saves time and attention",
        icon: "📱",
      },
      {
        name: "Review Daily Goals",
        description: "Check progress every evening",
        category: "Productivity",
        frequency: "daily",
        reason: "Keeps you accountable",
        icon: "🎯",
      },
    ],
  });
}
};