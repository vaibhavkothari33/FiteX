import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDvqPYipnjb5jAozUqdmcboOrNqSKSZUWE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateMealPlan = async (preferences) => {
  try {
    const prompt = `Create a meal plan for someone with these preferences: ${preferences}. 
    Return ONLY a JSON object with this structure, no other text:
    {
      "breakfast": [{
        "name": "Meal Name",
        "calories": 300,
        "proteins": 30,
        "ingredients": ["ingredient 1", "ingredient 2"]
      }],
      "lunch": [{
        "name": "Meal Name",
        "calories": 400,
         "proteins": 150,
        "ingredients": ["ingredient 1", "ingredient 2"]
      }],
      "dinner": [{
        "name": "Meal Name",
        "calories": 500,
         "proteins": 100,
        "ingredients": ["ingredient 1", "ingredient 2"]
      }],
      "snacks": [{
        "name": "Meal Name",
        "calories": 200,
         "proteins": 200,
        "ingredients": ["ingredient 1", "ingredient 2"]
      }]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean and parse the response
    const cleanText = text.replace(/```json|```/g, '').trim();
    console.log('API Response:', text);
    console.log('Cleaned response:', cleanText);

    try {
      const mealPlan = JSON.parse(cleanText);
      console.log('Parsed meal plan:', mealPlan);
      return mealPlan;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Invalid meal plan format received');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Unable to generate meal plan');
  }
};