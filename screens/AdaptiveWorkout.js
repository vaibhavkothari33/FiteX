// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput ,ActivityIndicator} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Linking } from 'react-native';

// const DIFFICULTY_LEVELS = {
//     TOO_EASY: 'Too Easy',
//     JUST_RIGHT: 'Just Right',
//     TOO_HARD: 'Too Hard',
// };

// const AdaptiveWorkout = ({ navigation }) => {
//     const [currentWorkout, setCurrentWorkout] = useState(null);
//     const [workoutHistory, setWorkoutHistory] = useState([]);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [feedback, setFeedback] = useState({
//         difficulty: null,
//         notes: '',
//     });
//     const [userLevel, setUserLevel] = useState('Easy');
//     const [isGenerating, setIsGenerating] = useState(false);

//     const generateWorkout = () => {
//         setLoading(true); // Show loader
//         setTimeout(() => {
//             const workouts = {
//                 Easy: {
//                     exercises: [
//                         { name: 'Bench Press', sets: 3, reps: '8-10', rest: '60s' },
//                         { name: 'Shoulder Press', sets: 3, reps: '12-15', rest: '60s' },
//                         { name: 'Tricep Extensions', sets: 3, duration: '30s', rest: '45s' },
//                         { name: 'Push-ups', sets: 3, duration: '30s', rest: '45s' },
//                         { name: 'Lunges', sets: 3, reps: '12-15 each leg', rest: '60s' }, // Added lunges
//                     ],
//                     duration: '30 min',
//                     intensity: 'Low to Moderate',
//                 },
//                 Medium: {
//                     exercises: [
//                         { name: 'Push-ups', sets: 4, reps: '12-15', rest: '60s' },
//                         { name: 'Squats', sets: 4, reps: '20', rest: '60s' },
//                         { name: 'Plank', sets: 4, duration: '45s', rest: '45s' },
//                         { name: 'Mountain Climbers', sets: 3, duration: '30s', rest: '45s' }, // Added mountain climbers
//                         { name: 'Glute Bridges', sets: 3, reps: '12-15', rest: '60s' }, // Added glute bridges
//                     ],
//                     duration: '40 min',
//                     intensity: 'Moderate',
//                 },
//                 Intense: {
//                     exercises: [
//                         { name: 'Push-ups', sets: 5, reps: '20-25', rest: '45s' },
//                         { name: 'Squats', sets: 5, reps: '25', rest: '45s' },
//                         { name: 'Plank', sets: 5, duration: '60s', rest: '30s' },
//                         { name: 'Bicycle Crunches', sets: 3, reps: '20 (10 each side)', rest: '45s' }, // Added bicycle crunches
//                         { name: 'Superman Hold', sets: 3, duration: '30s', rest: '45s' }, // Added superman hold
//                     ],
//                     duration: '50 min',
//                     intensity: 'High',
//                 },
//             };
            

//             setCurrentWorkout(workouts[userLevel]);
//             setLoading(false); // Hide loader
//             setIsGenerating(false); // Hide generating message
//         }, 3000); // Simulate loading for 3 seconds
//     };

//     const handleUserLevelChange = (level) => {
//         setIsGenerating(true); // Show generating message
//         setUserLevel(level);
//         generateWorkout();
//     };

//     const handleWorkoutComplete = () => {
//         setShowFeedbackModal(true);
//     };

//     const submitFeedback = () => {
//         if (feedback.difficulty === DIFFICULTY_LEVELS.TOO_EASY) {
//             setUserLevel(prev => (prev === 'Easy' ? 'Medium' : 'Intense'));
//         } else if (feedback.difficulty === DIFFICULTY_LEVELS.TOO_HARD) {
//             setUserLevel(prev => (prev === 'Intense' ? 'Medium' : 'Easy'));
//         }

//         setWorkoutHistory(prev => [
//             ...prev,
//             { ...currentWorkout, date: new Date(), feedback },
//         ]);
//         setShowFeedbackModal(false);
//         setFeedback({ difficulty: null, notes: '' });
//     };

