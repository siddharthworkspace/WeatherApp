import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Wind, Droplets, Gauge } from 'lucide-react-native';
import { WeatherData } from '../api/weather';

interface WeatherDetailsProps {
  data: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  const { main, wind } = data;

  const details = [
    {
      id: 'feels_like',
      label: 'Feels Like',
      value: `${main.feels_like}°`,
      icon: <Thermometer size={20} color="#FF7B7B" strokeWidth={2} />,
      desc: 'How it actually feels outside',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${wind.speed} m/s`,
      icon: <Wind size={20} color="#7BE4FF" strokeWidth={2} />,
      desc: 'Current wind velocity',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${main.humidity}%`,
      icon: <Droplets size={20} color="#7B9FFF" strokeWidth={2} />,
      desc: 'Moisture level in the air',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${main.pressure} hPa`,
      icon: <Gauge size={20} color="#7BFFB7" strokeWidth={2} />,
      desc: 'Atmospheric pressure',
    },
  ];

  return (
    <View style={styles.grid}>
      {details.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 6,
    marginRight: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  desc: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
    lineHeight: 14,
  },
});
