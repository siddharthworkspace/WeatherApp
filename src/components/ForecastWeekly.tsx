import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
// import { WeeklyForecast } from './weather'; 
import { WeatherIcon } from './WeatherIcon';
import { WeeklyForecast } from '../api';

const { width } = Dimensions.get('window');

interface Props { data: WeeklyForecast[]; }
export interface WeatherTheme {
  gradientColors: string[];
  statusBar: 'light-content' | 'dark-content';
}

const getAtmosphericTheme = (condition: string | undefined, iconCode: string | undefined): WeatherTheme => {
  // Fallback for missing data
  if (!condition || !iconCode) {
    return { gradientColors: ['#1E293B', '#0F172A'], statusBar: 'light-content' };
  }

  const isNight = iconCode.includes('n');

  // Night Mode overrides
  if (isNight) {
    return {
      gradientColors: ['#0F2027', '#203A43', '#2C5364'], // Deep midnight
      statusBar: 'light-content'
    };
  }

  // Day Mode conditions
  switch (condition) {
    case 'Clear':
      return {
        gradientColors: ['#3A7BD5', '#00D2FF'], // Vibrant bright sky
        statusBar: 'light-content'
      };
    case 'Clouds':
      return {
        gradientColors: ['#606C88', '#3F4C6B'], // Soft overcast
        statusBar: 'light-content'
      };
    case 'Rain':
    case 'Drizzle':
      return {
        gradientColors: ['#485563', '#29323C'], // Cool rainy grey
        statusBar: 'light-content'
      };
    case 'Thunderstorm':
      return {
        gradientColors: ['#141E30', '#243B55'], // Dark stormy deep blue
        statusBar: 'light-content'
      };
    case 'Snow':
      return {
        gradientColors: ['#83a4d4', '#b6fbff'], // Crisp icy blue
        statusBar: 'dark-content'
      };
    case 'Mist':
    case 'Haze':
    case 'Fog':
      return {
        gradientColors: ['#B9B6E5', '#606C88'], // Muted atmospheric haze
        statusBar: 'light-content'
      };
    default:
      return {
        gradientColors: ['#4e6276', '#161c22'],
        statusBar: 'light-content'
      };
  }
};
export const ForecastWeekly: React.FC<Props> = ({ data }) => {

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <FlatList
        horizontal
        data={data}
        // Using index as fallback key to prevent rendering issues if 'day' is missing
        keyExtractor={(item, index) => item.day || index.toString()}
        contentContainerStyle={styles.listPadding}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.dailyCard}>
            <Text style={styles.cardDayText}>{item.day || '...'}</Text>
            <View style={styles.iconContainer}>
              <WeatherIcon condition={item.condition} size={35} />
            </View>
            <Text style={styles.cardConditionText} numberOfLines={1}>{item.condition}</Text>
            
            <View style={styles.cardTempRow}>
              <Text style={styles.minTemp}>{Math.round(item.tempMin)}°</Text>
              <Text style={styles.tempSeparator}>/</Text>
              <Text style={styles.maxTemp}>{Math.round(item.tempMax)}°</Text>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Hum</Text>
                <Text style={styles.metricValue}>{item.humidity}%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Wind</Text>
                <Text style={styles.metricValue}>{item.windSpeed}m/s</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listPadding: { paddingHorizontal: 15 },
  dailyCard: {
    width: width * 0.32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardDayText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  iconContainer: { height: 40, justifyContent: 'center', alignItems: 'center' },
  cardConditionText: { color: 'rgba(255, 255, 255, 0.65)', fontSize: 10, marginTop: 4 },
  cardTempRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  minTemp: { color: 'rgba(255, 255, 255, 0.55)', fontSize: 13 },
  tempSeparator: { color: 'rgba(255, 255, 255, 0.3)', marginHorizontal: 4 },
  maxTemp: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  metricsGrid: { 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between', 
    marginTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.18)', 
    paddingTop: 10 
  },
  metricItem: { alignItems: 'center' },
  metricLabel: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 9, textTransform: 'uppercase' },
  metricValue: { color: '#FFF', fontSize: 11, fontWeight: '600', marginTop: 2 }
});