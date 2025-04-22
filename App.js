import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import Entry from './screens/Entry';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import UserInput from './screens/UserInput';
import Dashboard from './screens/Dashboard';
import Exercise from './screens/Exercise';
import Diet from './screens/Diet';
import AdaptiveWorkout from './screens/AdaptiveWorkout';
import WorkoutPlan from './screens/WorkoutPlan';
import CheatMealDetector from './screens/CheatMealDetector';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => (
  <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Exercise':
            iconName = focused ? 'fitness' : 'fitness-outline';
            break;
          case 'Diet':
            iconName = focused ? 'nutrition' : 'nutrition-outline';
            break;
          case 'CheatMeal':
            iconName = focused ? 'fast-food' : 'fast-food-outline';
            break;
          case 'Workout':
            iconName = focused ? 'barbell' : 'barbell-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FF6B00',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Exercise" component={Exercise} />
    <Tab.Screen name="Diet" component={Diet} />
    <Tab.Screen name="Workout" component={AdaptiveWorkout} />
    <Tab.Screen name="CheatMeal" component={CheatMealDetector} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry">
        <Stack.Screen name="Entry" component={Entry} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="UserInput" component={UserInput} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlan} options={{ headerShown: true }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
