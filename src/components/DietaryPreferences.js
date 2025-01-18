import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DietaryPreferences = ({ selectedPreferences, onTogglePreference }) => {
  const preferences = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'leaf-outline' },
    { id: 'vegan', label: 'Vegan', icon: 'nutrition-outline' },
    { id: 'highProtein', label: 'High Protein', icon: 'barbell-outline' },
    { id: 'lowCarb', label: 'Low Carb', icon: 'pizza-outline' },
    { id: 'glutenFree', label: 'Gluten Free', icon: 'warning-outline' },
    { id: 'dairyFree', label: 'Dairy Free', icon: 'water-outline' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dietary Preferences</Text>
      <View style={styles.preferencesGrid}>
        {preferences.map((pref) => (
          <TouchableOpacity
            key={pref.id}
            style={[
              styles.preferenceItem,
              selectedPreferences.includes(pref.id) && styles.preferenceItemSelected,
            ]}
            onPress={() => onTogglePreference(pref.id)}
          >
            <Ionicons
              name={selectedPreferences.includes(pref.id) ? 'checkbox' : 'square-outline'}
              size={24}
              color={selectedPreferences.includes(pref.id) ? '#FF6B00' : '#666'}
              style={styles.checkbox}
            />
            <Ionicons name={pref.icon} size={20} color="#666" style={styles.prefIcon} />
            <Text style={styles.preferenceLabel}>{pref.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  preferenceItemSelected: {
    backgroundColor: '#FFF0E6',
  },
  checkbox: {
    marginRight: 8,
  },
  prefIcon: {
    marginRight: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default DietaryPreferences;