import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MealPlanDisplay = ({ title, meals }) => {
  if (!meals || !Array.isArray(meals)) {
    return null;
  }

  return (
    <View style={styles.mealCard}>
      <Text style={styles.mealTitle}>{title}</Text>
      {meals.map((meal, index) => (
        <View key={index} style={styles.mealItem}>
          <Ionicons name="restaurant-outline" size={24} color="#FF6B00" />
          <View style={styles.mealDetails}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealCalories}>{meal.calories} calories</Text>
            <Text style={styles.mealCalories}>{meal.proteins} g protein</Text>
            {meal.ingredients && (
              <Text style={styles.ingredients}>
                Ingredients: {Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : meal.ingredients}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'flex-start',
    paddingVertical: 12,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default MealPlanDisplay;