import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Platform,
  ImageBackground,
  PermissionsAndroid,
  Alert,
  Linking,
  UIManager,
  LayoutAnimation,
  RefreshControl,
} from 'react-native';
import { Search, Navigation, AlertCircle, LocateIcon } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { fetchWeatherByCity, fetchWeatherByCoords, FullWeatherData } from '../api/weather';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherDetails } from '../components/WeatherDetails';
import { ForecastHourly } from '../components/ForecastHourly';
import { ForecastWeekly } from '../components/ForecastWeekly';
import { StatusModal } from '../components/StatusModal';
import {
  sunGlowJSON,
  moonGlowJSON,
  rainAnimationJSON,
  ambientCloudsJSON,
} from '../../assets/lottie/weatherAnimations';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WeatherTheme {
  gradientColors: string[];
  bgImage: any;
  statusBar: 'light-content' | 'dark-content';
  lottieSource?: any;
}

const getAtmosphericTheme = (condition: string | undefined, iconCode: string | undefined): WeatherTheme => {
  const fallbackImage = require('../../assets/image/default-bg.jpg');
  if (!condition || !iconCode) {
    return { gradientColors: ['#1E293B', '#0F172A'], bgImage: fallbackImage, statusBar: 'light-content' };
  }
  const isNight = iconCode.includes('n');
  if (isNight) {
    switch (condition) {
      case 'Clear': return { gradientColors: ['#04123d', '#1E293B'], bgImage: require('../../assets/image/moon.jpg'), statusBar: 'light-content', lottieSource: moonGlowJSON };
      case 'Rain': case 'Drizzle': case 'Thunderstorm': return { gradientColors: ['#1c2541', '#0b0c10'], bgImage: require('../../assets/image/rain-bg.jpg'), statusBar: 'light-content', lottieSource: rainAnimationJSON };
      case 'Clouds': return { gradientColors: ['#1f2833', '#0b0c10'], bgImage: require('../../assets/image/cloud-bg.jpg'), statusBar: 'light-content', lottieSource: ambientCloudsJSON };
      case 'Snow': return { gradientColors: ['#2e3d52', '#1a2230'], bgImage: require('../../assets/image/snow-bg.jpg'), statusBar: 'light-content' };
      default: return { gradientColors: ['#1E293B', '#0F172A'], bgImage: fallbackImage, statusBar: 'light-content' };
    }
  } else {
    switch (condition) {
      case 'Clear': return { gradientColors: ['#3A7BD5', '#3a6073'], bgImage: require('../../assets/image/clear-bg.jpg'), statusBar: 'light-content', lottieSource: sunGlowJSON };
      case 'Rain': case 'Drizzle': case 'Thunderstorm': return { gradientColors: ['#485563', '#29323C'], bgImage: require('../../assets/image/rain-bg.jpg'), statusBar: 'light-content', lottieSource: rainAnimationJSON };
      case 'Clouds': return { gradientColors: ['#606C88', '#3F4C6B'], bgImage: require('../../assets/image/cloud-bg.jpg'), statusBar: 'light-content', lottieSource: ambientCloudsJSON };
      case 'Snow': return { gradientColors: ['#83a4d4', '#b6fbff'], bgImage: require('../../assets/image/snow-bg.jpg'), statusBar: 'dark-content' };
      default: return { gradientColors: ['#4e6276', '#161c22'], bgImage: fallbackImage, statusBar: 'light-content' };
    }
  }
};

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('New York');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onAction: () => { } });

  const loadWeatherData = useCallback(async (cityName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      setCity(data.current.name);
    } catch (err) {
      setError('Could not find weather data for this location.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWeatherData(city); }, [loadWeatherData, city]);

  const fetchCurrentLocationWeather = async () => {
    setLoading(true);
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoading(false);
        return;
      }
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await fetchWeatherByCoords(latitude, longitude);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setWeatherData(data);
          setCity(data.current.name);
        } catch (err) { setError("Could not fetch weather data."); }
        finally { setLoading(false); }
      },
      (error) => {
        setLoading(false);
        if (error.code === 2 && Platform.OS === 'android') {
          promptForEnableLocationIfNeeded().then(() => fetchCurrentLocationWeather());
        } else {
          setModalConfig({ title: "Location Required", message: "Please enable location services to see local weather.", onAction: () => Linking.openSettings() });
          setModalVisible(true);
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  const theme = getAtmosphericTheme(weatherData?.current?.weather?.[0]?.main, weatherData?.current?.weather?.[0]?.icon);

  
  return (
    <ImageBackground source={theme.bgImage} style={styles.masterLayout} resizeMode="stretch">
      <LinearGradient colors={['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.65)']} style={StyleSheet.absoluteFill} />
      <StatusBar barStyle={theme.statusBar} translucent backgroundColor="transparent" />
      <StatusModal visible={modalVisible} title={modalConfig.title} message={modalConfig.message} onClose={() => setModalVisible(false)} onConfirm={() => { modalConfig.onAction(); setModalVisible(false); }} />

      <View style={styles.interactiveLayer}>
        <View style={styles.header}>
          <View style={styles.searchBarWrapper}>
            <Search size={18} color="rgba(255, 255, 255, 0.7)" style={styles.inputContextIcon} />
            <TextInput style={styles.textInputCore} placeholder="Search city..." placeholderTextColor="rgba(255, 255, 255, 0.5)" value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={() => { loadWeatherData(searchQuery); Keyboard.dismiss(); setSearchQuery(''); }} returnKeyType="search" />
          </View>
          {/* <TouchableOpacity style={styles.actionCircleBtn} onPress={() => loadWeatherData('Rajkot')} activeOpacity={0.8}><Navigation size={20} color="#FFFFFF" /></TouchableOpacity> */}
          <TouchableOpacity style={styles.actionCircleBtn} onPress={fetchCurrentLocationWeather} activeOpacity={0.8}><LocateIcon size={20} color="#FFFFFF" /></TouchableOpacity>
        </View>

        {loading && !weatherData ? (
          <View style={styles.fallbackCenterContainer}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.statusFeedbackText}>Assembling Sky View...</Text></View>
        ) : error ? (
          <View style={styles.fallbackCenterContainer}><AlertCircle size={44} color="#FDA4AF" /><Text style={styles.errorDescriptionText}>{error}</Text></View>
        ) : weatherData ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainerPadding} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadWeatherData(city)} tintColor="#FFFFFF" />}>
            <View style={styles.glassHeroCard}>
              <Text style={styles.locationHeadlineText}>{weatherData.current.name}</Text>
              <View style={styles.visualMetricsGroup}>
                <WeatherIcon condition={weatherData.current.weather[0].main} size={84} />
                <View style={styles.numericTempLayout}><Text style={styles.integerDegreeDisplay}>{Math.round(weatherData.current.main.temp)}</Text><Text style={styles.scaleIdentityMetric}>°C</Text></View>
              </View>
              <Text style={styles.primaryConditionLabel}>{weatherData.current.weather[0].main}</Text>
              <Text style={styles.microDescriptorLabel}>{weatherData.current.weather[0].description}</Text>
            </View>
            <ForecastHourly data={weatherData.hourly} /><WeatherDetails data={weatherData.current} /><ForecastWeekly data={weatherData.weekly} />
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
  glassHeroCard: { marginHorizontal: 16, marginTop: 10, marginBottom: 20, paddingVertical: 24, paddingHorizontal: 20, backgroundColor: 'rgba(134, 134, 134, 0.12)', borderRadius: 30, borderWidth: 1, borderColor: 'rgba(128, 126, 126, 0.22)', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  locationHeadlineText: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  visualMetricsGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  numericTempLayout: { flexDirection: 'row', alignItems: 'flex-start', marginLeft: 12 },
  integerDegreeDisplay: { color: '#FFFFFF', fontSize: 80, fontWeight: '200', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  scaleIdentityMetric: { color: '#38BDF8', fontSize: 24, fontWeight: '600', marginTop: 12 },
  primaryConditionLabel: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 4 },
  microDescriptorLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14, textTransform: 'capitalize', marginTop: 2 }
});