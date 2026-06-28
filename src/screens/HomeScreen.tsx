import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';
import { Search, Navigation, AlertCircle, RefreshCw } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { fetchWeatherByCity, FullWeatherData } from '../api/weather';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherDetails } from '../components/WeatherDetails';
import { ForecastHourly } from '../components/ForecastHourly';
import { ForecastWeekly } from '../components/ForecastWeekly';
import {
  sunGlowJSON,
  moonGlowJSON,
  rainAnimationJSON,
  ambientCloudsJSON,
} from '../../assets/lottie/weatherAnimations';

interface WeatherTheme {
  gradientColors: string[];
  bgImage: any;
  statusBar: 'light-content' | 'dark-content';
  lottieSource?: any;
}

const getAtmosphericTheme = (condition: string | undefined, iconCode: string | undefined): WeatherTheme => {
  const fallbackImage = require('../../assets/image/default-bg.jpg');
  if (!condition || !iconCode) {
    return {
      gradientColors: ['#1E293B', '#0F172A'],
      bgImage: fallbackImage,
      statusBar: 'light-content'
    };
  }

  const isNight = iconCode.includes('n');

  if (isNight) {
    switch (condition) {
      case 'Clear':
        return {
          gradientColors: ['#04123d', '#1E293B'],
          bgImage: require('../../assets/image/moon.jpg'),
          statusBar: 'light-content',
          lottieSource: moonGlowJSON,
        };
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return {
          gradientColors: ['#1c2541', '#0b0c10'],
          bgImage: require('../../assets/image/rain-bg.jpg'),
          statusBar: 'light-content',
          lottieSource: rainAnimationJSON,
        };
      case 'Clouds':
        return {
          gradientColors: ['#1f2833', '#0b0c10'],
          bgImage: require('../../assets/image/cloud-bg.jpg'),
          statusBar: 'light-content',
          lottieSource: ambientCloudsJSON,
        };
      case 'Snow':
        return {
          gradientColors: ['#2e3d52', '#1a2230'],
          bgImage: require('../../assets/image/snow-bg.jpg'),
          statusBar: 'light-content',
        };
      default:
        return {
          gradientColors: ['#1E293B', '#0F172A'],
          bgImage: fallbackImage,
          statusBar: 'light-content'
        };
    }
  } else {
    switch (condition) {
      case 'Clear':
        return {
          gradientColors: ['#3A7BD5', '#3a6073'],
          bgImage: require('../../assets/image/clear-bg.jpg'),
          statusBar: 'light-content',
          lottieSource: sunGlowJSON,
        };
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return {
          gradientColors: ['#485563', '#29323C'],
          bgImage: require('../../assets/image/rain-bg.jpg'),
          statusBar: 'light-content',
          lottieSource: rainAnimationJSON,
        };
      case 'Clouds':
        return {
          gradientColors: ['#606C88', '#3F4C6B'],
          bgImage: require('../../assets/image/cloud-bg.jpg'),
          statusBar: 'light-content',
          lottieSource: ambientCloudsJSON,
        };
      case 'Snow':
        return {
          gradientColors: ['#83a4d4', '#b6fbff'],
          bgImage: require('../../assets/image/snow-bg.jpg'),
          statusBar: 'dark-content',
        };
      default:
        return {
          gradientColors: ['#4e6276', '#161c22'],
          bgImage: fallbackImage,
          statusBar: 'light-content'
        };
    }
  }
};

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('New York');

  useEffect(() => {
    loadWeatherData(city);
  }, []);

  const loadWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      setCity(data.current.name);
    } catch (err) {
      setError('Could not find weather data for this location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentCondition = weatherData?.current?.weather?.[0]?.main;
  const currentIconCode = weatherData?.current?.weather?.[0]?.icon;
  const theme = getAtmosphericTheme(currentCondition, currentIconCode);

  return (
    <ImageBackground source={theme.bgImage} style={styles.masterLayout} resizeMode="cover">
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.65)']}
        style={StyleSheet.absoluteFill}
      />
      <StatusBar 
        barStyle={theme.statusBar} 
        translucent 
        backgroundColor="transparent" 
      />
      
      {theme.lottieSource && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <LottieView
            source={theme.lottieSource}
            autoPlay
            loop
            style={
              theme.lottieSource === rainAnimationJSON || theme.lottieSource === ambientCloudsJSON
                ? styles.fullscreenLottie
                : styles.ambientGlowLottie
            }
            resizeMode={
              theme.lottieSource === rainAnimationJSON || theme.lottieSource === ambientCloudsJSON
                ? 'cover'
                : 'contain'
            }
          />
        </View>
      )}

      <View style={styles.interactiveLayer}>
        <View style={styles.header}>
          <View style={styles.searchBarWrapper}>
            <Search size={18} color="rgba(255, 255, 255, 0.7)" style={styles.inputContextIcon} />
            <TextInput
              style={styles.textInputCore}
              placeholder="Search city..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => { loadWeatherData(searchQuery); Keyboard.dismiss(); setSearchQuery(''); }}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.actionCircleBtn} onPress={() => loadWeatherData('Rajkot')} activeOpacity={0.8}>
            <Navigation size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {loading && !weatherData ? (
          <View style={styles.fallbackCenterContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.statusFeedbackText}>Assembling Sky View...</Text>
          </View>
        ) : error ? (
          <View style={styles.fallbackCenterContainer}>
            <AlertCircle size={44} color="#FDA4AF" />
            <Text style={styles.errorDescriptionText}>{error}</Text>
          </View>
        ) : weatherData ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainerPadding}>
            <View style={styles.glassHeroCard}>
              <Text style={styles.locationHeadlineText}>{weatherData.current.name}</Text>
              
              <View style={styles.visualMetricsGroup}>
                <WeatherIcon condition={weatherData.current.weather[0].main} size={84} />
                <View style={styles.numericTempLayout}>
                  <Text style={styles.integerDegreeDisplay}>{Math.round(weatherData.current.main.temp)}</Text>
                  <Text style={styles.scaleIdentityMetric}>°C</Text>
                </View>
              </View>

              <Text style={styles.primaryConditionLabel}>{weatherData.current.weather[0].main}</Text>
              <Text style={styles.microDescriptorLabel}>{weatherData.current.weather[0].description}</Text>
            </View>

            <ForecastHourly data={weatherData.hourly} />
            <WeatherDetails data={weatherData.current} />
            <ForecastWeekly data={weatherData.weekly} />
          </ScrollView>
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  masterLayout: { flex: 1 },
  interactiveLayer: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, paddingTop: Platform.OS === 'android' ? 60 : 50 },
  searchBarWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 24, paddingHorizontal: 16, height: 46, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  inputContextIcon: { marginRight: 10 },
  textInputCore: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
  actionCircleBtn: { width: 46, height: 46, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  scrollContainerPadding: { paddingBottom: 32 },
  fallbackCenterContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusFeedbackText: { color: '#FFF', marginTop: 10 },
  errorDescriptionText: { color: '#FFF', textAlign: 'center', margin: 20 },
  glassHeroCard: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(219, 29, 29, 0.12)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  locationHeadlineText: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  visualMetricsGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  numericTempLayout: { flexDirection: 'row', alignItems: 'flex-start', marginLeft: 12 },
  integerDegreeDisplay: { color: '#FFFFFF', fontSize: 80, fontWeight: '200', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  scaleIdentityMetric: { color: '#38BDF8', fontSize: 24, fontWeight: '600', marginTop: 12 },
  primaryConditionLabel: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 4 },
  microDescriptorLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14, textTransform: 'capitalize', marginTop: 2 },
  fullscreenLottie: {
    ...StyleSheet.absoluteFill,
    opacity: 0.55,
  },
  ambientGlowLottie: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 60,
    right: -20,
    width: 260,
    height: 260,
    opacity: 0.45,
  },
});