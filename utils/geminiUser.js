import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyD-i2AbW8XGxzn5YBRRPvUlJHVPfhibIYM";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateWorkoutPlan = async (userData) => {
  try {
    const prompt = `Generate a personalized workout plan based on the following information:
      - Age: ${userData.age}
      - Weight: ${userData.weight} kg
      - Height: ${userData.height} cm
      - Fitness Goal: ${userData.fitnessGoal}
      - Experience Level: ${userData.experienceLevel}
      - Days per Week: ${userData.daysPerWeek}
      - Health Conditions: ${userData.healthConditions}
      - Equipment Access: ${userData.equipmentAccess}

      Create a detailed workout plan with exercises, sets, reps, and notes. Format the response as JSON with the following structure:
      {
        "days": [
          {
            "name": "Day 1 - Push",
            "exercises": [
              {
                "name": "Exercise Name",
                "sets": "3",
                "reps": "12",
                "notes": "Form tips or modifications"
              }
            ]
          }
        ]
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const cleanText = text.replace(/```json|```/g, '').trim();
    console.log('Workout Plan Response:', text);
    console.log('Cleaned response:', cleanText);

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Workout Plan Generation Error:', error);
    throw new Error('Unable to generate workout plan');
  }
};