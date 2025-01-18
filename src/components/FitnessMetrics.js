import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import CircularProgress from './CircularProgress';

const FitnessMetrics = ({ healthData }) => {
  const metrics = [
    {
      title: 'Steps',
      value: healthData.steps,
      maxValue: 10000,
      unit: 'steps',
      color: '#FF6B00',
    },
    {
      title: 'Calories',
      value: healthData.calories,
      maxValue: 2500,
      unit: 'kcal',
      color: '#FF9F00',
    },
    {
      title: 'Heart Rate',
      value: healthData.heartRate || 75,
      maxValue: 220,
      unit: 'bpm',
      color: '#FF4757',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <CircularProgress
            key={index}
            title={metric.title}
            value={metric.value}
            maxValue={metric.maxValue}
            unit={metric.unit}
            color={metric.color}
            size={Dimensions.get('window').width * 0.28}
            strokeWidth={10}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});

export default FitnessMetrics;