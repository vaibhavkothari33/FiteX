// /src/components/StatsCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatsCard = ({ icon, title, value, goal, unit }) => {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={40} color="#FF6B00" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value} / {goal} {unit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: 100,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#FF6B00',
  },
});

export default StatsCard;
