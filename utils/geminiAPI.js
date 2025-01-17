// /src/utils/geminiAPI.js

const GEMINI_API_URL = "https://api.example.com/generate-meal-plan"; // Replace with actual API URL

// Function to fetch meal plan based on dietary preferences
export const generateMealPlan = async (preferences) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_API_KEY`, // Replace with your actual API key
      },
      body: JSON.stringify({
        preferences: preferences,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate meal plan.");
    }

    const data = await response.json();
    return data;  // Assuming the API returns the meal plan data
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    throw error;  // Re-throw the error so the calling function can handle it
  }
};
