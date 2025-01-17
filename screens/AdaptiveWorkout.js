import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput ,ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

const DIFFICULTY_LEVELS = {
    TOO_EASY: 'Too Easy',
    JUST_RIGHT: 'Just Right',
    TOO_HARD: 'Too Hard',
};

const AdaptiveWorkout = ({ navigation }) => {
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({
        difficulty: null,
        notes: '',
    });
    const [userLevel, setUserLevel] = useState('Easy');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateWorkout = () => {
        setLoading(true); // Show loader
        setTimeout(() => {
            const workouts = {
                Easy: {
                    exercises: [
                        { name: 'Bench Press', sets: 3, reps: '8-10', rest: '60s' },
                        { name: 'Shoulder Press', sets: 3, reps: '12-15', rest: '60s' },
                        { name: 'Tricep Extensions', sets: 3, duration: '30s', rest: '45s' },
                        { name: 'Push-ups', sets: 3, duration: '30s', rest: '45s' },
                        { name: 'Lunges', sets: 3, reps: '12-15 each leg', rest: '60s' }, // Added lunges
                    ],
                    duration: '30 min',
                    intensity: 'Low to Moderate',
                },
                Medium: {
                    exercises: [
                        { name: 'Push-ups', sets: 4, reps: '12-15', rest: '60s' },
                        { name: 'Squats', sets: 4, reps: '20', rest: '60s' },
                        { name: 'Plank', sets: 4, duration: '45s', rest: '45s' },
                        { name: 'Mountain Climbers', sets: 3, duration: '30s', rest: '45s' }, // Added mountain climbers
                        { name: 'Glute Bridges', sets: 3, reps: '12-15', rest: '60s' }, // Added glute bridges
                    ],
                    duration: '40 min',
                    intensity: 'Moderate',
                },
                Intense: {
                    exercises: [
                        { name: 'Push-ups', sets: 5, reps: '20-25', rest: '45s' },
                        { name: 'Squats', sets: 5, reps: '25', rest: '45s' },
                        { name: 'Plank', sets: 5, duration: '60s', rest: '30s' },
                        { name: 'Bicycle Crunches', sets: 3, reps: '20 (10 each side)', rest: '45s' }, // Added bicycle crunches
                        { name: 'Superman Hold', sets: 3, duration: '30s', rest: '45s' }, // Added superman hold
                    ],
                    duration: '50 min',
                    intensity: 'High',
                },
            };
            

            setCurrentWorkout(workouts[userLevel]);
            setLoading(false); // Hide loader
            setIsGenerating(false); // Hide generating message
        }, 3000); // Simulate loading for 3 seconds
    };

    const handleUserLevelChange = (level) => {
        setIsGenerating(true); // Show generating message
        setUserLevel(level);
        generateWorkout();
    };

    const handleWorkoutComplete = () => {
        setShowFeedbackModal(true);
    };

    const submitFeedback = () => {
        if (feedback.difficulty === DIFFICULTY_LEVELS.TOO_EASY) {
            setUserLevel(prev => (prev === 'Easy' ? 'Medium' : 'Intense'));
        } else if (feedback.difficulty === DIFFICULTY_LEVELS.TOO_HARD) {
            setUserLevel(prev => (prev === 'Intense' ? 'Medium' : 'Easy'));
        }

        setWorkoutHistory(prev => [
            ...prev,
            { ...currentWorkout, date: new Date(), feedback },
        ]);
        setShowFeedbackModal(false);
        setFeedback({ difficulty: null, notes: '' });
    };

    const renderExercise = (exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Ionicons name="fitness-outline" size={24} color="#FF6B00" />
            </View>
            <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseInfo}>Sets: {exercise.sets}</Text>
                <Text style={styles.exerciseInfo}>
                    {exercise.reps ? `Reps: ${exercise.reps}` : `Duration: ${exercise.duration}`}
                </Text>
                <Text style={styles.exerciseInfo}>Rest: {exercise.rest}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => Linking.openURL(Linking.makeUrl())}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.title}>Workout for You</Text>
                <View style={styles.levelSelector}>
                    <Text style={styles.subtitle}>Choose your workout level:</Text>
                    <View style={styles.levelButtons}>
                        {['Easy', 'Medium', 'Intense'].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.levelButton,
                                    userLevel === level && styles.selectedLevelButton,
                                ]}
                                onPress={() => handleUserLevelChange(level)}
                            >
                                <Text
                                    style={[
                                        styles.levelButtonText,
                                        userLevel === level && styles.selectedLevelButtonText,
                                    ]}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
            ) : isGenerating ? (
                <Text style={styles.generatingText}>Generating an ideal plan for you, please wait...</Text>
            ) : !currentWorkout ? (
                <TouchableOpacity style={styles.generateButton} onPress={generateWorkout}>
                    <Text style={styles.buttonText}>Generate Workout</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.workoutContainer}>
                    <View style={styles.workoutHeader}>
                        <Text style={styles.workoutTitle}>Today's Workout</Text>
                        <View style={styles.workoutMeta}>
                            <Text style={styles.metaText}>Duration: {currentWorkout.duration}</Text>
                            <Text style={styles.metaText}>Intensity: {currentWorkout.intensity}</Text>
                        </View>
                    </View>
                    {currentWorkout.exercises.map((exercise, index) => renderExercise(exercise, index))}
                    <TouchableOpacity style={styles.completeButton} onPress={handleWorkoutComplete}>
                        <Text style={styles.buttonText}>Complete Workout</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>How was your workout?</Text>

                        <View style={styles.difficultyButtons}>
                            {Object.values(DIFFICULTY_LEVELS).map(level => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.difficultyButton,
                                        feedback.difficulty === level && styles.selectedDifficulty,
                                    ]}
                                    onPress={() => setFeedback(prev => ({ ...prev, difficulty: level }))}
                                >
                                    <Text
                                        style={[
                                            styles.difficultyButtonText,
                                            feedback.difficulty === level && styles.selectedDifficultyText,
                                        ]}
                                    >
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.notesInput}
                            placeholder="Additional notes (optional)"
                            value={feedback.notes}
                            onChangeText={text => setFeedback(prev => ({ ...prev, notes: text }))}
                            multiline
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                            <Text style={styles.buttonText}>Submit Feedback</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    levelSelector: {
        marginBottom: 20,
    },
    levelButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    levelButton: {
        width: 200,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginHorizontal: 5,
    },
    loader: {
        marginTop: 50,
        alignSelf: 'center',
    },    
    selectedLevelButton: {
        backgroundColor: '#FF6B00',
        borderColor: '#FF6B00',
    },
    levelButtonText: {
        textAlign: 'center',
        color: '#666',
    },
    selectedLevelButtonText: {
        color: '#fff',
    },
    generateButton: {
        backgroundColor: '#FF6B00',
        margin: 20,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    workoutContainer: {
        padding: 20,
    },
    workoutHeader: {
        marginBottom: 20,
    },
    workoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    workoutMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaText: {
        fontSize: 16,
        color: '#666',
    },
    exerciseCard: {
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
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    exerciseDetails: {
        gap: 8,
    },
    exerciseInfo: {
        fontSize: 16,
        color: '#666',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    difficultyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    difficultyButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginHorizontal: 5,
    },
    selectedDifficulty: {
        backgroundColor: '#FF6B00',
        borderColor: '#FF6B00',
    },
    difficultyButtonText: {
        textAlign: 'center',
        color: '#666',
    },
    selectedDifficultyText: {
        color: '#fff',
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#FF6B00',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
});

export default AdaptiveWorkout;
