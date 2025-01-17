// /src/screens/Dashboard.js
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import StatsCard from '../src/components/StatsCard';

const Dashboard = () => {
  const [healthData, setHealthData] = useState({
    steps: 0,
    calories: 0,
    water: 0,
    goals: [],
  });

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.graphContainer}>
        {/* Add charts here if needed */}
      </View>
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Daily Tips</Text>
        {/* Add health tips carousel if needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Dashboard;
