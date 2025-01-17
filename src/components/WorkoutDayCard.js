import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutDayCard = ({ day }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.dayTitle}>{day.name}</Text>
      {day.exercises.map((exercise, index) => (
        <View key={index} style={styles.exercise}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDetails}>
            {exercise.sets} sets x {exercise.reps} reps
          </Text>
          <Text style={styles.exerciseNote}>{exercise.notes}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
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
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    exercise: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    exerciseName: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    exerciseDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    exerciseNote: {
        fontSize: 14,
        color: '#999',
    },
    });

export default WorkoutDayCard;