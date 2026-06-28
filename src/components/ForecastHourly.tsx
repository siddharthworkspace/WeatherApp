import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { HourlyForecast } from '../api/weather';
import { WeatherIcon } from './WeatherIcon';

interface ForecastHourlyProps {
  data: HourlyForecast[];
}

export const ForecastHourly: React.FC<ForecastHourlyProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, index) => {
          const isNow = index === 0;
          return (
            <View 
              key={index} 
              style={[
                styles.card,
                isNow && styles.activeCard
              ]}
            >
              <Text style={[styles.time, isNow && styles.activeText]}>{item.time}</Text>
              <View style={styles.iconWrapper}>
                <WeatherIcon condition={item.condition} size={26} />
              </View>
              <Text style={[styles.temp, isNow && styles.activeText]}>{Math.round(item.temp)}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingVertical: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: 65,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.38)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  time: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  temp: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  iconWrapper: {
    marginVertical: 6,
  },
});
