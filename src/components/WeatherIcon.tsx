import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  CloudLightning, 
  CloudSun,
  CloudDrizzle
} from 'lucide-react-native';

interface WeatherIconProps {
  condition: string;
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size = 48, color }) => {
  const normalizedCond = condition.trim().toLowerCase();

  const getIcon = () => {
    switch (normalizedCond) {
      case 'clear':
        return <Sun size={size} color={color || '#FFD700'} strokeWidth={1.8} />; // Golden Sun
      case 'clouds':
        return <Cloud size={size} color={color || '#A0AEC0'} strokeWidth={1.8} />; // Slate Gray Cloud
      case 'partly-cloudy':
      case 'clouds-sun':
        return <CloudSun size={size} color={color || '#CBD5E0'} strokeWidth={1.8} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={size} color={color || '#63B3ED'} strokeWidth={1.8} />; // Sky Blue Rain
      case 'snow':
        return <Snowflake size={size} color={color || '#E2E8F0'} strokeWidth={1.8} />; // Light Gray/White Snow
      case 'thunderstorm':
        return <CloudLightning size={size} color={color || '#9F7AEA'} strokeWidth={1.8} />; // Purple Storm
      default:
        // Default fallback icon
        return <Sun size={size} color={color || '#FFD700'} strokeWidth={1.8} />;
    }
  };

  return <View style={styles.container}>{getIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
