// /src/screens/Entry.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';

const Entry = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Updated the image path */}
      {/* <Image source={require('WorkoutApp\src\assets\image.png')} style={styles.logo} /> */}
      <Text style={styles.title}>Bourbon Fitness</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" />
      ) : (
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  getStartedButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Entry;
