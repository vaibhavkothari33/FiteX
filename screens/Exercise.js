import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Exercise data with proper metadata
const exerciseData = {
  light: [
    { 
      id: 'dip1',
      name: 'Basic Dips',
      duration: 30,
      breakTime: 10,
      caloriesBurn: 8,
      instructions: 'Keep your elbows close to your body and lower yourself slowly',
      image: require('../src/assets/images/dips/dip1.gif'),
    },
    {
      id: 'dip2',
      name: 'Bench Dips',
      duration: 30,
      breakTime: 10,
      caloriesBurn: 10,
      instructions: 'Keep your back straight and lower until arms are parallel',
      image: require('../src/assets/images/dips/dip2.gif'),
    },
    // Add more exercises with metadata
  ],
  medium: [
    {
      id: 'leg1',
      name: 'Squats',
      duration: 45,
      breakTime: 15,
      caloriesBurn: 12,
      instructions: 'Keep your back straight and feet shoulder-width apart',
      image: require('../src/assets/images/legs/leg1.gif'),
    },
    // Add more exercises
  ],
  heavy: [
    {
      id: 'flag1',
      name: 'Human Flag Prep',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/flag/flag1.gif'),
    },
    // Add more exercises
  ],
};

const Exercise = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const handleTimer = useCallback(() => {
    if (!isWorkoutActive) return;

    if (timer > 0) {
      setTimer(prev => prev - 1);
    } else {
      if (isBreak) {
        // Break is over, move to next exercise
        setIsBreak(false);
        const nextExercise = exerciseData[selectedLevel][exerciseIndex + 1];
        if (nextExercise) {
          setExerciseIndex(prev => prev + 1);
          setCurrentExercise(nextExercise);
          setTimer(nextExercise.duration);
          setTotalCaloriesBurned(prev => prev + currentExercise.caloriesBurn);
        } else {
          setWorkoutComplete(true);
          setIsWorkoutActive(false);
        }
      } else {
        // Exercise is over, start break
        setIsBreak(true);
        setTimer(currentExercise.breakTime);
      }
    }
  }, [timer, isBreak, isWorkoutActive, selectedLevel, exerciseIndex, currentExercise]);

  useEffect(() => {
    const interval = setInterval(handleTimer, 1000);
    return () => clearInterval(interval);
  }, [handleTimer]);

  const startWorkout = () => {
    if (!selectedLevel) return;
    
    const firstExercise = exerciseData[selectedLevel][0];
    setCurrentExercise(firstExercise);
    setTimer(firstExercise.duration);
    setExerciseIndex(0);
    setIsWorkoutActive(true);
    setWorkoutComplete(false);
    setTotalCaloriesBurned(0);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  const confirmQuit = () => {
    Alert.alert(
      "Quit Workout",
      "Are you sure you want to quit your current workout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Quit", style: "destructive", onPress: resetWorkout }
      ]
    );
  };

  const resetWorkout = () => {
    setSelectedLevel(null);
    setCurrentExercise(null);
    setExerciseIndex(0);
    setTimer(0);
    setIsBreak(false);
    setIsWorkoutActive(false);
    setWorkoutComplete(false);
    setTotalCaloriesBurned(0);
  };

  const renderLevelSelection = () => (
    <View style={styles.levelSelection}>
      {Object.keys(exerciseData).map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.levelCard,
            { backgroundColor: level === 'light' ? '#FF6B00' : level === 'medium' ? '#4CAF50' : '#f44336' }
          ]}
          onPress={() => setSelectedLevel(level)}
        >
          <Text style={styles.levelTitle}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
          <Text style={styles.levelDesc}>
            {level === 'light' ? '15 min • Beginner' : 
             level === 'medium' ? '25 min • Intermediate' : 
             '40 min • Advanced'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderExerciseView = () => (
    <View style={styles.exerciseContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmQuit} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF6B00" />
        </TouchableOpacity>
        <Text style={styles.exerciseTitle}>
          {currentExercise?.name || `${selectedLevel} Workout`}
        </Text>
      </View>

      {workoutComplete ? (
        <View style={styles.completionCard}>
          <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          <Text style={styles.completionTitle}>Workout Complete!</Text>
          <Text style={styles.completionStats}>
            Calories Burned: {totalCaloriesBurned}
          </Text>
          <TouchableOpacity 
            style={styles.newWorkoutButton}
            onPress={resetWorkout}
          >
            <Text style={styles.buttonText}>Start New Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {currentExercise && (
            <View style={styles.exerciseDetails}>
              <Image
                source={currentExercise.image}
                style={styles.exerciseImage}
                resizeMode="contain"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.timerText}>
                  {isBreak ? 'Break Time' : 'Exercise Time'}: {timer}s
                </Text>
                {!isBreak && (
                  <Text style={styles.instructions}>
                    {currentExercise.instructions}
                  </Text>
                )}
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Exercise {exerciseIndex + 1} of {exerciseData[selectedLevel].length}
                </Text>
                <Text style={styles.caloriesText}>
                  Calories Burned: {totalCaloriesBurned}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.controls}>
            {!isWorkoutActive ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={currentExercise ? resumeWorkout : startWorkout}
              >
                <Text style={styles.buttonText}>
                  {currentExercise ? 'Resume' : 'Start Workout'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.pauseButton}
                onPress={pauseWorkout}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!selectedLevel ? renderLevelSelection() : renderExerciseView()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  levelSelection: {
    padding: 20,
    gap: 15,
  },
  levelCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  levelDesc: {
    fontSize: 16,
    color: '#fff',
  },
  exerciseContainer: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    padding: 20,
  },
  exerciseImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  caloriesText: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  controls: {
    padding: 20,
  },
  startButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionCard: {
    alignItems: 'center',
    padding: 30,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  completionStats: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  newWorkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
});

export default Exercise;