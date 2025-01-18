import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');


const exerciseData = {
  light: [
    {
      id: 'dip1',
      name: 'Basic Dips',
      duration: 10,
      breakTime: 5,
      caloriesBurn: 8,
      instructions: 'Keep your elbows close to your body and lower yourself slowly',
      image: require('../src/assets/images/dips/dip1.gif'),
    },
    {
      id: 'dip2',
      name: 'Bench Dips',
      duration: 7,
      breakTime: 5,
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
    {
      id: 'leg2',
      name: 'Bulgarian Squats',
      duration: 45,
      breakTime: 15,
      caloriesBurn: 12,
      instructions: 'Keep your back straight and feet shoulder-width apart',
      image: require('../src/assets/images/legs/leg2.gif'),
    },
    {
      id: 'leg3',
      name: 'Squats',
      duration: 45,
      breakTime: 15,
      caloriesBurn: 12,
      instructions: 'Keep your back straight and feet shoulder-width apart',
      image: require('../src/assets/images/legs/leg3.gif'),
    },
    {
      id: 'leg4',
      name: 'Plank',
      duration: 45,
      breakTime: 15,
      caloriesBurn: 12,
      instructions: 'Keep your back straight and feet shoulder-width apart',
      image: require('../src/assets/images/legs/leg4.gif'),
    },
    // Add more exercises
  ],
  heavy: [
    {
      id: 'chest1',
      name: 'Archer Pushups',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/Chest/chest1.gif'),
    },
    {
      id: 'chest2',
      name: 'Clap Pushups',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/Chest/chest1.gif'),
    },
    {
      id: 'chest3',
      name: 'Decline Pushups',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/Chest/chest1.gif'),
    },
    {
      id: 'chest4',
      name: 'Diamond Pushups',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/Chest/chest1.gif'),
    },
    {
      id: 'chest5',
      name: 'Incline Pushups',
      duration: 60,
      breakTime: 20,
      caloriesBurn: 15,
      instructions: 'Start with a strong grip and engage your core',
      image: require('../src/assets/images/Chest/chest1.gif'),
    },
    // {
    //   id: 'chest6',
    //   name: 'Human Flag Prep',
    //   duration: 60,
    //   breakTime: 20,
    //   caloriesBurn: 15,
    //   instructions: 'Start with a strong grip and engage your core',
    //   image: require('../src/assets/images/Chest/chest1.gif'),
    // },
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
  const [cardScale] = useState(new Animated.Value(1));


  const animatePress = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLevelSelect = (level) => {
    animatePress();
    setTimeout(() => setSelectedLevel(level), 200);
  };

  const handleTimer = useCallback(() => {
    if (!isWorkoutActive) return;

    if (timer > 0) {
      setTimer(prev => prev - 1);
    } else {
      if (isBreak) {
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
    <View style={styles.levelSelectionContainer}>
      <Text style={styles.welcomeText}>Choose Your Workout Level</Text>
      <View style={styles.levelSelection}>
        {Object.keys(exerciseData).map((level) => (
          <Animated.View
            key={level}
            style={[
              styles.levelCardContainer,
              { transform: [{ scale: cardScale }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.levelCard,
                { backgroundColor: '#FF6B00' } // Or whatever color you're using
              ]}
              onPress={() => handleLevelSelect(level)}
            >
              <View style={styles.levelCardContent}>
                <Text style={styles.levelTitle}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
                <Text style={styles.levelDesc}>
                  {level === 'light' ? '15 min • Beginner' :
                    level === 'medium' ? '25 min • Intermediate' :
                      '40 min • Advanced'}
                </Text>
              </View>
              <Ionicons
                name={
                  level === 'light' ? 'walk-outline' :
                    level === 'medium' ? 'bicycle-outline' :
                      'barbell-outline'
                }
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
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
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  levelSelection: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 20,
    alignItems: 'center',
  },
  levelCard: {
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%', // Increased width
    height: 140, // Fixed height for rectangular shape
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: 'row', // Changed to row layout
    justifyContent: 'space-between', // Space between elements
    paddingHorizontal: 30, // More horizontal padding
  },
  levelCardContent: {
    alignItems: 'flex-start', // Align text to the left
  },
  levelTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  levelDesc: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },

  exerciseContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  exerciseDetails: {
    padding: 20,
    backgroundColor: '#fff',
  },
  exerciseImage: {
    width: '100%',
    height: 320,
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  instructions: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  caloriesText: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: '700',
  },
  controls: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pauseButton: {
    backgroundColor: '#555',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completionCard: {
    alignItems: 'center',
    padding: 30,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 15,
    color: '#333',
    letterSpacing: 0.5,
  },
  completionStats: {
    fontSize: 20,
    color: '#555',
    marginBottom: 25,
    fontWeight: '600',
  },
  newWorkoutButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Exercise;