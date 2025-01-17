// /src/screens/Diet.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { generateMealPlan } from '../utils/geminiAPI'; // Correct import path

const Diet = () => {
  const [preferences, setPreferences] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await generateMealPlan(preferences);
      setMealPlan(data);  // Assuming the API returns the meal plan data
    } catch (error) {
      setError("Failed to generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your dietary preferences"
        value={preferences}
        onChangeText={setPreferences}
      />
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateMealPlan}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Generating..." : "Generate Meal Plan"}</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {mealPlan && (
        <View style={styles.mealPlanContainer}>
          {/* Display meal plan here */}
          <Text>Meal Plan:</Text>
          <Text>{JSON.stringify(mealPlan, null, 2)}</Text> {/* You can format this better */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  generateButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  mealPlanContainer: {
    marginTop: 20,
  },
});

export default Diet;
