import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // for gradient background

const Entry = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulating a loading screen
  }, []);

  return (
    <LinearGradient
      colors={['#FFEDD5', '#FF6B00']} // Gradient colors from light to dark
      style={styles.container}
    >
      {/* Displaying the uploaded image */}
      <Image source={require('../images/fitex.png')} style={styles.logo} />
      <Text style={styles.title}>FiteX</Text>
      <Text style={styles.subtitle}>Track your Health Journey with ease</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
      ) : (
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75, // Makes the logo circular
    borderWidth: 2,
  },
  title: {
    fontSize: 30, // Adjusted font size for a more prominent title
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40, // More space between subtitle and button
    lineHeight: 24, // Adds better line spacing for readability
  },
  getStartedButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Adds shadow effect for Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginBottom: 30,
  },
});

export default Entry;
