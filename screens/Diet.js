import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateMealPlan } from '../utils/geminiAPI';
import MealPlanDisplay from '../src/components/MealPlanDisplay';
import DietaryPreferences from '../src/components/DietaryPreferences';

const Diet = () => {
  const [preferences, setPreferences] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const onTogglePreference = (prefId) => {
    setSelectedPreferences(prev => {
      if (prev.includes(prefId)) {
        return prev.filter(p => p !== prefId);
      } else {
        return [...prev, prefId];
      }
    });
  };

  const handleGenerateMealPlan = async () => {
    if (selectedPreferences.length === 0 && !preferences.trim()) {
      Alert.alert('Error', 'Please select preferences or enter custom requirements');
      return;
    }

    const allPreferences = [
      ...selectedPreferences,
      preferences.trim()
    ].filter(Boolean).join(', ');

    setLoading(true);
    try {
      const data = await generateMealPlan(allPreferences);
      if (data) {
        setMealPlan(data);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Failed to generate meal plan. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI-Powered Meal Plan</Text>
      </View>

      <DietaryPreferences
        selectedPreferences={selectedPreferences}
        onTogglePreference={onTogglePreference}
      />

      <View style={styles.divider} />

      <View style={styles.inputContainer}>
        <Ionicons name="create-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Add additional preferences or restrictions..."
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
            <ActivityIndicator color="#fff" style={styles.loadingIcon} />
            <Text style={styles.buttonText}>Generating...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Ionicons name="nutrition" size={24} color="#fff" />
            <Text style={styles.buttonText}>Generate Meal Plan</Text>
          </View>
        )}
      </TouchableOpacity>

      {mealPlan && (
        <View style={styles.mealPlanContainer}>
          <Text style={styles.mealPlanTitle}>Your AI-Generated Meal Plan</Text>
          {mealPlan.breakfast && <MealPlanDisplay title="Breakfast" meals={mealPlan.breakfast} />}
          {mealPlan.lunch && <MealPlanDisplay title="Lunch" meals={mealPlan.lunch} />}
          {mealPlan.snacks && <MealPlanDisplay title="Snacks" meals={mealPlan.snacks} />}
          {mealPlan.dinner && <MealPlanDisplay title="Dinner" meals={mealPlan.dinner} />}
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
  exampleContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  exampleTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
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
  mealPlanContainer: {
    padding: 20,
  },
  mealPlanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

export default Diet;