//     const renderExercise = (exercise, index) => (
//         <View key={index} style={styles.exerciseCard}>
//             <View style={styles.exerciseHeader}>
//                 <Text style={styles.exerciseName}>{exercise.name}</Text>
//                 <Ionicons name="fitness-outline" size={24} color="#FF6B00" />
//             </View>
//             <View style={styles.exerciseDetails}>
//                 <Text style={styles.exerciseInfo}>Sets: {exercise.sets}</Text>
//                 <Text style={styles.exerciseInfo}>
//                     {exercise.reps ? `Reps: ${exercise.reps}` : `Duration: ${exercise.duration}`}
//                 </Text>
//                 <Text style={styles.exerciseInfo}>Rest: {exercise.rest}</Text>
//             </View>
//         </View>
//     );

//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     style={styles.backButton}
//                     onPress={() => Linking.openURL(Linking.makeUrl())}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="#333" />
//                 </TouchableOpacity>

//                 <Text style={styles.title}>Workout for You</Text>
//                 <View style={styles.levelSelector}>
//                     <Text style={styles.subtitle}>Choose your workout level:</Text>
//                     <View style={styles.levelButtons}>
//                         {['Easy', 'Medium', 'Intense'].map(level => (
//                             <TouchableOpacity
//                                 key={level}
//                                 style={[
//                                     styles.levelButton,
//                                     userLevel === level && styles.selectedLevelButton,
//                                 ]}
//                                 onPress={() => handleUserLevelChange(level)}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.levelButtonText,
//                                         userLevel === level && styles.selectedLevelButtonText,
//                                     ]}
//                                 >
//                                     {level.charAt(0).toUpperCase() + level.slice(1)}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>
//             </View>
//             {loading ? (
//                 <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
//             ) : isGenerating ? (
//                 <Text style={styles.generatingText}>Generating an ideal plan for you, please wait...</Text>
//             ) : !currentWorkout ? (
//                 <TouchableOpacity style={styles.generateButton} onPress={generateWorkout}>
//                     <Text style={styles.buttonText}>Generate Workout</Text>
//                 </TouchableOpacity>
//             ) : (
//                 <View style={styles.workoutContainer}>
//                     <View style={styles.workoutHeader}>
//                         <Text style={styles.workoutTitle}>Today's Workout</Text>
//                         <View style={styles.workoutMeta}>
//                             <Text style={styles.metaText}>Duration: {currentWorkout.duration}</Text>
//                             <Text style={styles.metaText}>Intensity: {currentWorkout.intensity}</Text>
//                         </View>
//                     </View>
//                     {currentWorkout.exercises.map((exercise, index) => renderExercise(exercise, index))}
//                     <TouchableOpacity style={styles.completeButton} onPress={handleWorkoutComplete}>
//                         <Text style={styles.buttonText}>Complete Workout</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>How was your workout?</Text>

//                         <View style={styles.difficultyButtons}>
//                             {Object.values(DIFFICULTY_LEVELS).map(level => (
//                                 <TouchableOpacity
//                                     key={level}
//                                     style={[
//                                         styles.difficultyButton,
//                                         feedback.difficulty === level && styles.selectedDifficulty,
//                                     ]}
//                                     onPress={() => setFeedback(prev => ({ ...prev, difficulty: level }))}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.difficultyButtonText,
//                                             feedback.difficulty === level && styles.selectedDifficultyText,
//                                         ]}
//                                     >
//                                         {level}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         <TextInput
//                             style={styles.notesInput}
//                             placeholder="Additional notes (optional)"
//                             value={feedback.notes}
//                             onChangeText={text => setFeedback(prev => ({ ...prev, notes: text }))}
//                             multiline
//                         />

