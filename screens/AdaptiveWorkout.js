import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Animated,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { generateUserWorkout } from '../utils/geminiUser';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AdaptiveWorkout = () => {
    // Form state
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [userLevel, setUserLevel] = useState('beginner');
    const [fitnessGoal, setFitnessGoal] = useState('weight_loss');
    const [daysPerWeek, setDaysPerWeek] = useState('2');
    const [healthConditions, setHealthConditions] = useState('');
    const [equipmentAccess, setEquipmentAccess] = useState('minimal');

    // UI state
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const scrollViewRef = useRef();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Step validation
    const isStep1Valid = age !== '' && weight !== '' && height !== '';
    const isStep2Valid = true; // These are dropdowns with default values
    const isStep3Valid = true; // Health conditions can be empty

    // Goal descriptions for better context
    const goalDescriptions = {
        weight_loss: 'Burn calories and reduce body fat',
        weight_gain: 'Build mass with progressive overload',
        endurance: 'Improve stamina and cardiovascular health',
        muscle_building: 'Hypertrophy-focused training for muscle growth',
        powerbuilding: 'Blend of strength and muscle building'
    };

    // Equipment descriptions
    const equipmentDescriptions = {
        minimal: 'Bodyweight exercises, resistance bands',
        basic: 'Access to dumbbells, basic machines',
        full: 'Full range of equipment including barbells and specialized machines'
    };

    const generateWorkout = async () => {
        setLoading(true);
        setError(null);

        try {
            const workout = await generateUserWorkout({
                age,
                weight,
                height,
                level: userLevel,
                goal: fitnessGoal,
                days: daysPerWeek,
                healthConditions,
                equipment: equipmentAccess
            });

            setCurrentWorkout(workout);

            // Animate the workout appearance
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start();

        } catch (error) {
            console.error('Error generating workout:', error);
            setError('Failed to generate workout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !isStep1Valid) {
            setError('Please fill in all required fields');
            return;
        }

        setError(null);
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else {
            generateWorkout();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };

    const resetForm = () => {
        setCurrentWorkout(null);
        setCurrentStep(1);
        // Optionally reset all form fields if you want users to start fresh
    };

    // Render each step based on current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return renderBasicInfoStep();
            case 2:
                return renderFitnessGoalsStep();
            case 3:
                return renderHealthAndEquipmentStep();
            default:
                return null;
        }
    };

    const renderBasicInfoStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Basic Information</Text>
            <Text style={styles.stepDescription}>Let's start with some basic stats to personalize your workout plan.</Text>

            <View style={styles.formField}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your age"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <View style={styles.inputIcon}>
                        <Ionicons name="calendar-outline" size={22} color="#777" />
                    </View>
                </View>
            </View>

            <View style={styles.formField}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your weight in kg"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <View style={styles.inputIcon}>
                        <Ionicons name="barbell-outline" size={22} color="#777" />
                    </View>
                </View>
            </View>

            <View style={styles.formField}>
                <Text style={styles.label}>Height (cm)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your height in cm"
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <View style={styles.inputIcon}>
                        <Ionicons name="resize-outline" size={22} color="#777" />
                    </View>
                </View>
            </View>
        </View>
    );

    const renderFitnessGoalsStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: Fitness Goals</Text>
            <Text style={styles.stepDescription}>Tell us about your fitness goals and experience level.</Text>

            <View style={styles.formField}>
                <Text style={styles.label}>Your Fitness Level</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={userLevel}
                        style={styles.picker}
                        onValueChange={(value) => setUserLevel(value)}
                    >
                        <Picker.Item label="Beginner" value="beginner" />
                        <Picker.Item label="Intermediate" value="intermediate" />
                        <Picker.Item label="Advanced" value="advanced" />
                    </Picker>
                </View>
            </View>

            <View style={styles.formField}>
                <Text style={styles.label}>Your Fitness Goal</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={fitnessGoal}
                        style={styles.picker}
                        onValueChange={(value) => setFitnessGoal(value)}
                    >
                        <Picker.Item label="Weight Loss" value="weight_loss" />
                        <Picker.Item label="Weight Gain" value="weight_gain" />
                        <Picker.Item label="Endurance" value="endurance" />
                        <Picker.Item label="Muscle Building" value="muscle_building" />
                        <Picker.Item label="Powerbuilding" value="powerbuilding" />
                    </Picker>
                </View>
                <Text style={styles.helperText}>{goalDescriptions[fitnessGoal]}</Text>
            </View>

            <View style={styles.formField}>
                <Text style={styles.label}>Days per Week</Text>
                <View style={styles.daysSelector}>
                    {['2', '3', '4', '5', '6'].map(day => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                daysPerWeek === day && styles.dayButtonSelected
                            ]}
                            onPress={() => setDaysPerWeek(day)}
                        >
                            <Text
                                style={[
                                    styles.dayButtonText,
                                    daysPerWeek === day && styles.dayButtonTextSelected
                                ]}
                            >
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderHealthAndEquipmentStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: Health & Equipment</Text>
            <Text style={styles.stepDescription}>Let us know about any health concerns and what equipment you have access to.</Text>

            <View style={styles.formField}>
                <Text style={styles.label}>Health Conditions (Optional)</Text>
                <View style={styles.textAreaWrapper}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="List any injuries, conditions or limitations we should consider..."
                        value={healthConditions}
                        onChangeText={setHealthConditions}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>
            </View>

            <View style={styles.formField}>
                <Text style={styles.label}>Equipment Access</Text>
                <View style={styles.equipmentButtons}>
                    {[
                        { value: 'minimal', label: 'Minimal', icon: 'home-outline' },
                        { value: 'basic', label: 'Basic Gym', icon: 'barbell-outline' },
                        { value: 'full', label: 'Full Gym', icon: 'fitness-outline' }
                    ].map(item => (
                        <TouchableOpacity
                            key={item.value}
                            style={[
                                styles.equipmentButton,
                                equipmentAccess === item.value && styles.equipmentButtonSelected
                            ]}
                            onPress={() => setEquipmentAccess(item.value)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color={equipmentAccess === item.value ? '#fff' : '#666'}
                            />
                            <Text
                                style={[
                                    styles.equipmentButtonText,
                                    equipmentAccess === item.value && styles.equipmentButtonTextSelected
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.helperText}>{equipmentDescriptions[equipmentAccess]}</Text>
            </View>
        </View>
    );

    const renderWorkoutPlan = () => (
        <Animated.View style={[styles.workoutContainer, { opacity: fadeAnim }]}>
            <LinearGradient
                colors={['#FF6B00', '#FF8C3C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.workoutHeader}
            >
                <Text style={styles.workoutTitle}>Your Custom Workout Plan</Text>
                <Text style={styles.workoutSubtitle}>
                    {daysPerWeek}-day {userLevel} plan for {fitnessGoal.replace('_', ' ')}
                </Text>
            </LinearGradient>

            {currentWorkout.days.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                    <View style={styles.dayHeader}>
                        <Text style={styles.dayTitle}>{day.name}</Text>
                        <View style={styles.dayTitleLine} />
                    </View>

                    {day.exercises.map((exercise, idx) => (
                        <View key={idx} style={styles.exerciseContainer}>
                            <View style={styles.exerciseHeader}>
                                <Ionicons name="fitness" size={20} color="#FF6B00" />
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                            </View>
                            <View style={styles.exerciseContent}>
                                <View style={styles.exerciseDetails}>
                                    <View style={styles.exerciseMetric}>
                                        <Text style={styles.exerciseMetricValue}>{exercise.sets}</Text>
                                        <Text style={styles.exerciseMetricLabel}>Sets</Text>
                                    </View>
                                    <View style={styles.exerciseMetricDivider} />
                                    <View style={styles.exerciseMetric}>
                                        <Text style={styles.exerciseMetricValue}>{exercise.reps}</Text>
                                        <Text style={styles.exerciseMetricLabel}>Reps</Text>
                                    </View>
                                </View>
                                {exercise.notes && (
                                    <View style={styles.exerciseNotes}>
                                        <Text style={styles.exerciseNote}>{exercise.notes}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            ))}

            <TouchableOpacity style={styles.newPlanButton} onPress={resetForm}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.newPlanButtonText}>Create New Plan</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <ImageBackground
            source={require('../images/white.png')}
            style={styles.backgroundImage}
        >
           <LinearGradient 
  colors={['#EDEDED', '#EDEDED']} // Soft peach-orange to very light gray
  style={styles.overlay} 
>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {!currentWorkout ? (
                            <>
                                {/* Progress indicator */}
                                <View style={styles.progressContainer}>
                                    {[1, 2, 3].map(step => (
                                        <View key={step} style={styles.progressStep}>
                                            <View style={[
                                                styles.progressDot,
                                                currentStep >= step ? styles.progressDotActive : {}
                                            ]}>
                                                {currentStep > step && (
                                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                                )}
                                                {currentStep === step && (
                                                    <Text style={styles.progressDotText}>{step}</Text>
                                                )}
                                            </View>
                                            {step < 3 && <View style={[
                                                styles.progressLine,
                                                currentStep > step ? styles.progressLineActive : {}
                                            ]} />}
                                        </View>
                                    ))}
                                </View>

                                {/* Step content */}
                                {renderStep()}

                                {/* Error message */}
                                {error && (
                                    <View style={styles.errorContainer}>
                                        <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                )}

                                {/* Navigation buttons */}
                                <View style={styles.buttonContainer}>
                                    {currentStep > 1 && (
                                        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                                            <Ionicons name="arrow-back" size={20} color="#fff" />
                                            <Text style={styles.backButtonText}>Back</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[
                                            styles.nextButton,
                                            currentStep === 1 && !isStep1Valid && styles.disabledButton
                                        ]}
                                        onPress={nextStep}
                                        disabled={currentStep === 1 && !isStep1Valid}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <>
                                                <Text style={styles.nextButtonText}>
                                                    {currentStep < 3 ? 'Next' : 'Generate Workout'}
                                                </Text>
                                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            renderWorkoutPlan()
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    progressStep: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    progressDotActive: {
        backgroundColor: 'green',
    },
    progressDotText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    progressLine: {
        height: 3,
        width: (width - 150) / 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressLineActive: {
        backgroundColor: 'green',
    },
    stepContainer: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    formField: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    inputIcon: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    textAreaWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    helperText: {
        fontSize: 12,
        color: '#777',
        marginTop: 6,
        fontStyle: 'italic',
    },
    daysSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayButton: {
        width: width / 6.5,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    dayButtonSelected: {
        backgroundColor: '#FF6B00',
        borderColor: '#FF6B00',
    },
    dayButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    dayButtonTextSelected: {
        color: '#fff',
    },
    equipmentButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    equipmentButton: {
        width: '31%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    equipmentButtonSelected: {
        backgroundColor: '#FF6B00',
        borderColor: '#FF6B00',
    },
    equipmentButtonText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    equipmentButtonTextSelected: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'gray'
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    nextButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#FF6B00',
        marginLeft: 10,
    },
    disabledButton: {
        backgroundColor: 'rgba(255,107,0,0.5)',
    },
    nextButtonText: {
        marginRight: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,59,48,0.1)',
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        marginLeft: 8,
        color: '#FF3B30',
        fontSize: 14,
    },
    workoutContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    workoutHeader: {
        padding: 20,
    },
    workoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    workoutSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    dayContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dayHeader: {
        marginBottom: 15,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    dayTitleLine: {
        height: 3,
        width: 60,
        backgroundColor: '#FF6B00',
        borderRadius: 2,
    },
    exerciseContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f2f2f2',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    exerciseContent: {
        padding: 15,
    },
    exerciseDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    exerciseMetric: {
        alignItems: 'center',
        padding: 10,
    },
    exerciseMetricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
    exerciseMetricLabel: {
        fontSize: 14,
        color: '#666',
    },
    exerciseMetricDivider: {
        height: 30,
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 20,
    },
    exerciseNotes: {
        padding: 10,
        backgroundColor: 'rgba(255,107,0,0.1)',
        borderRadius: 6,
    },
    exerciseNote: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    newPlanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        padding: 15,
        margin: 15,
        borderRadius: 10,
    },
    newPlanButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    }
});

export default AdaptiveWorkout;