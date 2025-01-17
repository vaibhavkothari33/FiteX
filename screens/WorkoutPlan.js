import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { generateWorkoutPlan } from '../utils/geminiAPI';
import WorkoutDayCard from '../components/WorkoutDayCard';

const WorkoutPlan = ({ route }) => {
  const { userData } = route.params;
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    try {
      const plan = await generateWorkoutPlan(userData);
      setWorkoutPlan(plan);
    } catch (error) {
      setError('Failed to generate workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text>Generating your personalized workout plan...</Text>
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
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
    },
    });

export default WorkoutPlan;