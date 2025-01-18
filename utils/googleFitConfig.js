// googleFitConfig.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authorize } from 'react-native-app-auth';

const googleFitConfig = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
  scopes: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
  ],
};

// googleFitService.js
import { Alert } from 'react-native';

export const initializeGoogleFit = async () => {
  try {
    await GoogleSignin.configure({
      webClientId: googleFitConfig.clientId,
      scopes: googleFitConfig.scopes,
    });
    return true;
  } catch (error) {
    console.error('Google Fit initialization error:', error);
    return false;
  }
};

export const connectGoogleFit = async () => {
  try {
    const result = await authorize({
      clientId: googleFitConfig.clientId,
      scopes: googleFitConfig.scopes,
    });
    return result.accessToken;
  } catch (error) {
    console.error('Google Fit connection error:', error);
    Alert.alert('Error', 'Failed to connect to Google Fit');
    return null;
  }
};

export const fetchGoogleFitData = async (accessToken) => {
  try {
    const endTimeMillis = new Date().getTime();
    const startTimeMillis = endTimeMillis - 24 * 60 * 60 * 1000; // Last 24 hours

    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
          {
            dataTypeName: 'com.google.calories.expended',
          },
          {
            dataTypeName: 'com.google.heart_rate.bpm',
          },
        ],
        bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
        startTimeMillis,
        endTimeMillis,
      }),
    });

    const data = await response.json();
    return processGoogleFitData(data);
  } catch (error) {
    console.error('Error fetching Google Fit data:', error);
    throw error;
  }
};

const processGoogleFitData = (data) => {
  const processed = {
    steps: 0,
    calories: 0,
    heartRate: 0,
  };

  data.bucket.forEach(bucket => {
    bucket.dataset.forEach(dataset => {
      const points = dataset.point[0]?.value[0]?.intVal || dataset.point[0]?.value[0]?.fpVal || 0;
      
      switch (dataset.dataSourceId) {
        case 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps':
          processed.steps = points;
          break;
        case 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended':
          processed.calories = Math.round(points);
          break;
        case 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm':
          processed.heartRate = Math.round(points);
          break;
      }
    });
  });

  return processed;
};
