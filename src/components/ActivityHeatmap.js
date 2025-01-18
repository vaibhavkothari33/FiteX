import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ActivityHeatmap = ({ activityData }) => {
  // Helper function to get color based on activity level
  const getActivityColor = (value) => {
    if (value === 0) return '#f4f4f4'; // Light gray for no activity
    if (value <= 25) return '#ffe4b3'; // Light orange
    if (value <= 50) return '#ffc966'; // Medium-light orange
    if (value <= 75) return '#ff9933'; // Medium orange
    return '#cc6600'; // Dark orange
  };

  // Generate dates for the last 365 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push({
        date: date,
        value: Math.floor(Math.random() * 100), // Replace with actual activity data
      });
    }

    return dates;
  };

  // Group dates by week
  const groupByWeek = (dates) => {
    const weeks = [];
    let currentWeek = [];

    dates.forEach((date) => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const dates = generateDates();
  const weeks = groupByWeek(dates);

  const weekDays = ['Mon', 'Wed', 'Fri'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yearly Activity Streak</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.heatmapContainer}>
          {/* Week days labels */}
          <View style={styles.weekDaysLabels}>
            {weekDays.map((day, index) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Heatmap grid */}
          <View style={styles.heatmapGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((day, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.dayCell,
                      { backgroundColor: getActivityColor(day.value) },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 25, 50, 75, 100].map((value) => (
          <View
            key={value}
            style={[
              styles.legendCell,
              { backgroundColor: getActivityColor(value) },
            ]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  heatmapContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDaysLabels: {
    marginRight: 8,
    justifyContent: 'space-between',
    height: 140,
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
  },
  heatmapGrid: {
    flexDirection: 'row',
  },
  weekColumn: {
    marginRight: 4,
  },
  dayCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginBottom: 4,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
});

export default ActivityHeatmap;