//                         <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
//                             <Text style={styles.buttonText}>Submit Feedback</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         padding: 20,
//         position: 'relative',
//     },
//     backButton: {
//         position: 'absolute',
//         top: 20,
//         left: 20,
//         padding: 8,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 8,
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: 16,
//         color: '#666',
//         marginBottom: 10,
//     },
//     levelSelector: {
//         marginBottom: 20,
//     },
//     levelButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//     },
//     levelButton: {
//         width: 200,
//         padding: 12,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         flex: 1,
//         marginHorizontal: 5,
//     },
//     loader: {
//         marginTop: 50,
//         alignSelf: 'center',
//     },    
//     selectedLevelButton: {
//         backgroundColor: '#FF6B00',
//         borderColor: '#FF6B00',
//     },
//     levelButtonText: {
//         textAlign: 'center',
//         color: '#666',
//     },
//     selectedLevelButtonText: {
//         color: '#fff',
//     },
//     generateButton: {
//         backgroundColor: '#FF6B00',
//         margin: 20,
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     workoutContainer: {
//         padding: 20,
//     },
//     workoutHeader: {
//         marginBottom: 20,
//     },
//     workoutTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 8,
//     },
//     workoutMeta: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     metaText: {
//         fontSize: 16,
//         color: '#666',
//     },
//     exerciseCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     exerciseHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     exerciseName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     exerciseDetails: {
//         gap: 8,
//     },
//     exerciseInfo: {
//         fontSize: 16,
//         color: '#666',
//     },
//     completeButton: {
//         backgroundColor: '#4CAF50',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         padding: 20,
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 20,
//     },
//     modalTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     difficultyButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     difficultyButton: {
//         padding: 12,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         flex: 1,
//         marginHorizontal: 5,
//     },
//     selectedDifficulty: {
//         backgroundColor: '#FF6B00',
//         borderColor: '#FF6B00',
//     },
//     difficultyButtonText: {
//         textAlign: 'center',
//         color: '#666',
//     },
//     selectedDifficultyText: {
//         color: '#fff',
//     },
//     notesInput: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 20,
//         minHeight: 100,
//         textAlignVertical: 'top',
//     },
//     submitButton: {
//         backgroundColor: '#FF6B00',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
// });

// export default AdaptiveWorkout;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import { generateUserWorkout } from '../utils/geminiUser'; // Import the function

const AdaptiveWorkout = () => {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [userLevel, setUserLevel] = useState('beginner');
    const [fitnessGoal, setFitnessGoal] = useState('weight_loss');
    const [daysPerWeek, setDaysPerWeek] = useState('2');
    const [healthConditions, setHealthConditions] = useState('');
    const [equipmentAccess, setEquipmentAccess] = useState('minimal');
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateWorkout = async () => {
        setLoading(true); // Show loader
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
            }); // Fetch workout from geminiUser
            setCurrentWorkout(workout); // Set the fetched workout
        } catch (error) {
            console.error('Error generating workout:', error);
            setError('Failed to generate workout. Please try again.');
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Generate Your Workout Plan</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Fitness Level</Text>
            <Picker
                selectedValue={userLevel}
                style={styles.picker}
                onValueChange={(value) => setUserLevel(value)}
            >
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Intermediate" value="intermediate" />
                <Picker.Item label="Advanced" value="advanced" />
            </Picker>
            <Text style={styles.label}>Fitness Goal</Text>
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
            <Text style={styles.label}>Days per Week Available</Text>
            <Picker
                selectedValue={daysPerWeek}
                style={styles.picker}
                onValueChange={(value) => setDaysPerWeek(value)}
            >
                <Picker.Item label="2 days" value="2" />
                <Picker.Item label="3 days" value="3" />
                <Picker.Item label="4 days" value="4" />
                <Picker.Item label="5 days" value="5" />
                <Picker.Item label="6 days" value="6" />
            </Picker>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Any health conditions or injuries?"
                value={healthConditions}
                onChangeText={setHealthConditions}
                multiline
                numberOfLines={3}
            />
            <Text style={styles.label}>Equipment Access</Text>
            <Picker
                selectedValue={equipmentAccess}
                style={styles.picker}
                onValueChange={(value) => setEquipmentAccess(value)}
            >
                <Picker.Item label="Minimal (Home Workout)" value="minimal" />
                <Picker.Item label="Basic Gym Access" value="basic" />
                <Picker.Item label="Full Gym Access" value="full" />
            </Picker>
            <TouchableOpacity style={styles.button} onPress={generateWorkout}>
                <Text style={styles.buttonText}>Generate Workout</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#FF6B00" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {currentWorkout && (
                <ScrollView>
                    {currentWorkout.days.map((day, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={styles.dayTitle}>{day.name}</Text>
                            {day.exercises.map((exercise, idx) => (
                                <View key={idx} style={styles.exerciseContainer}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <Text style={styles.exerciseDetails}>
                                        {exercise.sets} sets x {exercise.reps} reps
                                    </Text>
                                    <Text style={styles.exerciseNote}>{exercise.notes}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    multilineInput: {
        height: 80,
    },
    button: {
        backgroundColor: '#FF6B00',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    dayContainer: {
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
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    exerciseContainer: {
        marginBottom: 8,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    exerciseDetails: {
        fontSize: 14,
        color: '#666',
    },
    exerciseNote: {
        fontSize: 12,
        color: '#999',
    },
});

export default AdaptiveWorkout;