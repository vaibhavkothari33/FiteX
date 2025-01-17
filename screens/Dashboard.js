import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity,Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatsCard = ({ icon, title, value, goal, unit }) => {
  const progress = (value / goal) * 100;
  
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Ionicons name={icon} size={24} color="#FF6B00" />
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
      <Text style={styles.statsValue}>
        {value.toLocaleString()} <Text style={styles.statsUnit}>{unit}</Text>
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
      <Text style={styles.goalText}>Goal: {goal.toLocaleString()} {unit}</Text>
    </View>
  );
};

const TipCard = ({ tip }) => (
  <View style={styles.tipCard}>
    <Ionicons name="bulb-outline" size={24} color="#FF6B00" />
    <Text style={styles.tipText}>{tip}</Text>
  </View>
);

const Dashboard = () => {
  const [healthData, setHealthData] = useState({
    steps: 7500,
    calories: 1800,
    water: 5,
    goals: [],
  });

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `🏃‍♂️ My Fitness Progress Today:\n\n` +
          `Steps: ${healthData.steps}/10,000\n` +
          `Calories Burned: ${healthData.calories}/2,500\n` +
          `Water Intake: ${healthData.water}/8 glasses\n\n` +
          `💪 Tracking my fitness journey with FitnessApp!`,
        title: 'My Fitness Progress',
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const dailyTips = [
    "Stay hydrated! Aim to drink water regularly throughout the day.",
    "Take a 5-minute stretch break every hour while working.",
    "Try to get at least 7-8 hours of sleep tonight.",
  ];

  return (
   <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Hello Nalin</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatsCard
          icon="footsteps"
          title="Steps"
          value={healthData.steps}
          goal={10000}
          unit="steps"
        />
        <StatsCard
          icon="flame"
          title="Calories"
          value={healthData.calories}
          goal={2500}
          unit="kcal"
        />
        <StatsCard
          icon="water"
          title="Water"
          value={healthData.water}
          goal={8}
          unit="glasses"
        />
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Daily Tips</Text>
        {dailyTips.map((tip, index) => (
          <TipCard key={index} tip={tip} />
        ))}
      </View>
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
  date: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    padding: 20,
  },
  statsCard: {
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 8,
  },
  statsUnit: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 3,
  },
  goalText: {
    fontSize: 14,
    color: '#666',
  },
  tipsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareButton: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});


export default Dashboard;