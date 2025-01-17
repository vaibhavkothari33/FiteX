// /src/components/HealthTipsCarousel.js
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const HealthTipsCarousel = ({ tips }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {tips.map((tip, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginRight: 15,
    width: 250,
  },
  tipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HealthTipsCarousel;
