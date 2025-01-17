const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'YOUR_GEMINI';

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

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate workout plan');
    }

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

