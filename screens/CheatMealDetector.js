import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '../utils/GeminiAI';
import { Ionicons } from '@expo/vector-icons';

const CheatMealDetector = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      // Request camera permissions just once when component mounts
      if (Platform.OS !== 'web') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setCameraPermission(cameraStatus.status === 'granted');
        
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryStatus.status === 'granted');
      }
    })();
  }, []);

  // Pick Image from Gallery
  const pickImage = async () => {
    try {
      if (!galleryPermission) {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          setError("Permission to access gallery is required!");
          return;
        }
        setGalleryPermission(true);
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: false, // Disable EXIF data to reduce memory usage
      });
      
      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        setResult(null);
        setError(null);
      }
    } catch (error) {
      console.error("Gallery picker error:", error);
      setError("Failed to pick image: " + (error.message || "Unknown error"));
    }
  };

  // Take Photo with Camera
  const takePhoto = async () => {
    try {
      if (!cameraPermission) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          setError("Camera permission is required!");
          return;
        }
        setCameraPermission(true);
      }

      // Launch camera with minimal options to prevent crashes
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // Set to false to reduce processing
        aspect: [4, 3],
        quality: 0.8, // Slightly reduce quality to improve performance
        exif: false, // Disable EXIF data to reduce memory usage
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        presentationStyle: 'fullScreen', // Use fullScreen on iOS to prevent UI issues
      });
      
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setImage(pickerResult.assets[0].uri);
        setResult(null);
        setError(null);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setError("Failed to take photo: " + (error.message || "Unknown error"));
    }
  };

  // Analyze Image
  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const analysis = await analyzeFoodImage(image);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze image: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const renderNutritionInfo = () => {
    if (!result || !result.nutritionInfo) return null;
    
    return Object.entries(result.nutritionInfo).map(([key, value]) => (
      <View key={key} style={styles.nutritionItem}>
        <Text style={styles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
        <Text style={styles.nutritionValue}>{value}</Text>
      </View>
    ));
  };

  const renderDietInfo = () => {
    if (!result || !result.isDietFriendly) return null;
    
    return (
      <View style={styles.dietInfoContainer}>
        <Text style={styles.sectionTitle}>Diet Compatibility</Text>
        <View style={styles.dietBadgesContainer}>
          {Object.entries(result.isDietFriendly).map(([diet, isCompatible]) => (
            <View 
              key={diet} 
              style={[
                styles.dietBadge, 
                isCompatible ? styles.compatibleDiet : styles.incompatibleDiet
              ]}
            >
              <Ionicons 
                name={isCompatible ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={isCompatible ? "#2E7D32" : "#B71C1C"} 
              />
              <Text style={[
                styles.dietText,
                isCompatible ? styles.compatibleDietText : styles.incompatibleDietText
              ]}>
                {diet.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + diet.replace(/([A-Z])/g, ' $1').trim().slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Food Analyzer</Text>
          <Text style={styles.subtitle}>Upload a food image to get nutrition facts</Text>
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.foodImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="fast-food-outline" size={80} color="#ccc" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={pickImage}
            disabled={loading}
          >
            <Ionicons name="images-outline" size={22} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={takePhoto}
            disabled={loading}
          >
            <Ionicons name="camera-outline" size={22} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.analyzeButton, (!image || loading) && styles.disabledButton]} 
          onPress={analyzeImage}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="nutrition-outline" size={22} color="white" />
              <Text style={styles.analyzeButtonText}>Analyze Food</Text>
            </>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.foodHeaderContainer}>
              <Text style={styles.detectedFood}>{result.food}</Text>
              {result.mealType && (
                <View style={styles.mealTypeTag}>
                  <Text style={styles.mealTypeText}>{result.mealType}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.nutritionContainer}>
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              {renderNutritionInfo()}
            </View>

            {renderDietInfo()}

            {result.healthierAlternative && (
              <View style={styles.alternativeContainer}>
                <Text style={styles.sectionTitle}>Healthier Alternative</Text>
                <Text style={styles.alternativeText}>{result.healthierAlternative}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3d00',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ff3d00',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  foodHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  detectedFood: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 8,
  },
  mealTypeTag: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  mealTypeText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  nutritionContainer: {
    marginBottom: 15,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#555',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dietInfoContainer: {
    marginBottom: 15,
  },
  dietBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  dietBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  compatibleDiet: {
    backgroundColor: '#E8F5E9',
  },
  incompatibleDiet: {
    backgroundColor: '#FFEBEE',
  },
  dietText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  compatibleDietText: {
    color: '#2E7D32',
  },
  incompatibleDietText: {
    color: '#B71C1C',
  },
  alternativeContainer: {
    backgroundColor: '#F6FFF9',
    borderRadius: 8,
    padding: 12,
  },
  alternativeText: {
    fontSize: 16,
    color: '#2E7D32',
    lineHeight: 22,
  },
});

export default CheatMealDetector;