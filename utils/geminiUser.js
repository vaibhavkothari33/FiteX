import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAyJEXAH9dLp_L0_7QJw0q1TIAKV63-VHk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateUserWorkout = async (userData) => {
  try {
    const prompt = `You are an experienced personal trainer creating a customized workout plan. Use this client data:

CLIENT PROFILE
Age: ${userData.age} years
Weight: ${userData.weight} kg
Height: ${userData.height} cm
Fitness Goal: ${userData.goal}
Experience Level: ${userData.level}
Available Days Per Week: ${userData.days}
Health Considerations: ${userData.healthConditions}
Equipment Access: ${userData.equipment}

REQUIREMENTS:
1. Create a workout plan for ${userData.days} days per week
2. Match exercises to their experience level (${userData.level})
3. Focus on their goal of ${userData.goal}
4. Only include exercises possible with their ${userData.equipment} equipment access
5. Account for any health conditions: ${userData.healthConditions}
6. For each exercise, provide specific rep ranges and practical form notes

STRICT OUTPUT RULES:
1. Respond ONLY with a JSON object
2. Follow this exact structure with no additional text or markdown:
{
  "days": [
    {
      "name": "Day 1 - [Focus Area]",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": "3-4",
          "reps": "8-12",
          "notes": "Specific form cues and safety tips"
        }
      ]
    }
  ]
}

EXERCISE GUIDELINES:
- For beginners: Focus on form, start with bodyweight/basic movements
- For intermediate: Include progressive overload and compound movements
- For advanced: Add complex movements and intensity techniques
- Weight Loss: Include cardio and compound movements
- Muscle Building: Focus on progressive overload and proper volume
- Endurance: Higher rep ranges, shorter rest periods
- Full Gym: Utilize all equipment options
- Minimal Equipment: Focus on bodyweight and creative variations

Return only valid JSON matching the specified structure. No additional text, explanations, or markdown.`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean the response text to ensure we only have JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in response');
    }

    const cleanText = text.slice(jsonStart, jsonEnd);

    try {
      const workoutPlan = JSON.parse(cleanText);
      
      // Validate the workout plan structure
      if (!workoutPlan.days || !Array.isArray(workoutPlan.days)) {
        throw new Error('Invalid workout plan format: missing days array');
      }

      // Validate each day's structure
      workoutPlan.days.forEach((day, index) => {
        if (!day.name || !Array.isArray(day.exercises)) {
          throw new Error(`Invalid format for day ${index + 1}`);
        }
      });

      return workoutPlan;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Failed to parse workout plan: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Workout Generation Error:', error);
    throw new Error(error.message || 'Unable to generate workout plan');
  }
};