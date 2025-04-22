import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Dimensions,
  Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '../utils/GeminiAI';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const CheatMealDetector = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageKey, setImageKey] = useState(0); // Add key to force re-render without clearing image
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Reference to the ScrollView
  const scrollViewRef = useRef(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setCameraPermission(cameraStatus.status === 'granted');
        
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryStatus.status === 'granted');
      }
    })();
  }, []);

  // Animation when results appear
  useEffect(() => {
    if (result) {
      // Scroll to results after a short delay to ensure UI is updated
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 350, animated: true });
      }, 300);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when result is cleared
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [result]);

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
        quality: 0.8,
        exif: false,
      });
      
      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        setResult(null);
        setError(null);
        // Increment key to force re-render without clearing image
        setImageKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error("Gallery picker error:", error);
      setError("Failed to pick image: " + (error.message || "Unknown error"));
    }
  };

  // Take Photo with Camera - Fixed to prevent refresh issues
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

      // Launch camera with optimized settings
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Allow editing for better composition
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        presentationStyle: 'overFullScreen', // Prevents fullscreen issues on iOS
      });
      
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const newImageUri = pickerResult.assets[0].uri;
        // Only update if we got a new image
        if (newImageUri) {
          setImage(newImageUri);
          setResult(null);
          setError(null);
          // Increment key to force re-render without clearing image
          setImageKey(prevKey => prevKey + 1);
        }
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
    
    // Define order of nutrition information for better presentation
    const orderedKeys = [
      'calories', 'protein', 'fat', 'carbs', 'fiber', 'sugar', 'sodium'
    ];
    
    // Get all keys from the nutrition info
    const allKeys = Object.keys(result.nutritionInfo);
    
    // Filter ordered keys to only include those that exist in the result
    const existingOrderedKeys = orderedKeys.filter(key => allKeys.includes(key));
    
    // Add any additional keys not in our ordered list
    const remainingKeys = allKeys.filter(key => !orderedKeys.includes(key));
    const displayKeys = [...existingOrderedKeys, ...remainingKeys];
    
    return (
      <View style={styles.nutritionTable}>
        <View style={styles.nutritionHeader}>
          <Text style={styles.nutritionHeaderText}>Nutrient</Text>
          <Text style={styles.nutritionHeaderText}>Amount</Text>
        </View>
        {displayKeys.map((key) => (
          <View key={key} style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <Text 
              style={[
                styles.nutritionValue,
                key === 'calories' && styles.caloriesValue
              ]}
            >
              {result.nutritionInfo[key]}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDietInfo = () => {
    if (!result || !result.isDietFriendly) return null;
    
    const formatDietName = (name) => {
      // Handle special cases
      if (name === 'glutenFree') return 'Gluten Free';
      // General case: split on capital letters and capitalize first letter of each word
      return name.replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
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
                {formatDietName(diet)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Food Analyzer</Text>
          <Text style={styles.subtitle}>Upload a food image to get nutrition facts</Text>
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <Image 
              key={imageKey} // Add key to force re-render without clearing
              source={{ uri: image }} 
              style={styles.foodImage} 
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="fast-food-outline" size={80} color="#ccc" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
          
          {/* Image source indicator */}
          {image && (
            <View style={styles.imageSourceTag}>
              <Ionicons 
                name={imageKey % 2 === 0 ? "camera" : "images"} 
                size={14} 
                color="#fff" 
              />
              <Text style={styles.imageSourceText}>
                {imageKey % 2 === 0 ? "Camera" : "Gallery"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.galleryButton]} 
            onPress={pickImage}
            disabled={loading}
          >
            <Ionicons name="images-outline" size={22} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.cameraButton]} 
            onPress={takePhoto}
            disabled={loading}
          >
            <Ionicons name="camera-outline" size={22} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.analyzeButton, 
            (!image || loading) && styles.disabledButton
          ]} 
          onPress={analyzeImage}
          disabled={!image || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="nutrition-outline" size={22} color="white" />
              <Text style={styles.analyzeButtonText}>
                {result ? "Analyze Again" : "Analyze Food"}
              </Text>
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
          <Animated.View 
            style={[
              styles.resultContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.foodHeaderContainer}>
              <Text style={styles.detectedFood}>{result.food}</Text>
              {result.mealType && (
                <View style={styles.mealTypeTag}>
                  <Ionicons 
                    name={
                      result.mealType === "Breakfast" ? "sunny-outline" :
                      result.mealType === "Lunch" ? "time-outline" :
                      result.mealType === "Dinner" ? "moon-outline" : 
                      "restaurant-outline"
                    } 
                    size={14} 
                    color="#1976D2" 
                  />
                  <Text style={styles.mealTypeText}>{result.mealType}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.nutritionContainer}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="nutrition-outline" size={18} color="#444" style={styles.sectionIcon} />
                Nutrition Facts
              </Text>
              {renderNutritionInfo()}
            </View>

            {renderDietInfo()}

            {result.healthierAlternative && (
              <View style={styles.alternativeContainer}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="leaf-outline" size={18} color="#2E7D32" style={styles.sectionIcon} />
                  Healthier Alternative
                </Text>
                <Text style={styles.alternativeText}>{result.healthierAlternative}</Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#f2f4f6',
  },
  placeholderText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 16,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageSourceTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  imageSourceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryButton: {
    backgroundColor: 'blue',
  },
  cameraButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    // backgroundColor: 'orange',
    marginLeft: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#FDA172',
    shadowOpacity: 0.1,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    color: '#B91C1C',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  foodHeaderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detectedFood: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  mealTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  mealTypeText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#334155',
  },
  sectionIcon: {
    marginRight: 6,
  },
  nutritionContainer: {
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
  },
  nutritionTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  nutritionHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nutritionLabel: {
    fontSize: 15,
    color: '#475569',
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  caloriesValue: {
    color: '#ef4444',
    fontWeight: '700',
  },
  dietInfoContainer: {
    marginBottom: 20,
  },
  dietBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  dietBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  compatibleDiet: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  incompatibleDiet: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dietText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  compatibleDietText: {
    color: '#047857',
  },
  incompatibleDietText: {
    color: '#B91C1C',
  },
  alternativeContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4ADE80',
  },
  alternativeText: {
    fontSize: 15,
    color: '#166534',
    lineHeight: 22,
  },
});

export default CheatMealDetector;