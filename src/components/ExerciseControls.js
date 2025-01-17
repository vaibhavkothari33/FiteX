import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExerciseControls = ({ timer, setTimer }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1); // Increase timer by 1 every second
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId); // Stop the timer when not running
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clean up interval when component unmounts
      }
    };
  }, [isRunning, intervalId, setTimer]);

  const startPauseTimer = () => {
    setIsRunning(!isRunning); // Toggle timer state
  };

  const resetTimer = () => {
    setIsRunning(false); // Stop the timer
    setTimer(0); // Reset timer to 0
  };

  // Convert seconds to minutes and seconds format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.pauseButton : styles.startButton]}
          onPress={startPauseTimer}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FF6B00',
  },
  pauseButton: {
    backgroundColor: '#FF4500',
  },
  resetButton: {
    backgroundColor: '#808080',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseControls;
