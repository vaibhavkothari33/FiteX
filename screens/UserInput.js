import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const UserInput = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: '',
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tell Us About Yourself</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={formData.age}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={formData.weight}
        onChangeText={(text) => setFormData({ ...formData, weight: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={formData.height}
        onChangeText={(text) => setFormData({ ...formData, height: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fitness Goal"
        value={formData.fitnessGoal}
        onChangeText={(text) => setFormData({ ...formData, fitnessGoal: text })}
      />
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={() => navigation.navigate('MainApp')} // Navigate to MainApp
      >
        <Text style={styles.buttonText}>Start Your Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserInput;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const UserInput = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     weight: '',
//     height: '',
//     fitnessGoal: '',
//     experienceLevel: 'beginner',
//     daysPerWeek: '3',
//     healthConditions: '',
//     preferredWorkoutType: 'mix',
//     equipmentAccess: 'minimal'
//   });

//   const handleSubmit = () => {
//     navigation.navigate('WorkoutPlan', { userData: formData });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Tell Us About Yourself</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={formData.name}
//         onChangeText={(text) => setFormData({ ...formData, name: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Age"
//         value={formData.age}
//         onChangeText={(text) => setFormData({ ...formData, age: text })}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Weight (kg)"
//         value={formData.weight}
//         onChangeText={(text) => setFormData({ ...formData, weight: text })}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Height (cm)"
//         value={formData.height}
//         onChangeText={(text) => setFormData({ ...formData, height: text })}
//         keyboardType="numeric"
//       />
      
//       <Text style={styles.label}>Fitness Goal</Text>
//       <Picker
//         selectedValue={formData.fitnessGoal}
//         style={styles.picker}
//         onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value })}
//       >
//         <Picker.Item label="Weight Loss" value="weightLoss" />
//         <Picker.Item label="Muscle Gain" value="muscleGain" />
//         <Picker.Item label="General Fitness" value="generalFitness" />
//         <Picker.Item label="Endurance" value="endurance" />
//       </Picker>

//       <Text style={styles.label}>Experience Level</Text>
//       <Picker
//         selectedValue={formData.experienceLevel}
//         style={styles.picker}
//         onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
//       >
//         <Picker.Item label="Beginner" value="beginner" />
//         <Picker.Item label="Intermediate" value="intermediate" />
//         <Picker.Item label="Advanced" value="advanced" />
//       </Picker>

//       <Text style={styles.label}>Days per Week Available</Text>
//       <Picker
//         selectedValue={formData.daysPerWeek}
//         style={styles.picker}
//         onValueChange={(value) => setFormData({ ...formData, daysPerWeek: value })}
//       >
//         <Picker.Item label="2 days" value="2" />
//         <Picker.Item label="3 days" value="3" />
//         <Picker.Item label="4 days" value="4" />
//         <Picker.Item label="5 days" value="5" />
//         <Picker.Item label="6 days" value="6" />
//       </Picker>

//       <TextInput
//         style={styles.input}
//         placeholder="Any health conditions or injuries?"
//         value={formData.healthConditions}
//         onChangeText={(text) => setFormData({ ...formData, healthConditions: text })}
//         multiline
//       />

//       <Text style={styles.label}>Equipment Access</Text>
//       <Picker
//         selectedValue={formData.equipmentAccess}
//         style={styles.picker}
//         onValueChange={(value) => setFormData({ ...formData, equipmentAccess: value })}
//       >
//         <Picker.Item label="Minimal (Home Workout)" value="minimal" />
//         <Picker.Item label="Basic Gym Access" value="basic" />
//         <Picker.Item label="Full Gym Access" value="full" />
//       </Picker>

//       <TouchableOpacity 
//         style={styles.submitButton}
//         onPress={handleSubmit}
//       >
//         <Text style={styles.buttonText}>Generate Workout Plan</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };


// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   submitButton: {
//     backgroundColor: '#FF6B00',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     margin: 15,
//   },
//   label: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   picker: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },

// });

// export default UserInput;