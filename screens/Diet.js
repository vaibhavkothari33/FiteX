import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MealCard = ({ title, meals }) => (
  <View style={styles.mealCard}>
    <Text style={styles.mealTitle}>{title}</Text>
    {meals.map((meal, index) => (
      <View key={index} style={styles.mealItem}>
        <Ionicons name="restaurant-outline" size={24} color="#FF6B00" />
        <View style={styles.mealDetails}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealCalories}>{meal.calories} calories</Text>
        </View>
      </View>
    ))}
  </View>
);

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
      setMealPlan(data);
    } catch (error) {
      setError("Failed to generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personalized Meal Plan</Text>
        <Text style={styles.subtitle}>Generate a meal plan based on your preferences</Text>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="nutrition-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your dietary preferences"
          value={preferences}
          onChangeText={setPreferences}
          multiline
          numberOfLines={3}
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleGenerateMealPlan}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={24} color="#fff" style={styles.loadingIcon} />
            <Text style={styles.buttonText}>Generating...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Ionicons name="create-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Generate Meal Plan</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {mealPlan && (
        <View style={styles.mealPlanContainer}>
          <Text style={styles.mealPlanTitle}>Your Meal Plan</Text>
          <MealCard title="Breakfast" meals={mealPlan.breakfast} />
          <MealCard title="Lunch" meals={mealPlan.lunch} />
          <MealCard title="Dinner" meals={mealPlan.dinner} />
          <MealCard title="Snacks" meals={mealPlan.snacks} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    margin: 20,
    borderRadius: 12,
    padding: 15,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#FF6B00',
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  generateButtonDisabled: {
    backgroundColor: '#ffab7a',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  errorText: {
    color: '#ff4444',
    marginLeft: 8,
    fontSize: 16,
  },
  mealPlanContainer: {
    padding: 20,
  },
  mealPlanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealDetails: {
    marginLeft: 12,
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
  },
});

export default Diet;