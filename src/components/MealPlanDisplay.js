// /src/components/MealPlanDisplay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealPlanDisplay = ({ mealPlan }) => {
  return (
    <View style={styles.container}>
      {mealPlan ? (
        mealPlan.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text>{meal.description}</Text>
            <Text>Calories: {meal.calories}</Text>
          </View>
        ))
      ) : (
        <Text>No meal plan available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  mealCard: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MealPlanDisplay;
