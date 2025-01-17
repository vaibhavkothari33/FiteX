const GEMINI_API_KEY = 'YOUR_GEMINI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateMealPlan = async (preferences) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a detailed meal plan based on these preferences: ${preferences}. 
                   Include breakfast, lunch, dinner, and snacks. For each meal, provide the name,
                   calories, and ingredients. Format as JSON with structure: 
                   {breakfast: [{name, calories}], lunch: [{name, calories}], 
                   dinner: [{name, calories}], snacks: [{name, calories}]}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate meal plan');
    }

    const data = await response.json();
    // Parse the response text as JSON since Gemini returns formatted text
    const mealPlan = JSON.parse(data.candidates[0].content.parts[0].text);
    return mealPlan;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};