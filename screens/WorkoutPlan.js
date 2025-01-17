
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { generateWorkoutPlan } from '../utils/geminiAPI';
import WorkoutDayCard from '../src/components/WorkoutDayCard';

const WorkoutPlan = ({ route }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = route.params;

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    try {
      const plan = await generateWorkoutPlan(userData);
      console.log('Generated workout plan:', plan);
      setWorkoutPlan(plan);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError('Failed to generate workout plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Generating your personalized workout plan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Personalized Workout Plan</Text>
      {workoutPlan?.days.map((day, index) => (
        <WorkoutDayCard key={index} day={day} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default WorkoutPlan;